if (window.parent !== window) throw "stop";

/////////////////////////////////////////////////////////////
//                      Global Settings                    //
/////////////////////////////////////////////////////////////

////////////////
// REMOVE ADS //
////////////////

chrome.storage.sync.get('enableAds', function(items) {
	if (items.enableAds == false) {
		// This will hide the Ads by inserting a CSS file to the head tag. Using this method the Ads won't appear for a split second before they are removed //
		$('head').append('<link href='+chrome.runtime.getURL('InjectedCSS/hideGlobalAds.css')+' rel="stylesheet" type="text/css">');
		$(document).ready(function() {
			/*
				List of every Ad on the site with ID's and Location:
				#BB_S*        : Located on left and right sides of the Entire Site.
				#divAds       : Located below the Latest Update Section on the Homepage and on the Episodes List Page below the Summary Box.
				#divAds2      : Located below the Banner (random anime box) on the Homepage.
				#adsIfrme1    : Located at the bottom of the Homepage.
				#adsIfrme2    : Located on the /AnimeList Page on the right side towards the bottom and on the Episodes List Page inside the Episode's Box.
				#adsIfrme3    : Located on the Episodes List Page on the right side below the Related Links Box.
				#adsIfrme6    : Located on the Video Page above the video (Left Ad).
				#adsIfrme7    : Located on the Video Page below the video.
				#adsIfrme8    : Located on the Video Page above the video (Right Ad).
				#adsIfrme10   : Located on the Video Page below the video.
								NOTE: This Ad is used to do a AdBlocker Check. There is a setTimeout that waits 2 seconds before calling DoDetect1() which checks to see if this Ad is visible.
								If it's not then it will call DoDetect2() which will remove the video and replace it with the Please Disable AdBlocker message.
				#adsIfrme11   : Located on the Video Page to the right of the video.
				.divCloseBut  : Close Buttons for Ads. Located below almost every Ad.
				.divCloseBut2 : Close Buttons for Ads. Located below almost every Ad.

			*/
			$(document).arrive('a[href*="server.cpmstar.com/"]', sideAds = function() {
				$(this).parent().remove();
				$('script:contains("cpmstar_siteskin_settings")').remove();
				document.unbindArrive(sideAds);
			});
			$(document).arrive('[id*="BB_S"]', sideAds = function() {
				$(this).remove();
				$('script[id*="bb_sa"]').remove();
				document.unbindArrive(sideAds);
			});
			$('script[src*="bebi"], #divAds, #divAds2, #adsIfrme1, #adsIfrme2, #adsIfrme3, #adsIfrme6, #adsIfrme7, #adsIfrme8, #divFloatLeft, #divFloatRight, .divCloseBut, .divCloseBut2').remove();
			setTimeout(function() {$("#adsIfrme10").remove()},5000);
			$('div:contains("Remove ads")', '#rightside').remove();
			$('.rightBox iframe[src*="https://odddaily.com/ads.html"]').closest('.rightBox').remove();
			$('iframe[src*="/xyz/check.aspx"]').remove();
			// Thanks to https://www.reddit.com/user/SniperOmicron for adding on to this //

			console.log('Ads Removed');

			///////////////////////////////////////////////////
			// Cleans up empty space left behind by the Ads. //
			///////////////////////////////////////////////////

			$('#leftside .clear, #leftside .clear2, #leftside div[style="text-align: center; padding: 10px 0px 10px 0px;"]').remove();
			if ($("#centerDivVideo").length) $('.barContent > div > .clear, .clear2').remove();

			///////////////////////////////////////////////////////////////////
			// Rearranges the elements on the Video Page if Ads are disabled //
			///////////////////////////////////////////////////////////////////

			if ($('#centerDivVideo').length) {
				$('#centerDivVideo').css("margin-top", "10px");
				// $('#centerDivVideo').css("margin-top", "-10px");
				$('#switch').parent().attr('id', 'playerSwitchLightsOffContainer')
				$('#playerSwitchLightsOffContainer').detach().insertAfter('#centerDivVideo');
				$('#playerSwitchLightsOffContainer').css("margin-top", "10px");

				//$('.barContent').css('padding-left', '0px');
				//$('#centerDivVideo').css('margin-left', '-20px');
			}

		});
	} else {
		// Adds close button to ads that don't have them
		var ads = ['#divAds', '#divAds2', '#adsIfrme1', '#adsIfrme2', '#adsIfrme3', '#adsIfrme6', '#adsIfrme7', '#adsIfrme8', '#adsIfrme10', '#adsIfrme11'];
		$(window).ready(function() {
			$.each(ads, function(index, value) {
				if ( $(value).next().attr('class') !== 'divCloseBut' ) {
					$(value).after('<div class="divCloseBut"><a href="#" onclick="$(this).parent().prev().remove();$(this).remove();return false;">Hide</a></div>');
				} else if ( $(value).next().attr('class') === 'divCloseBut' ) { // Replaces old Close Buttons so they won't run any of KissAnime's functions when clicked
					$(value).next().remove();
					$(value).after('<div class="divCloseBut"><a href="#" onclick="$(this).parent().prev().remove();$(this).remove();return false;">Hide</a></div>');
				}
			});
		});
		// Adds close button to ads that don't have them
		/* $(document).ready(function() {
			$('#divAds, #divAds2').after('<div class="divCloseBut" style="position:relative;text-align:center;top:5px;"><a href="#" onclick="$(this).parent().prev().remove();$(this).remove();return false;">Hide</a></div>');
			$('#adsIfrme2').after('<div class="divCloseBut" style="position:relative;left:-65px;"><a href="#" onclick="$(this).parent().prev().remove();$(this).remove();return false;">Hide</a></div>');
		}); */
	}
});

/////////////////////////////////
// REMOVE SOCIAL MEIDA BUTTONS //
/////////////////////////////////

chrome.storage.sync.get('enableSocialButtons', function(items) {
	if (items.enableSocialButtons == false) {
		$('head').append('<link href='+chrome.runtime.getURL('InjectedCSS/hideSocialMedia.css')+' rel="stylesheet" type="text/css">');
		var atcounter = 0; var atint = setInterval(function() {
			$('head script[src*="addthis"], head script[src*="plusone"]').remove();
			atcounter++;
			if (atcounter > 100) clearInterval(atint);
		}, 50);
		$(document).ready(function() {
			$('[id*="plusone"], [class*="plusone"], [class*="addthis"], #_atssh').remove();
			$('[src$="icon_rss.png"]').closest('div').remove();
			$('div:contains("Like me please")', '#rightside').remove();
		});
	};
});

/////////////////////////
// CHANGE HEADER LOGOS //
/////////////////////////

var headerStyle = '';
function headerLogo(style) {
	headerStyle += style;
	$('#efka_headerLogo_style').remove();
	$('head').append(`<style id="efka_headerLogo_style">#head .logo {width: 360px !important} ${headerStyle}</style>`);
}

chrome.storage.sync.get(['enableCustomLogo', 'HeaderLogos', 'userlogo', 'userlogoPosLeft', 'userlogoPosTop', 'userlogoSize'], function(items) {
	if (items.enableCustomLogo == true) {

		if (items.HeaderLogos === 'custom') {
			var userlogoPosLeft; if (items.userlogoPosLeft) userlogoPosLeft = items.userlogoPosLeft; else userlogoPosLeft = '100';
			var userlogoPosTop; if (items.userlogoPosTop) userlogoPosTop = items.userlogoPosTop; else userlogoPosTop = '0';
			var userlogoSize; if (items.userlogoSize) userlogoSize = items. userlogoSize; else userlogoSize = '100';
			headerLogo('#head > h1 { background-image: url('+chrome.runtime.getURL('images/KissAnimeImageAssets/logo-user-template.png')+'), url('+items.userlogo+') !important; background-position: center left, '+userlogoPosLeft+'% '+userlogoPosTop+'% !important; background-color: transparent !important; background-repeat: no-repeat !important; background-size: auto, auto '+userlogoSize+'% !important}');
		} else {
			headerLogo(`#head > h1 {background: transparent url(${chrome.extension.getURL('images/KissAnimeImageAssets/'+ items.HeaderLogos +'.png')}) no-repeat !important}`);
		}

		// if (items.HeaderLogos == 'logo1') {
		// 	headerLogo('#head > h1 {background: transparent url('+chrome.extension.getURL('images/KissAnimeImageAssets/logo1.png')+') no-repeat !important}');
		// } else if (items.HeaderLogos == 'logo2') {
		// 	headerLogo('#head > h1 {background: transparent url('+chrome.extension.getURL('images/KissAnimeImageAssets/logo2.png')+') no-repeat !important}');
		// } else if (items.HeaderLogos == 'logo3') {
		// 	headerLogo('#head > h1 {background: transparent url('+chrome.extension.getURL('images/KissAnimeImageAssets/logo3.png')+') no-repeat !important}');
		// } else if (items.HeaderLogos == 'logo4') {
		// 	headerLogo('#head > h1 {background: transparent url('+chrome.extension.getURL('images/KissAnimeImageAssets/logo4.png')+') no-repeat !important}');
		// } else if (items.HeaderLogos == 'logo5') {
		// 	headerLogo('#head > h1 {background: transparent url('+chrome.extension.getURL('images/KissAnimeImageAssets/logo5.png')+') no-repeat !important}');
		// } else if (items.HeaderLogos == 'logo6') {
		// 	headerLogo('#head > h1 {background: transparent url('+chrome.extension.getURL('images/KissAnimeImageAssets/logo6.png')+') no-repeat !important}');
		// } else if (items.HeaderLogos == 'logo7') {
		// 	headerLogo('#head > h1 {background: transparent url('+chrome.extension.getURL('images/KissAnimeImageAssets/logo7.png')+') no-repeat !important}');
		// } else if (items.HeaderLogos == 'logo8') {
		// 	headerLogo('#head > h1 {background: transparent url('+chrome.extension.getURL('images/KissAnimeImageAssets/logo8.png')+') no-repeat !important}');
		// } else if (items.HeaderLogos == 'logo10') {
		// 	headerLogo('#head > h1 {background: transparent url('+chrome.extension.getURL('images/KissAnimeImageAssets/logo10.png')+') no-repeat !important}'); // Credit to Dragha on DeviantArt for the image used in this logo //
		// } else if (items.HeaderLogos == 'logo11') {
		// 	headerLogo('#head > h1 {background: transparent url('+chrome.extension.getURL('images/KissAnimeImageAssets/logo-holiday.png')+') no-repeat !important} #head .logo {width: 360px !important}');
		// } else if (items.HeaderLogos == "custom") {
		// 	var userlogoPosLeft; if (items.userlogoPosLeft) userlogoPosLeft = items.userlogoPosLeft; else userlogoPosLeft = '100';
		// 	var userlogoPosTop; if (items.userlogoPosTop) userlogoPosTop = items.userlogoPosTop; else userlogoPosTop = '0';
		// 	var userlogoSize; if (items.userlogoSize) userlogoSize = items. userlogoSize; else userlogoSize = '100';
		// 	headerLogo('#head > h1 { background-image: url('+chrome.runtime.getURL('images/KissAnimeImageAssets/logo-user-template.png')+'), url('+items.userlogo+') !important; background-position: center left, '+userlogoPosLeft+'% '+userlogoPosTop+'% !important; background-color: transparent !important; background-repeat: no-repeat !important; background-size: auto, auto '+userlogoSize+'% !important}');
		// }
	};
});

////////////////////
// CUSTOM SCHEME //
///////////////////

var styles = '';
function styleHead(style) {
	styles += style;
	$('#efka_custom_styles').remove();
	$('head').append(`<style id="efka_custom_styles">${styles}</style>`);
};

// This is a huge mess and I completely regret doing this. This probably won't ever be updated as it is a pain to manage. Please do not ask why I did this. I don't know myself //
chrome.storage.sync.get('enableCustomScheme', function(items) {

	if (items.enableCustomScheme == true) {
		doCustomScheme(); // Load Custom Scheme on page load
		chrome.storage.onChanged.addListener(function(changes, namespace) {
			for (key in changes) {
				if (key.indexOf('cs_') == 0) {
					console.log(changes[key]);
					styles = '';
					doCustomScheme();
					return false; // Only want this to happen once
				} else if (key == 'enableCustomScheme') {
					if (changes[key].newValue == true) {
						styles = '';
						doCustomScheme();
					} else {
						$('#efka_custom_styles').remove();
					}
				}
			}
		});

		function doCustomScheme() {
			chrome.storage.sync.get(function(items) {
				// Custom Scheme Background //
				if (items.cs_background == "color") {
					if (items.cs_background_color) styleHead('html, #containerRoot {background: '+items.cs_background_color+' !important}');
				} else if (items.cs_background == "image") {
					if (items.cs_background_image) {
						var backgroundImageColor; if (items.cs_background_image_color) backgroundImageColor = items.cs_background_image_color; else backgroundImageColor = '#161616';
						styleHead('html, body, #containerRoot {background: url('+items.cs_background_image+') '+backgroundImageColor+'; background-size: cover; background-attachment: fixed; background-repeat: no-repeat;}');

						var backgroundImageX; if (items.cs_background_image_position_x) backgroundImageX = items.cs_background_image_position_x;
						var backgroundImageY; if (items.cs_background_image_position_y) backgroundImageY = items.cs_background_image_position_y;
						styleHead('html, body, #containerRoot {background-position: '+backgroundImageX+' '+backgroundImageY+'}');
					}
				}
				if (items.cs_transition_background_color) styleHead('.banner, #WelcomeBox, #PinnedBox, #leftside .bigBarContainer, #subcontent, .rightBox {-webkit-transition: 0.5s}');
				if (items.cs_transition_background_color) styleHead('.banner:hover, #WelcomeBox:hover, #PinnedBox:hover, #leftside .bigBarContainer:hover, #subcontent:hover, .rightBox:hover {background: '+items.cs_transition_background_color+' !important}');

				// User Top Box //
				if (items.cs_topholderbox_background_color) styleHead('#topHolderBox {background: '+items.cs_topholderbox_background_color+' !important}');
				if (items.cs_topholderbox_text_color) styleHead('#topHolderBox * {color: '+items.cs_topholderbox_text_color+' !important} #topHolderBox a {color: #EEE !important}');
				if (items.cs_topholderbox_link_color) styleHead('#topHolderBox a {color: '+items.cs_topholderbox_link_color+' !important}');
				if (items.cs_topholderbox_link_hover_color) styleHead('#topHolderBox a:hover {color: '+items.cs_topholderbox_link_hover_color+' !important}');
				// Navbar //
				if (items.cs_navbar_background_color) styleHead('#navbar, #search:after {background: '+items.cs_navbar_background_color+' !important}');

				if (items.cs_navbar_tab_current_background_color) styleHead('#navbar #currentTab {background: '+items.cs_navbar_tab_current_background_color+' url('+chrome.runtime.getURL('/images/button_overlay.png')+') !important; border-radius: 6px 6px 0 0}');
				if (items.cs_navbar_tab_current_text_color) styleHead('#navbar a#currentTab {color: '+items.cs_navbar_tab_current_text_color+' !important}');
				if (items.cs_navbar_tab_other_background_color) styleHead('#navbar a {background: '+items.cs_navbar_tab_other_background_color+' url('+chrome.runtime.getURL('/images/button_overlay.png')+') !important; border-radius: 6px 6px 0 0}');
				if (items.cs_navbar_tab_other_text_color) styleHead('#navbar a {color: '+items.cs_navbar_tab_other_text_color+' !important}');
				if (items.cs_navbar_tab_hover_background_color) styleHead('#navbar a:hover {background: '+items.cs_navbar_tab_hover_background_color+' url('+chrome.runtime.getURL('/images/button_overlay.png')+') !important; border-radius: 6px 6px 0 0}');

				if (items.cs_navbar_sub_background_color) styleHead('#navsubbar {background: '+items.cs_navbar_sub_background_color+' !important}');
				if (items.cs_navbar_sub_link_color) styleHead('#navsubbar a {color: '+items.cs_navbar_sub_link_color+' !important}');
				if (items.cs_navbar_sub_link_hover_color) styleHead('#navsubbar a:hover {color: '+items.cs_navbar_sub_link_hover_color+' !important}');
				// Footer //
				if (items.cs_footer_background_color) styleHead('#footer {background: '+items.cs_footer_background_color+' !important}');
				if (items.cs_footer_text_color) styleHead('#footer * {color: '+items.cs_footer_text_color+' !important} #footer a {color: #cccccc !important} #footer a:hover {color: #ff9600 !important}');
				if (items.cs_footer_link_color) styleHead('#footer a {color: '+items.cs_footer_link_color+' !important}');
				if (items.cs_footer_link_hover_color) styleHead('#footer a:hover {color: '+items.cs_footer_link_hover_color+' !important}');
				if ( /kiss(anime|cartoon).(ru|se)\/$/.test(window.location.href) == true ) { // Checks if on homepage so this won't affect other pages with the "bigBarContainer" or "rightBox" classes //
					// Homepage Banner //
					if (items.cs_banner_background_color) styleHead('.banner {background: '+items.cs_banner_background_color+' !important; border: 1px solid '+items.cs_banner_background_color+' !important}');
					if (items.cs_banner_text_color) styleHead('.banner * {color: '+items.cs_banner_text_color+' !important} .banner a {color: #d5f406 !important} .banner a:hover {color: #648f06 !important}');
					if (items.cs_banner_link_color) styleHead('.banner a {color: '+items.cs_banner_link_color+' !important}');
					if (items.cs_banner_link_hover_color) styleHead('.banner a:hover {color: '+items.cs_banner_link_hover_color+' !important}');
					// Welcome Box //
					if (items.cs_welcomebox_titlebar_background_color) styleHead('#WelcomeBoxTitle {background: '+items.cs_welcomebox_titlebar_background_color+' !important} #WelcomeBoxContent .arrow-general {display:none !important} #WelcomeBoxContent:before {display: block; width: 0; height: 0; border-bottom: 12px solid '+items.cs_welcomebox_titlebar_background_color+'; border-left: 12px solid transparent; top: -18px; position: relative; transform: rotate(45deg); content: ""}');
					if (items.cs_welcomebox_titlebar_text_color) styleHead('#WelcomeBoxTitle {color: '+items.cs_welcomebox_titlebar_text_color+' !important}');

					if (items.cs_welcomebox_background_color) styleHead('#WelcomeBox {background: '+items.cs_welcomebox_background_color+' !important; border: 1px solid '+items.cs_welcomebox_background_color+' !important} #WelcomeBoxContent {background: none !important}');
					if (items.cs_welcomebox_text_color) styleHead('#WelcomeBoxContent * {color: '+items.cs_welcomebox_text_color+'} #WelcomeBoxContent a {color: #d5f406 !important} #WelcomeBoxContent a:hover {color: #648f06 !important}');
					if (items.cs_welcomebox_link_color) styleHead('#WelcomeBoxContent a {color: '+items.cs_welcomebox_link_color+' !important} #WelcomeBoxContent a:hover {color: #648f06 !important}');
					if (items.cs_welcomebox_link_hover_color) styleHead('#WelcomeBoxContent a:hover {color: '+items.cs_welcomebox_link_hover_color+' !important}');
					// Pinned Box //
					if (items.cs_pinnedbox_titlebar_background_color) styleHead('#PinnedBoxTitle {background: '+items.cs_pinnedbox_titlebar_background_color+' !important} #PinnedBoxContent .arrow-general {display:none !important} #PinnedBoxContent:before {display: block; width: 0; height: 0; border-bottom: 12px solid '+items.cs_pinnedbox_titlebar_background_color+'; border-left: 12px solid transparent; top: -18px; position: relative; transform: rotate(45deg); content: ""}');
					if (items.cs_pinnedbox_titlebar_text_color) styleHead('#PinnedBoxTitle {color: '+items.cs_pinnedbox_titlebar_text_color+' !important}');

					if (items.cs_pinnedbox_background_color) styleHead('#PinnedBox {background: '+items.cs_pinnedbox_background_color+' !important; border: 1px solid '+items.cs_pinnedbox_background_color+' !important} #PinnedBoxContent {background: none !important}');
					if (items.cs_pinnedbox_link_color) styleHead('#PinnedBoxContent a {color: '+items.cs_pinnedbox_link_color+' !important} #PinnedBoxContent a:hover {color: #648f06 !important} #PinnedBoxContent .PinnedLatestEpisode {color: skyblue !important} #PinnedBoxContent .PinnedLatestEpisode:visited {color: #888888 !important}');
					if (items.cs_pinnedbox_link_hover_color) styleHead('#PinnedBoxContent a:hover, #PinnedBoxContent .PinnedLatestEpisode:hover {color: '+items.cs_pinnedbox_link_hover_color+' !important}');
					// Latest Update //
					if (items.cs_latestupdate_titlebar_background_color) styleHead('#leftside .barTitle {background: '+items.cs_latestupdate_titlebar_background_color+' !important} #leftside .arrow-general {display:none !important} #leftside .barContent:before, #leftside #recentUpdates:before {display: block; width: 0; height: 0; border-bottom: 12px solid '+items.cs_latestupdate_titlebar_background_color+'; border-left: 12px solid transparent; top: -18px; position: relative; transform: rotate(45deg); content: ""}');
					if (items.cs_latestupdate_titlebar_text_color) styleHead('#leftside .barTitle .scrollable_title {color: '+items.cs_latestupdate_titlebar_text_color+' !important}');

					if (items.cs_latestupdate_background_color) styleHead('#leftside .bigBarContainer {background: '+items.cs_latestupdate_background_color+' !important; border: 1px solid '+items.cs_latestupdate_background_color+' !important} #leftside .barContent, #leftside #recentUpdates {background: none !important} #leftside #recentUpdates .listing tr.odd {background: none repeat scroll 0 0 '+items.cs_pinnedbox_background_color+' !important}');
					if (items.cs_latestupdate_background_color && items.enableAltRecentList) styleHead('.listing tr:nth-child(odd) td {background: none repeat scroll 0 0 '+items.cs_pinnedbox_background_color+' !important}');
					if (items.cs_contentboxes_background_hover_color && items.enableAltRecentList) styleHead('.listing tr:hover td {background: none repeat scroll 0 0 '+items.cs_contentboxes_background_hover_color+' !important}');
					if (items.cs_latestupdate_text_color) styleHead('#leftside .barContent, #leftside #recentUpdates {color: '+items.cs_latestupdate_text_color+' !important}');
					if (items.cs_latestupdate_link_color) styleHead('#leftside .barContent a, #leftside #recentUpdates a {color: '+items.cs_latestupdate_link_color+' !important} #leftside .barContent a:hover, #leftside #recentUpdates a:hover {color: #648f06 !important}');
					if (items.cs_latestupdate_link_hover_color) styleHead('#leftside .barContent a:hover, #leftside #recentUpdates a:hover {color: '+items.cs_latestupdate_link_hover_color+' !important}');
					// Right Boxes //
					if (items.cs_rightboxes_titlebar_background_color) styleHead('.rightBox .barTitle {background: '+items.cs_rightboxes_titlebar_background_color+' !important} .rightBox .barContent .arrow-general {display:none !important} .rightBox .barContent:before {display: block; width: 0; height: 0; border-bottom: 12px solid '+items.cs_rightboxes_titlebar_background_color+'; border-left: 12px solid transparent; top: -18px; position: relative; transform: rotate(45deg); content: ""}');
					if (items.cs_rightboxes_titlebar_text_color) styleHead('.rightBox .barTitle {color: '+items.cs_rightboxes_titlebar_text_color+' !important}');

					if (items.cs_rightboxes_background_color) styleHead('.rightBox {background: '+items.cs_rightboxes_background_color+' !important; border: 1px solid '+items.cs_rightboxes_background_color+' !important} .rightBox .barContent {background: none !important}');
					if (items.cs_rightboxes_link_color) styleHead('.rightBox .barContent a {color: '+items.cs_rightboxes_link_color+' !important} .rightBox .barContent a:hover {color: #648f06 !important} a.textDark {color: #888888 !important}');
					if (items.cs_rightboxes_link_hover_color) styleHead('.rightBox .barContent a:hover {color: '+items.cs_rightboxes_link_hover_color+' !important}');
					// SubContent //
					if (items.cs_subcontent_tab_current_background_color) styleHead('#tabmenucontainer .tabactive {background: '+items.cs_subcontent_tab_current_background_color+' url('+chrome.runtime.getURL('/images/button_overlay2.png')+') !important; border-radius: 6px 6px 0 0; width: 123px !important; margin-right: 2px !important}');
					if (items.cs_subcontent_tab_current_text_color) styleHead('#tabmenucontainer .tabactive {color: '+items.cs_subcontent_tab_current_text_color+' !important}');
					if (items.cs_subcontent_tab_other_background_color) styleHead('#tabmenucontainer a {background: '+items.cs_subcontent_tab_other_background_color+' url('+chrome.runtime.getURL('/images/button_overlay2.png')+') !important; border-radius: 6px 6px 0 0; width: 123px !important; margin-right: 2px !important}');
					if (items.cs_subcontent_tab_other_text_color) styleHead('#tabmenucontainer a {color: '+items.cs_subcontent_tab_other_text_color+' !important}');
					if (items.cs_subcontent_tab_hover_background_color) styleHead('#tabmenucontainer a:hover {background: '+items.cs_subcontent_tab_hover_background_color+' url('+chrome.runtime.getURL('/images/button_overlay2.png')+') !important; border-radius: 6px 6px 0 0; width: 123px !important; margin-right: 2px !important}');

					if (items.cs_subcontent_content_background_color) styleHead('#subcontent div div {background: '+items.cs_subcontent_content_background_color+' !important} #subcontent div div div {background: none !important} #subcontent {background: none !important; border: 1px solid '+items.cs_subcontent_content_background_color+' !important}');
					if (items.cs_subcontent_content_background_color2) styleHead('#subcontent div div.blue {background: '+items.cs_subcontent_content_background_color2+' !important}  #subcontent div div.blue div {background: none !important}');
					if (items.cs_subcontent_content_text_color) styleHead('#subcontent .info {color: '+items.cs_subcontent_content_text_color+' !important}');
					if (items.cs_subcontent_content_link_color) styleHead('#subcontent a, #subcontent .title {color: '+items.cs_subcontent_content_link_color+' !important} #subcontent a:hover, #subcontent .title:hover {color: #648f06 !important}');
					if (items.cs_subcontent_content_link_hover_color) styleHead('#subcontent a:hover, #subcontent .title:hover {color: '+items.cs_subcontent_content_link_hover_color+' !important}');
				}
				if ( /kiss(anime|cartoon).(ru|se)\/$/.test(window.location.href) == false ) { // For everything else that is not on the homepage. I'm to lazy to add options to theme everything individually //
					// Content Boxes //
					if (items.cs_contentboxes_titlebar_background_color) styleHead('#leftside .barTitle, .rightBox .barTitle {background: '+items.cs_contentboxes_titlebar_background_color+' !important} .barContent .arrow-general {display:none !important} #leftside .barContent:before, .rightBox .barContent:before {display: block; width: 0; height: 0; border-bottom: 12px solid '+items.cs_contentboxes_titlebar_background_color+'; border-left: 12px solid transparent; top: -18px; position: relative; transform: rotate(45deg); content: ""}');
					if (items.cs_contentboxes_titlebar_text_color) styleHead('.barTitle {color: '+items.cs_contentboxes_titlebar_text_color+' !important}');

					if (items.cs_contentboxes_background_color) styleHead('#leftside .bigBarContainer, .rightBox, #leftside .bigBarContainer .listing tr.odd, #divComments {background: '+items.cs_contentboxes_background_color+' !important; border: 1px solid '+items.cs_contentboxes_background_color+' !important} #leftside .barContent, .rightBox .barContent, .bigBarContainer .alphabet {background: none !important}');
					if (items.cs_contentboxes_background_hover_color) styleHead('.listing tr:hover td {background: '+items.cs_contentboxes_background_hover_color+' !important}');
					if (items.cs_contentboxes_text_color) styleHead('#leftside .barContent, .rightBox .barContent {color: '+items.cs_contentboxes_text_color+' !important}');
					if (items.cs_contentboxes_link_color) styleHead('#leftside .barContent a, .rightBox .barContent a {color: '+items.cs_contentboxes_link_color+' !important} #leftside .barContent a:hover, .rightBox .barContent a:hover {color: #648f06 !important} #leftside .listing a:visited, .episodeVisited {color: #648f06 !important}');
					if (items.cs_contentboxes_link_visited_color) styleHead('#leftside .listing a:visited, .episodeVisited {color: '+items.cs_contentboxes_link_visited_color+' !important}');
					if (items.cs_contentboxes_link_hover_color) styleHead('#leftside .barContent a:hover, .rightBox .barContent a:hover {color: '+items.cs_contentboxes_link_hover_color+' !important}');

					if ( /kiss(anime|cartoon).(ru|se)\/BookmarkList$/.test(window.location.href) == true || window.location.href.indexOf("kissanime.ru/MyList/") > -1 ) {
						if (items.cs_contentboxes_titlebar_background_color) styleHead('.barTitle {background: '+items.cs_contentboxes_titlebar_background_color+' !important} .barContent .arrow-general {display:none !important} .barContent:before {display: block; width: 0; height: 0; border-bottom: 12px solid '+items.cs_contentboxes_titlebar_background_color+'; border-left: 12px solid transparent; top: -18px; position: relative; transform: rotate(45deg); content: ""}');
						if (items.cs_contentboxes_titlebar_text_color) styleHead('.barTitle {color: '+items.cs_contentboxes_titlebar_text_color+' !important}');

						if (items.cs_contentboxes_background_color) styleHead('.bigBarContainer, .listing tr:nth-child(odd) {background: '+items.cs_contentboxes_background_color+' !important; border: 1px solid '+items.cs_contentboxes_background_color+' !important} .barContent {background: none !important}');
						if (items.cs_contentboxes_text_color) styleHead('.barContent {color: '+items.cs_contentboxes_text_color+' !important}');
						if (items.cs_contentboxes_link_color) styleHead('.barContent a {color: '+items.cs_contentboxes_link_color+' !important} .barContent a:hover {color: #648f06 !important} .listing tr td:nth-child(2) a:visited {color: #648f06 !important}');
						if (items.cs_contentboxes_link_visited_color) styleHead('.listing a:visited, .episodeVisited {color: '+items.cs_contentboxes_link_visited_color+' !important}');
						if (items.cs_contentboxes_link_hover_color) styleHead('.barContent a:hover {color: '+items.cs_contentboxes_link_hover_color+' !important}');
					}

					if ( /kiss(anime|cartoon).(ru|se)\/Message\/ReportError$/.test(window.location.href) == true ) {
						if (items.cs_contentboxes_titlebar_background_color) styleHead('.barTitle {background: '+items.cs_contentboxes_titlebar_background_color+' !important} .barContent .arrow-general {display:none !important} .barContent:before {display: block; width: 0; height: 0; border-bottom: 12px solid '+items.cs_contentboxes_titlebar_background_color+'; border-left: 12px solid transparent; top: -18px; position: relative; transform: rotate(45deg); content: ""}');
						if (items.cs_contentboxes_titlebar_text_color) styleHead('.barTitle {color: '+items.cs_contentboxes_titlebar_text_color+' !important}');

						if (items.cs_contentboxes_background_color) styleHead('.bigBarContainer {background: '+items.cs_contentboxes_background_color+' !important; border: 1px solid '+items.cs_contentboxes_background_color+' !important} .barContent {background: none !important}');
						if (items.cs_contentboxes_text_color) styleHead('.barContent {color: '+items.cs_contentboxes_text_color+' !important}');
						if (items.cs_contentboxes_link_color) styleHead('.barContent a {color: '+items.cs_contentboxes_link_color+' !important} #leftside .barContent a:hover, .rightBox .barContent a:hover {color: #648f06 !important}');
						if (items.cs_contentboxes_link_hover_color) styleHead('.barContent a:hover {color: '+items.cs_contentboxes_link_hover_color+' !important}');
					}

				}
				$(document).ready(function() {
					if ($('#divContentVideo').length) {
						if (items.cs_videopage_container_background_color) styleHead('.bigBarContainer, .barContent {background: '+items.cs_videopage_container_background_color+' !important; border: 1px solid '+items.cs_videopage_container_background_color+' !important}');
						if (items.cs_videopage_container_text_color) styleHead('.barContent {color: '+items.cs_videopage_container_text_color+' !important}');
						if (items.cs_videopage_container_link_color) styleHead('.barContent a {color: '+items.cs_videopage_container_link_color+' !important}');
						if (items.cs_videopage_container_link_hover_color) styleHead('.barContent a:hover {color: '+items.cs_videopage_container_link_hover_color+' !important}');
					}
				});
			});
		}


	}
});

////////////////////
// SLIMMER HEADER //
////////////////////////////////////////////////////
// Idea by Swyter over at https://greasyfork.org/ //
////////////////////////////////////////////////////

chrome.storage.sync.get(['enableSlimHeader', 'enableCustomLogo'], function(items) {
	if (items.enableSlimHeader == true) {
		$('head').append('<link href='+chrome.runtime.getURL('InjectedCSS/SlimmerHeader.css')+' rel="stylesheet" type="text/css">');
		if (items.enableCustomLogo == false || items.enableCustomLogo == null) $("head").append("<style>#head > h1 {background: transparent url("+chrome.extension.getURL("images/KissAnimeImageAssets/logo-min.png")+") no-repeat !important}</style>");
		$(document).ready(function() {
			$('#result_box').next().remove();
		});
	}
});

$(document).ready(function() {

	/////////////////
	// Hide Footer //
	/////////////////

	chrome.storage.sync.get('enableFooter', function(items) {
		if (items.enableFooter == false) $('#footer').css('display', 'none');
	});

	/////////////////////////////
	// REMOVE COMMENT SECTIONS //
	/////////////////////////////

	chrome.storage.sync.get('enableCommentSections', function(items) {
		if (items.enableCommentSections == false) {
			$("#disqus_thread").closest('.bigBarContainer').remove();
			if ($("#centerDivVideo").length){
				$('div:contains("Please do NOT spoil content of NEXT episodes ")', '#containerRoot').hide();
				$('#btnShowComments').parent().remove();
				$('#divComments').hide();
			};
		};
	});


	// Used to theme the site during special occasions. // Loads external HTML with CSS and Javascript //
	$('body').append('<div id="holiday_check" style="display:none"></div>');
	$('#holiday_check').load('https://s3.amazonaws.com/essentialsforkissanime/HolidayCheck.html');

	//////////////////////////////////////////////////////////
	//                     MISCELLANEOUS                    //
	//////////////////////////////////////////////////////////

	////////////////////
	// VERSION NUMBER //
	////////////////////

	chrome.storage.local.get(['version', 'version_name'], function(items) {
		$('html').attr('data-efka-version', items.version);
		if ($('#containerRoot').length) $('body').append("<div id='version' data-version="+items.version+" style='font-weight:bold;color:#d5f406;position:absolute;top:5px;left:8px;opacity:0.3'>Essentials for KissAnime Version: <a style='font-weight:bold'  href='https://s3.amazonaws.com/essentialsforkissanime/Changelog.html' target='_blank'>"+items.version_name+"</a></div>")
		$('#version').hover(function() {$(this).animate({'opacity': '1'})}, function() {$(this).animate({'opacity': '0.3'})}); // I could change this to css
	});

	//////////////////
	// GET USERNAME //
	//////////////////

	var user = $('#aDropDown > span').text().match(/([A-z,0-9])\w+/g);
	if (user == null) user = "Not Logged In";
	user = user.toString();
	console.log('%cEssentials for KissAnime User: ' +user, 'color:blue');
	chrome.storage.local.set({user: user});

	/////////////////////////////////////////////
	// Cleans up the Cloudflare clearance page //
	/////////////////////////////////////////////

	if ($('.cf-browser-verification').length) {
		$('html').css({'color': 'white', "text-shadow": "1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,0px 1px 0 #000,1px 0px 0 #000,0px -1px 0 #000,-1px 0px 0 #000"});
		$('#imgLogo').attr('src', chrome.runtime.getURL('/images/cf_spin.gif'));
	}

	chrome.storage.sync.get(function(items) {
		console.log(items);
	});

	chrome.storage.local.get(function(items) {
		if (items.enableScrapeMode == false) {
			if (window.location.pathname == "/") {

			} else if (/^\/Anime\/([^\/$]*)$/.test(window.location.pathname)) {
				var AnimeTitle = $('.barContent > div > a.bigChar').text().trim().replace(' (Dub)', '').replace(' (Sub)', '');
				var pathName = window.location.pathname;
				var ImgURL = $('[src*="kissanime.ru/Uploads/Etc/"],[src*="kisscartoon.se/Uploads/Etc/"]').attr('src').replace(/(http|https):\/\/kiss(anime|cartoon).(ru|se)/g, '');
				//&emsp;
				$('body').prepend(`
					<div id="scrapeMenu" style="position: fixed;top: 10px;right: 10px;background: rgba(0,0,0,0.5);border: 1px solid grey;padding: 5px;">
						<div style="text-align: center;border-bottom:1px solid grey">Scrape Menu</div>
						<div><a href="javascript:void(0)" class="copyInfo" data-copy="formated" data-type="nya">Copy Info NYA</a></div>
						<div><a href="javascript:void(0)" class="copyInfo" data-copy="formated" data-type="airing">Copy Info Airing</a></div>
						<div><a href="javascript:void(0)" class="copyInfo" data-copy="formated" data-type="completed">Copy Info Completed</a></div>
						<div><a href="javascript:void(0)" class="copyInfo" data-copy="title">Copy Anime Title</a></div>
						<div><a href="javascript:void(0)" class="copyInfo" data-copy="desc">Copy Short Desc</a></div>
						<div><a href="javascript:void(0)" class="copyInfo" data-copy="pathname">Copy Pathname</a></div>
					</div>
				`);
				$('.copyInfo').click(function() {
					var a = $(this).attr('data-copy');
					switch(a) {
						case "formated":
							copyText(`\n\n\t\t\t\t<div>\n\t\t\t\t\t<img class="bullet">\n\t\t\t\t\t<a class="${$(this).attr('data-type')}" href="${pathName}" title="<img width='120' height='165' src='${ImgURL}' style='float: left; padding-right: 10px' /><div style='float: left; width: 300px'>\n\t\t\t\t\t\t<a class='bigChar' href='${pathName}'>${AnimeTitle}</a>\n\t\t\t\t\t<p></p>\n\t\t\t\t\t</div>">${AnimeTitle}</a>\n\t\t\t\t</div>`);
							break;
						case "title":
							copyText(AnimeTitle);
							break
						case "desc":
							var desc = $('#leftside > .bigBarContainer > .barContent > div:nth-child(2) > p:nth-last-of-type(2)').text();
							if (desc.length > 200) {
								var desc = $.trim(desc).substring(0, 200) + "...";
							}
							copyText(desc);
							break;
						case "pathname":
							copyText(pathName);
							break;
					}
				});
			} else if (/^\/Status\/([^\/$]*)$/.test(window.location.pathname)) {
				$('td').hover(function() {
					$('.tooltip a').click(function() {
						copyText($(this)[0].pathname);
						event.preventDefault();
					});
					$('.tooltip p').click(function() {
						copyText($(this).text().trim().replace(' (Dub)', '').replace(' (Sub)', ''));
						event.preventDefault();
					});
					$('.tooltip img').click(function() {
						copyText($(this).attr('src').split(/kiss(anime|cartoon).(ru|se)/)[1]);
						event.preventDefault();
					});
				});
			} else if ($("#centerDivVideo").length) {
				$('body').prepend(`
					<div style="position: fixed;top: 10px;right: 10px;background: rgba(0,0,0,0.5);border: 1px solid grey;padding: 5px;">
						<div style="text-align: center;border-bottom:1px solid grey">Scrape Menu</div>
						<div style="text-align:center">Current Time: <span id="currentTime"></span></div>
						<div><a href="javascript:void(0)" class="copyInfo" data-copy="currentTime" data-type="nya">Copy Current Time</a></div>
						<div><a href="javascript:void(0)" class="copyInfo" data-copy="duration" data-type="nya">Copy Durration Time</a></div>
					</div>
				`);
				$('#my_video_1_html5_api').on('timeupdate', function() {
					var time = parseInt( this.currentTime );
					if (this.lastTime !== time) {
						$('#currentTime').text(time);
					}
					this.time = time;
				});
				$('.copyInfo').click(function() {
					var a = $(this).attr('data-copy');
					switch(a) {
						case "currentTime":
							copyText( parseInt( $('#my_video_1_html5_api')[0].currentTime ) );
							break;
						case "duration":
							copyText( parseInt( $('#my_video_1_html5_api')[0].duration ) );
							break;
					}
				});
			}
		}

		if (items.enableHideUsername == true) {
			$('#aDropDown > span').text( $('#aDropDown > span').text().replace(/([A-z,0-9])\w+/g, 'undefined') );
			setTimeout(function() { $('#welcomemsg a').text('undefined'); }, 150);
		}

	});

});
