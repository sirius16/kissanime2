// STILL NEEDS BE LOOKED OVER //

////////////////////////////
// Remove Ads on Homepage //
////////////////////////////

chrome.storage.sync.get('enableHomepageAds', function(items) {
	if (items.enableHomepageAds === false) {
		$('head').append('<link href='+chrome.runtime.getURL('InjectedCSS/hideHomepageAds.css')+' rel="stylesheet" type="text/css">');
		$(document).ready(function() {
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
			$('#divAds, #divAds2, #adsIfrme1, .divCloseBut, .divCloseBut2').remove();
			$('div:contains("Remove ads")', '#rightside').remove();
			$('.rightBox iframe[src*="https://odddaily.com/ads.html"]').closest('.rightBox').remove();

			$('#leftside .clear, #leftside .clear2').remove();
		});
	}
});

$(document).ready(function() {

	/////////////////
	// Version Box //
	/////////////////

	$("#container").before('<div id="VersionBox"></div>');
	$("#VersionBox").load('https://s3.amazonaws.com/essentialsforkissanime/Version.html', function() {
		chrome.storage.local.get('version', function(items) {
			var version = items.version;
			var latestversion = $('#latest_version').attr('data-efka-latest-version');
			console.group('%cEssentials for KissAnime Version Check', 'color:red');
			console.log('%cInstalled Version: ' + version, 'color:skyblue');
			console.log('%cLatest Version: ' + latestversion, 'color:skyblue');
			console.log('%cUpdate Available: ' + ( versionCompare(latestversion, version) == 1 || versionCompare(latestversion, version) == -1 ), 'color:skyblue');
			console.groupEnd();
			if ( versionCompare(latestversion, version) == 1 ) {
				$('#Version_Outdated').show();
				$('#installed_version_outdated').text(version);
			} else if ( versionCompare(latestversion, version) == -1 ) {
			$('#Version_Newer').show();
				$('#installed_version_newer').text(version);
			}
			tooltip();
		});

	});

	//////////////
	// News Box //
	//////////////

	$("#container").before('<div id="NewsBox"></div>');
	$("#NewsBox").append('<div id="NewsBoxContent"></div>');
	$("#NewsBoxContent").load('https://s3.amazonaws.com/essentialsforkissanime/NewsBox.html', function() {
		$('.NewsBoxCloseButton').click(function() {
			$(this).parent().hide();
		});
		$(document).on('click', '#openExtPage', function() {
			chrome.runtime.sendMessage({'open': 'extPage'});
		});
	});

	/////////////////
	// Welcome Box //
	/////////////////

	chrome.storage.sync.get('enableWelcomeBox', function(items) {
		if (items.enableWelcomeBox == true) {
			$('#rightside').prepend(`
				<div id="WelcomeBox">
					<div id="WelcomeBoxTitle">Welcome!</div>
					<div id="WelcomeBoxContent">
						<div class="arrow-general"></div>
						<div id="WelcomeBoxText"></div>
						<br>
						<div id="ExternalContent"><div id="currentlyAiring"></div></div>
					</div>
				</div>
			`);

			// $.get('https://dl.dropboxusercontent.com/u/2545271/KissAnime/TestSeason.json', function(data) {
			//
			// 	for (key in data.current_season) {
			// 		$('#currentlyAiring').append(`<div class="ListContainer ${key}"><div id="day_of_week">『 ${key} 』</div></div>`);
			// 		data.current_season[key].forEach(function(current, index, array) {
			// 			$(`.${key}`).append(`
			// 				<div>
			// 					<img class="bullet">
			// 					<a class="${current.status}" href="${current.url}" title="<img width='120' height='165' src='${current.cover}' style='float: left; padding-right: 10px' /><div style='float: left; width: 300px'>
			// 						<a class='bigChar' href='${current.url}'>${current.title}</a>
			// 						<p>${current.desc}</p>
			// 					</div>">${current.title}</a>
			// 				</div>
			// 			`);
			// 		});
			// 		// "Bullet" image was saved and is loaded locally to reduce load time. //
			// 		var star = chrome.extension.getURL('images/star.png');
			// 		var bullet = chrome.extension.getURL('images/KissAnimeImageAssets/bullet.png');
			// 		$('.seasonList').attr('data-bulletsrc', bullet).attr('data-starsrc', star);
			// 		$('.bullet').attr("src", bullet);
			// 		$('.recommended').attr('src', star);
			// 	}
			//
			// }, 'json').fail(function(error) {
			// 	console.error(error);
			// });

			$('#ExternalContent').load('https://s3.amazonaws.com/essentialsforkissanime/WelcomeBox.html', function(response, status, xhr, request) {
				if ( status == "error" ) {
					$('#ExternalContent').prepend('<div id="LoadError" style="color:red;text-align:center;letter-spacing:0px;text-shadow:1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,0px 1px 0 #000,1px 0px 0 #000,0px -1px 0 #000,-1px 0px 0 #000"></div>');
					$('#LoadError').append('<div>Failed to load Currently Airing.</div>');
					$('#LoadError').append('<div>Error: '+xhr.status+' ('+xhr.statusText+')</div>');
					$('#LoadError').append('<div>Please refresh the page. If the content still doesn\'t load, try again in a few hours. If the content still doesn&#39;t load after a few hours, report the error above to the extension author.</div>');
					$('#LoadError').append('<br>');
					$('#ExternalContent').append('<div id="UsefulLinks"></div>');
				}

				////////////////////////////////////////////////////////////
				// Loads the Currently Airing List State (Visible/Hidden) //
				////////////////////////////////////////////////////////////

				chrome.storage.sync.get('airinglist_state', function(items) {
					if (items.airinglist_state == "visible") {
						$('#show_hide_seasons').text("(Hide Seasons List)");
						$('.seasonList').show();
					} else if (items.airinglist_state == "hidden") {
						$('#show_hide_seasons').text("(Show Seasons List)");
						$('.seasonList').hide();
					}
				});

				///////////////////////////////////////////////////////////////////////////////////
				// Toggles the Currently Airing List's visibility and saves it in chrome.storage //
				///////////////////////////////////////////////////////////////////////////////////

				$('#show_hide_seasons').click(function() {
					if ($('.seasonList').is(":hidden")) {
						$('#show_hide_seasons').text("(Hide Seasons List)");
						$('.seasonList').slideToggle(400);
						chrome.storage.sync.set({airinglist_state: 'visible'});
					} else if ($('.seasonList').is(":visible")) {
						$('.seasonList').slideToggle(400);
						setTimeout(function() {
							$('#show_hide_seasons').text("(Show Seasons List)");
						}, 400);
						chrome.storage.sync.set({airinglist_state: 'hidden'});
					}
				});

				////////////////////////////////////////////////////
				// Tooltip for Anime in the Currently Airing List //
				////////////////////////////////////////////////////

				$$(".ListContainer a[title]").tooltip({ offset: [5, 0], effect: 'slide', predelay: 300 }).dynamic({ bottom: { direction: 'down', bounce: true} });

				////////////////////////////////////////////////////////////////
				// Saves/Loads the state (Hidden/Visible) of the Welcome Box. //
				////////////////////////////////////////////////////////////////

				// Allows the user to condense the WelcomeBox //
				$('#WelcomeBoxTitle').css({"cursor": "pointer"});
				chrome.storage.sync.get('welcomebox_state', function(items) {
					if (items.welcomebox_state == "visible") {
						$('#WelcomeBoxContent').css("display", "block");
					} else if (items.welcomebox_state == "hidden") {
						$('#WelcomeBoxContent').css("display", "none");
					}
				});

				$('#WelcomeBoxTitle').click(function() {
					if ($(this).next().is(":hidden")) {
						$(this).next().slideToggle(400);
						chrome.storage.sync.set({welcomebox_state: 'visible'});
					} else if ($(this).is(":visible")) {
						$(this).next().slideToggle(400);
						chrome.storage.sync.set({welcomebox_state: 'hidden'});
					}
				});

				/////////////////////////////////////////
				// Used by me and a few of my friends. //
				/////////////////////////////////////////

				// Will probably Scrap //
				var star = chrome.extension.getURL('images/star.png');
				chrome.storage.local.get('user', function(items) {
					if (items.user == "pilar6195") {
						$('.p_favorite').attr("src", star);
						$('.p_unhide').css('display', 'block');
					} else if (items.user == "RedRein01") {
						$('.r_favorite').attr("src", star);
						$('.r_unhide').css('display', 'block');
					} else if (items.user == "Arkiniam") {
						$('.a_favorite').attr("src", star);
						$('.a_unhide').css('display', 'block');
					} else if (items.user == "Jousalk") {
						$('.j_favorite').attr("src", star);
						$('.j_unhide').css('display', 'block');
					}
				});

				//////////////
				// Tooltips //
				//////////////

				tooltip();

				// "Bullet" image was saved and is loaded locally to reduce load time. //
				var bullet = chrome.extension.getURL('images/KissAnimeImageAssets/bullet.png');
				$('.seasonList').attr('data-bulletsrc', bullet).attr('data-starsrc', star);
				$('.bullet').attr("src", bullet);
				$('.recommended').attr('src', star);

				//////////////////////////////////////////////////////////////
				// Adds the Last Modified to the bottom of the Seasons List //
				//////////////////////////////////////////////////////////////

				var lastModified = new Date(xhr.getResponseHeader('Last-Modified'));
				lastModified.setUTCHours(lastModified.getUTCHours() - parseInt($('#timezone').attr('data-offset')) );
				var monthLastModified = lastModified.getUTCMonth() + 1;
				var dateLastModified = lastModified.getUTCDate();
				var yearLastModified = lastModified.getUTCFullYear();
				var hourLastModified = lastModified.getUTCHours();
				var minutesLastModified = lastModified.getUTCMinutes();
				if (monthLastModified.toString().length == 1) monthLastModified = '0' + monthLastModified;
				if (dateLastModified.toString().length == 1) dateLastModified = '0' + dateLastModified;
				if (hourLastModified.toString().length == 1) hourLastModified = '0' + hourLastModified;
				if (hourLastModified == "00") hourLastModified = '12';
				if (minutesLastModified.toString().length == 1) minutesLastModified = '0' + minutesLastModified;
				var ampm;
				if (hourLastModified > 12) {
					hourLastModified = hourLastModified - 12;
					ampm = 'PM';
				} else {
					ampm = 'AM';
				}
				$('#lastupdated_date').text(monthLastModified+'/'+dateLastModified+'/'+yearLastModified);
				$('#lastupdated_time').text(hourLastModified+':'+minutesLastModified+ampm);

			});

		}

	});

	////////////////////////////////////////////////////////////////////////////////
	// Any element with the "notice" class will have a tooltip when hovered over. //
	////////////////////////////////////////////////////////////////////////////////

	function tooltip() {
		$$(".notice[title]").tooltip({ offset: [5, 0], effect: 'slide', predelay: 200, tipClass: 'notice-tooltip' }).dynamic({ bottom: { direction: 'down', bounce: true} });
	}

	////////////////
	// Pinned Box //
	////////////////

	chrome.storage.sync.get(['enablePinnedBox', 'enableAltPinnedBox'], function(items) {
		if (items.enablePinnedBox == true) {
			if (items.enableAltPinnedBox) {
				$('#leftside .bigBarContainer').before('<div id="PinnedBox" class="altPinnedBox"></div>');
				AltPinnedBox();
			} else {
				if ($('#WelcomeBox').length === 0) {
					$('#rightside').prepend('<div id="PinnedBox"></div>');
				} else {
					$('#WelcomeBox').after('<div id="PinnedBox"></div>');
				}
				PinnedBox();
			}
		}
	});

	function PinnedBox() {
		$('#PinnedBox').append('<div id="PinnedBoxTitle">Pinned</div>');
		$('#PinnedBoxTitle').append('<span id="editPinned">Edit</span>');
		$('#PinnedBox').append('<div id="PinnedBoxContent"></div>');
		$('#PinnedBoxContent').append('<div class="arrow-general"></div>');
		$('#PinnedBoxContent').append('<div id="PinnedList"></div>');

		var star = chrome.extension.getURL('images/star.png');
		var deleteimg = chrome.extension.getURL('images/delete.png');
		var editmode = false;

		chrome.storage.sync.get(["PinnedList", "PinnedListURLs"], function(items) {
			if (items.PinnedList == null || items.PinnedList.length == 0) {
				$('#PinnedList').html('You do not have any pinned Anime. To add Anime to this list, go to the Information page for any Anime you want and click on <span style="color:yellow;font-weight:bold">Pin to Homepage</span> or restore from a backed up file via the options page.');
			} else {
				var PinnedList = items.PinnedList;
				var PinnedListURLs = items.PinnedListURLs;
				var PinnedLength = PinnedList.length;
				for (var i = 0; i < PinnedLength; i++) {
					$('#PinnedList').append('<div><img class="mi" style="width: 12px" src="/Content/images/bullet.png"> <a href='+PinnedListURLs[i]+'>'+PinnedList[i]+'</a></div>');
				}
				asunabestgirl();
			}

			$('#editPinned').click(function() {
				if ($('#editPinned').attr('data-click-state') == 1) {
					$('#editPinned').attr('data-click-state', 0);
					$('.mi').attr('src', '../../Content/images/bullet.png');
					$('.mi').css('cursor','default');
					$('.mi').unbind();
					editmode = false;
					console.log('Edit Mode disabled');

				} else {
					$('#editPinned').attr('data-click-state', 1);
					editmode = true;
					console.log('Edit Mode enabled');
					$('.mi').attr('src', ''+deleteimg+'');
					$('.mi').css('cursor','pointer');
					$('.mi').click(function() {
						trash($(this).next().attr('href'));
						$(this).parent().remove();
					});

					/* $('#PinnedList').sortable({
						update: function() {
							var updatePinnedList = [];
							var updatePinnedURLs = [];
							var updatePinnedLW = [];
							var updatePinnedImg = [];
							$('.altPinnedItem').each(function() {
								updatePinnedList.push($(this).attr('data-title'));
								updatePinnedURLs.push($(this).attr('href'));
								updatePinnedLW.push(decodeURI($(this).attr('data-param')));
								updatePinnedImg.push($(this).find('.altPinnedImg').attr('src'));
							});
							chrome.storage.sync.set({
								PinnedList: updatePinnedList,
								PinnedListURLs: updatePinnedURLs,
								PinnedListLW: updatePinnedLW,
								PinnedListImg: updatePinnedImg
							});
						}
					}); */
					$('.altPinnedItem').click(function() { event.preventDefault() });

				}

			});

			$('html').mouseleave(function() {
				$('#editPinned').attr('data-click-state', 0);
				editMode = false;
				$('.mi').attr('src', '../../Content/images/bullet.png');
				$('.mi').css('cursor','default');
				$('.mi').unbind();
			});

		});

		function trash(yourWaifu) {
			chrome.storage.sync.get(['PinnedList','PinnedListURLs', 'PinnedListLW', 'PinnedListImg'], function(items) {
				var PinnedList = items.PinnedList;
				var PinnedListURLs = items.PinnedListURLs;
				var PinnedListLW = items.PinnedListLW;
				var PinnedListImg = items.PinnedListImg;
				var PinnedLength = PinnedList.length;
				var AnimePos = PinnedListURLs.indexOf(yourWaifu);
				PinnedList.splice(AnimePos, 1);
				PinnedListURLs.splice(AnimePos, 1);
				PinnedListLW.splice(AnimePos, 1);
				PinnedListImg.splice(AnimePos, 1);
				chrome.storage.sync.set({
					PinnedList: PinnedList,
					PinnedListURLs: PinnedListURLs,
					PinnedListLW: PinnedListLW,
					PinnedListImg: PinnedListImg
				});
				if (items.PinnedList.length == 0) {
					$('#PinnedList').html('You do not have any pinned Anime. To add Anime to this list, go to the Information page for any Anime you want and click on <span style="color:yellow;font-weight:bold">Pin to Homepage</span> or restore from a backed up file via the options page.');
				}
			});
		}

		// Tooltip for Pinned Anime / Latest Episode Number for Pinned Anime //

		function asunabestgirl() {
			$('#PinnedList a').each(function() {
				var $this = $(this);
				var href = $(this).attr('href');
				var title = $(this).text();
				$.ajax({
					url: href,
					type: 'GET',
					attempts: 0,
					maxAttempts: 5,
					success: function(data) {
						var img = $(data).find('#rightside .barContent img').first().attr('src');
						var desc = $(data).find('#leftside > .bigBarContainer > .barContent > div:nth-child(2) > p:nth-last-of-type(2)').text();

						// Shortens description down to 200 characters //
						if (desc.length > 200) {
							var desc = $.trim(desc).substring(0, 200) + "...";
						}

						var HTML = "<img width='120px' height='165px' src="+img+" style='float: left; padding-right: 10px' />"+
									"<div style='float: left; width: 300px'>"+
										"<a class='bigChar' href="+href+">"+title+"</a>"+
										"<p>"+desc+"</p>"+
									"</div>";

						$this.attr('title', HTML);

						var latestEpisodeURL = $(data).find('.listing > tbody > tr:nth-child(3) > td > a:contains("Episode")').attr('href');
						var latestEpisodeNumber = $(data).find('.listing > tbody > tr:nth-child(3) > td > a:contains("Episode")').text();
						var latestEpisodeNumber = latestEpisodeNumber.replace(/.*(?=Episode)/i, "");

						if (latestEpisodeURL != null) {
							$this.after(" <a href="+latestEpisodeURL+" class='PinnedLatestEpisode'>"+latestEpisodeNumber+"</a>");
						}

						// Used for Testing Purposes //

						/* console.log("%c-------------------------------------------------------------","color:blue");
						console.log("%cAnime Title: "+title, "color:blue");
						console.log("%cURL: "+href, "color:blue");
						console.log("%cLatest Episode URL: "+latestEpisodeURL, "color:blue");
						console.log("%cLatest Episode Number: "+latestEpisodeNumber, "color:blue");
						console.log("%cImage URL: "+img, "color:blue");
						console.log("%cDescription: "+desc, "color:blue"); */

						$$("#PinnedList a[title]").tooltip({ offset: [5, 0], effect: 'slide', predelay: 300 }).dynamic({ bottom: { direction: 'down', bounce: true} });
					},
					error: function() {
						console.log('%cEssentials for KissAnime: Could not retrive information for '+title, 'color:red')
					}
				});
			});
		}

		// onChanged //
		var onChangedTimeout;
		chrome.storage.onChanged.addListener(function(changes, namespace) {
			for (key in changes) {
				var changedKeys = changes[key];
				if (key == "PinnedList" && editmode == false) {
					clearTimeout(onChangedTimeout);
					var onChangedTimeout = setTimeout(function() {
						chrome.storage.sync.get(['PinnedList', 'PinnedListURLs'], function(items) {
							$('#PinnedList').empty();
							var PinnedList = items.PinnedList;
							var PinnedListURLs = items.PinnedListURLs;
							var PinnedLength = PinnedList.length;

							for (var i = 0; i < PinnedLength; i++) {
								$('#PinnedList').append('<div><img class="mi" style="width: 12px" src="../../Content/images/bullet.png"> <a href="'+PinnedListURLs[i]+'">'+PinnedList[i]+'</a></div>');
							}

							if (items.PinnedList.length == 0) {
								$('#PinnedList').html('You do not have any pinned Anime. To add Anime to this list, go to the Information page for any Anime you want and click on <span style="color:yellow;font-weight:bold">Pin to Homepage</span> or restore from a backed up file via the options page.');
							}

							asunabestgirl();

						});
					}, 3000);
				}
			}
		});
	}

	/*
		- I am really starting to get tired of this extension. may call it quits real soon...
		- This is somewhat of a mess. I'll clean it up later.
		- Update:
			- Well this will never get cleaned up. RIP in pieces.
	*/

	function AltPinnedBox() {
		/* == Creates the Alt Pinned Box -- */
		$('#PinnedBox').append(`
			<div id="PinnedBoxTitle">
				<span>Pinned</span>
				<span id="editPinned" style="display:none">Edit</span>
			</div>
			<div id="PinnedBoxContent">
				<div class="arrow-general"></div>
				<div id="loadingContainer" style="text-align:center">
					<div id="loading"></div>
					<div>Loading Pinned List. Please Wait...</div>
					<br>
				</div>
				<div id="PinnedList" class="altPinnedList"><table><tbody><tr></tr></tbody></table></div>
				<div id="emptyPinnedList">You do not have any pinned Anime. To add Anime to this list, go to the Information page for any Anime you want and click on <span style="color:yellow;font-weight:bold">Pin to Homepage</span> or restore from a backed up file via the options page.</div>
			</div>
		`);

		/* == Edit Mode Variable == */
		var editmode = false;
		$('#editPinned').data('edit-mode-enabled', false);

		chrome.storage.sync.get(["PinnedList", "PinnedListURLs", "PinnedListLW", "PinnedListImg"], function(items) {

			if (items.PinnedList === null || items.PinnedList.length === 0) { // If Pinned List is empty or doesn't exist
				$('#PinnedList, #loadingContainer').hide();
				$('#emptyPinnedList').show();
			} else { // We have something in our Pinned list \o/
				animeruinedmylife(items.PinnedList, items.PinnedListURLs, items.PinnedListLW, items.PinnedListImg, items.PinnedList.length);
			}

			/* == Edit Button JS == */
			$('#editPinned').click(function() {
				if ($('#editPinned').attr('data-editMode') == 1) {
					console.log('Edit Mode disabled');
					$('#editPinned').attr('data-editMode', 0);
					editmode = false;
					$('.altPinnedItem').unbind();
					if ($("#PinnedList tr").sortable("instance")) $("#PinnedList tr").sortable("destroy");
					$('.altPinnedRemove').slideUp(300);
				} else {
					console.log('Edit Mode enabled');
					$('#editPinned').attr('data-editMode', 1);
					editmode = true;
					$('.altPinnedRemove').slideDown(300);
					$('.altPinnedRemove').one('click', function() {
						event.preventDefault();
						trash($(this).parent().attr('href'));
						$(this).parent().parent().animate({width: 'toggle'}, 300, function() {
							$(this).parent().remove();
						});
					});
					$('#PinnedList tr').sortable({
						placeholder: "ui-state-highlight",
						revert: true,
						axis: 'x',
						update: function() {
							var updatePinnedList = [];
							var updatePinnedURLs = [];
							var updatePinnedLW = [];
							var updatePinnedImg = [];
							$('.altPinnedItem').each(function() {
								updatePinnedList.push(decodeURI($(this).attr('data-title')));
								updatePinnedURLs.push($(this).attr('href'));
								updatePinnedLW.push(decodeURI($(this).attr('data-param')));
								updatePinnedImg.push($(this).find('.altPinnedImg').attr('src'));
							});
							chrome.storage.sync.set({
								PinnedList: updatePinnedList,
								PinnedListURLs: updatePinnedURLs,
								PinnedListLW: updatePinnedLW,
								PinnedListImg: updatePinnedImg
							});
						}
					});
					$('.altPinnedItem').click(function() { event.preventDefault() });
				}

			});

			$('html').mouseleave(function() {
				$('#editPinned').attr('data-editMode', 0);
				editmode = false;
				if ($("#PinnedList tr").sortable("instance")) $("#PinnedList tr").sortable("destroy");
				$('.altPinnedItem').unbind();
				$('.altPinnedRemove').slideUp(300);
			});

			$("#PinnedList").mousewheel(function(event, delta) {
				this.scrollLeft -= (delta * 20);
				event.preventDefault();
			});

		});

		function trash(yourWaifu) {
			chrome.storage.sync.get(['PinnedList','PinnedListURLs', 'PinnedListLW', 'PinnedListImg'], function(items) {
				var PinnedList = items.PinnedList;
				var PinnedListURLs = items.PinnedListURLs;
				var PinnedListLW = items.PinnedListLW;
				var PinnedListImg = items.PinnedListImg;
				var PinnedLength = PinnedList.length;
				var AnimePos = PinnedListURLs.indexOf(yourWaifu);
				PinnedList.splice(AnimePos, 1);
				PinnedListURLs.splice(AnimePos, 1);
				PinnedListLW.splice(AnimePos, 1);
				PinnedListImg.splice(AnimePos, 1);
				chrome.storage.sync.set({
					PinnedList: PinnedList,
					PinnedListURLs: PinnedListURLs,
					PinnedListLW: PinnedListLW,
					PinnedListImg: PinnedListImg
				});
				if (items.PinnedList.length == 0) {
					$('#PinnedList').slideUp(400);
					$('#emptyPinnedList').slideDown(400);
				}
			});
		}

		function animeruinedmylife(a, b, c, d, e) {

			var i = 0; var titles = a; var urls = b; var lw = c; var img = d; var length = e;

			chrome.storage.sync.get(function(items) {

				// Start Date Check //
				var today = new Date();
				if (!items.PinnedListTimeUpdate) {
					var expires = new Date();
					expires.setDate(expires.getDate() + 14);
					expires = expires.toString();
					chrome.storage.sync.set({PinnedListTimeUpdate: expires});
				} else if (today >= new Date(items.PinnedListTimeUpdate)) {
					console.log('Refreshing Images');
					img = [];
					$.each(titles, function() {
						img.push('null');
					});
					var expires = new Date();
					expires.setDate(expires.getDate() + 14);
					expires = expires.toString();
					chrome.storage.sync.set({PinnedListTimeUpdate: expires});
				} else {
					console.log('No Refresh Needed');
				}
				// End Date Check //

				$('#loadingContainer').slideDown(200);
				$('#loading').progressbar({max: length, value: 0.001});

				jetFuelCantMeltDankAnimeMemes();

				function jetFuelCantMeltDankAnimeMemes() {


					// If the image url is already stored we don't need to retrieve it //
					if (img[i] !== 'null') {

						var title = titles[i]; // Shortens Title
						if (title.length > 34) var title = title.substring(0, 30) + '...'; // Shortens Title

						$('#PinnedList tr').append(`
							<td valign="top">
								<div style="position:relative">
									<a class="altPinnedItem" href=${urls[i]} data-title=${encodeURI(titles[i])} data-param=${encodeURI(lw[i])}>
										<img class="altPinnedRemove" src=${chrome.runtime.getURL('images/delete.png')}>
										<div class="overlay" data-overlayId=${i}></div>
										<img class="altPinnedImg" src=${img[i]}>
										<div>${title}</div>
									</a>
								</div>
							</td>
						`);

						if (lw[i] !== 'null') {
							var status;
							if (lw[i].indexOf('&time=') > -1) {
								status = 'Last';
							} else {
								status = 'Next';
							}
							$('#PinnedList td:last-child .altPinnedImg').after(`<div><span style='color:white'>${status}:</span> <a href=${lw[i].split('#')[0]} class='PinnedLW'>${lw[i].split('#')[1]}</a></div>`);

							//if (lw[i].indexOf('&time=') > -1) $('.overlay[data-overlayid='+i+']').append('<a style="font-size:20px;top:5px" class="glyphicon glyphicon-step-forward" href='+lw[i].split('#')[0]+' data-text="Continue Watching '+lw[i].split('#')[1]+'"></a>');
							//else $('.overlay[data-overlayid='+i+']').append('<a style="font-size:20px;top:5px" class="glyphicon glyphicon-step-forward" href='+lw[i].split('#')[0]+' data-text="Next Episode '+lw[i].split('#')[1]+'"></a>');

						}

						i++;
						$('#loading').progressbar("value", i);
						if (i < length) {
							jetFuelCantMeltDankAnimeMemes();
						} else {
								setTimeout(function() {
									$('#loadingContainer').slideUp(400, function() {
										$('#loading').progressbar('destroy');
									});
								}, 500);
								$('#PinnedList').slideDown(400);
								$('#editPinned').fadeIn(100);
								ihatemylife();
						}
						if (i == 6) {
							$('#PinnedList').slideDown(400);
						}

					// For image urls that are not stored in chrome.storage //
					} else {
						console.log('test');
						chrome.storage.sync.get('PinnedListImg', function(items) {
							$.ajax({
								url: urls[i],
								type: 'GET',
								timeout: 15000,
								success: function(data) {
									var imgURL = $(data).find('#rightside .barContent img:first-child').attr('src');
									console.log(imgURL);
									var title = titles[i]; // Shortens Title
									if (title.length > 34) var title = title.substring(0, 30) + '...'; // Shortens Title

									$('#PinnedList tr').append(`
										<td valign="top">
											<div style="position:relative">
												<a class="altPinnedItem" href=${urls[i]} data-title=${encodeURI(titles[i])}  data-param=${encodeURI(lw[i])}>
													<img class="altPinnedRemove" src=${chrome.runtime.getURL('images/delete.png')}>
													<div class="overlay" data-overlayId=${i}></div>
													<img class="altPinnedImg" src=${imgURL}>
													<span>${title}</span>
												</a>
											</div>
										</td>
									`);

									if (lw[i] != 'null') {
										var status;
										if (lw[i].indexOf('&time=') > -1) {
											status = 'Last';
										} else {
											status: 'Next';
										}
										$('#PinnedList td:last-child .altPinnedImg').after(`<div><span style='color:white'>${status}:</span> <a href=${lw[i].split('#')[0]} class='PinnedLW'>${lw[i].split('#')[1]}</a></div>`);
										//if (lw[i].indexOf('&time=') > -1) $('.overlay[data-overlayid='+i+']').append('<a style="font-size:20px;top:5px" class="glyphicon glyphicon-step-forward" href='+lw[i].split('#')[0]+' data-lw="Continue Watching '+lw[i].split('#')[1]+'"></a>');
										//else $('.overlay[data-overlayid='+i+']').append('<a style="font-size:20px;top:5px" class="glyphicon glyphicon-step-forward" href='+lw[i].split('#')[0]+' data-lw="Next Episode '+lw[i].split('#')[1]+'"></a>');

									}

									//// Saves the image url to chrome.storage for later use ////
									var updatePinnedImg = items.PinnedListImg;
									updatePinnedImg[i] = imgURL;
									chrome.storage.sync.set({PinnedListImg: updatePinnedImg});
									////////////////////////////////////////////////////////////

									i++;
									$('#loading').progressbar("value", i);
									if (i < length) {
										jetFuelCantMeltDankAnimeMemes();
									} else {
											setTimeout(function() {
												$('#loadingContainer').slideUp(400, function() {
													$('#loading').progressbar('destroy');
												});
											}, 500);
											$('#PinnedList').slideDown(400);
											$('#editPinned').fadeIn(100);
											ihatemylife();
									}
									if (i == 6) {
										$('#PinnedList').slideDown(400);
									}
								},
								error: function() {
									jetFuelCantMeltDankAnimeMemes();
								}
							});
						});

					}
				}

				function ihatemylife() {
					// This will get the Latest Episode Link
					$('#PinnedList .altPinnedItem').each(function() {
						$(this).find('.overlay').append('<div class="loading-pulse" style="position:absolute"></div>');
						var $this = $(this);
						setTimeout(function() {
							$.ajax({
								url: $this.attr('href'),
								type: 'GET',
								attempts: 0,
								maxAttempts: 5,
								success: function(data) {

									$this.find('.loading-pulse').remove();

									var summary = $(data).find('p span:contains("Summary:")').parent().next().text().replace(/"/g, '&quot;');

									if (summary.length > 400) {
										var summary = $.trim(summary).substring(0, 400) + "...";
									}

									var HTML = "<div style='float: left;'>"+
										"<h3 style='font-size:initial;margin:0'>Summary</h3>"+
										"<p>"+summary+"</p>"+
									"</div>";

									$this.find('.overlay').append('<a style="font-size:21px;top:5px" class="glyphicon glyphicon-info-sign pinnedInfo" title="'+HTML+'"></a>');

									$$(".pinnedInfo[title]").tooltip({ offset: [0, 0], effect: 'slide', predelay: 300 }).dynamic({ bottom: { direction: 'down', bounce: true} });

									var latestEpisodeURL = $(data).find('.listing > tbody > tr:nth-child(3) > td > a:contains("Episode")').attr('href');
									var latestEpisodeNumber = $(data).find('.listing > tbody > tr:nth-child(3) > td > a:contains("Episode")').text();
									latestEpisodeNumber = latestEpisodeNumber.replace(/.*(?=Episode)/i, "");

									if (latestEpisodeURL != null) $this.find('.altPinnedImg').after("<div><span style='color:white'>Latest:</span> <a href="+latestEpisodeURL+" class='PinnedLatestEpisode'>"+latestEpisodeNumber+"</a></div>");

									//if (latestEpisodeURL != null) $this.find('.overlay').append('<a style="font-size:20px;top:5px" class="glyphicon glyphicon-step-forward" href='+latestEpisodeURL+' data-lw="Latest Episode'+latestEpisodeNumber+'"></a>');

									/* Bookmark Manager */
									if ( Cookies.get('usernameK') != "" && Cookies.get('usernameK') != undefined ) { // If user is logged in
										var tempScript = $(data).find('script:contains("CheckBookmark")').text();
										var animeID = tempScript.match(/animeID=.*\d/)[0].replace('animeID=', '');
										$this.find('.overlay').append('<a style="font-size:21px;top:5px" class="manageBookmark glyphicon glyphicon-bookmark" data-animeID='+animeID+' data-bookmarkStatus="-1" data-text="Manage Bookmark"></a>');
									}

									/* Reddit Discussions */
									if (items.enableFindRedditDiscussions == true) {
										var AnimeTitle = $(data).find('.barContent > div > a.bigChar').text().replace(' (Sub)', '').replace(' (Dub)', '').trim();
										var OtherNamesArray = [];
										$(data).find('span:contains("Other name:")').parent().find('a').each(function() {
											OtherNamesArray.push($(this).text());
										});
										$this.find('.overlay').append('<div class="redditLinks"><a href="http://www.reddit.com/r/anime/search?q=subreddit%3Aanime+self%3Ayes+title%3A%22%5BSpoilers%5D%22+title%3A%22%5BDiscussion%5D%22+%28selftext%3AMyAnimelist+OR+selftext%3AMAL%29+%28title%3A%22'+AnimeTitle.replace('(TV)','')+'%22+OR+title%3A%22'+OtherNamesArray[0]+'%22+OR+title%3A%22'+OtherNamesArray.last()+'%22%29&restrict_sr=on&sort=new&t=all" target="_blank"><img src='+chrome.runtime.getURL('images/reddit-logo.png')+'></a></div>')
									}

								},
								error: function() {
									this.attempts++; if (this.attempts <= this.maxAttempts) $.ajax(this);
									else console.error('Alt Pinned List: Max ajax attempts reached!');
									$this.find('.loading-pulse').remove();
								}
							});
						}, 2000);

					});

					$(document).on('click', '.manageBookmark', function() {
						var _this = this;
						if (!_this.isLoading) {
							_this.isLoading = true;
							console.log('Clicked');
							var $this = $(this),
								animeID = $(this).attr('data-animeID');
							$this.attr('data-text', 'Loading...');
							switch( $this.attr('data-bookmarkStatus') ) {
								case "-1":
									$.ajax({
										url: window.location.origin + '/CheckBookmarkStatus',
										type: 'POST',
										data: 'animeID=' + animeID,
										attempts: 0,
										maxAttempts: 3,
										success: function(data) {
											if (data != '') { // I guess to make sure there is a response. Idk what KissAnime is thinking. Could've just sent a response with true | false instead of sending nothing. But whatever.
												var arry = data.split('|');
												if (arry[0] != 'null') {
													$this.attr({
														'data-bookmarkStatus': '1',
														'data-text': 'Remove from Bookmarks'
													}).addClass('glyphicon-remove-circle');
													;
												} else {
													$this.attr({
														'data-bookmarkStatus': '0',
														'data-text': 'Add to Bookmarks'
													}).addClass('glyphicon-ok-circle');
												}
												_this.isLoading = false;
											}
										},
										error: function() {
											this.attempts++;
											if (this.attempts <= this.maxAttempts) $.ajax(this);
											else {
												alert('Request timed out!');
												$this.attr('data-text', 'Manage Bookmark');
												_this.isLoading = false;
											}
										}
									});
									break;
								case "0":
									$.ajax({
										url: window.location.origin + '/Bookmark/' + animeID + '/add',
										type: 'POST',
										attempts: 0,
										maxAttempts: 3,
										success: function(data) {
											if (data != '') {
												$this.attr({
													'data-bookmarkStatus': '1',
													'data-text': 'Remove from Bookmarks'
												}).removeClass('glyphicon-ok-circle').addClass('glyphicon-remove-circle');
											} else {

											}
											_this.isLoading = false;
										},
										error: function() {
											this.attempts++;
											if (this.attempts <= this.maxAttempts) $.ajax(this);
											else {
												alert('Request timed out!');
												$this.attr('data-text', 'Add to Bookmarks');
												_this.isLoading = false;
											}
										}
									});
									break;
								case "1":
									$.ajax({
										url: window.location.origin + '/Bookmark/' + animeID + '/remove',
										type: 'POST',
										attempts: 0,
										maxAttempts: 3,
										success: function(data) {
											if (data != '') {
												$this.attr({
													'data-bookmarkStatus': '0',
													'data-text': 'Add to Bookmarks'
												}).removeClass('glyphicon-remove-circle').addClass('glyphicon-ok-circle');
											} else {

											}
											_this.isLoading = false;
										},
										error: function() {
											this.attempts++;
											if (this.attempts <= this.maxAttempts) $.ajax(this);
											else {
												alert('Request timed out!');
												$this.attr('data-text', 'Remove from Bookmarks');
												_this.isLoading = false;
											}
										}
									});
									break;
							}

						} else {
							console.log('Already in Progress');
						}

						event.preventDefault();
					});

				}

			});

		}

		// onChanged //
		var onChangedTimeout;
		chrome.storage.onChanged.addListener(function(changes, namespace) {
			for (key in changes) {
				var changedKeys = changes[key];
				if (key === "PinnedList" && editmode === false) {
					clearTimeout(onChangedTimeout);
					onChangedTimeout = setTimeout(function() {
						chrome.storage.sync.get(['PinnedList', 'PinnedListURLs', 'PinnedListLW', 'PinnedListImg'], function(items) {
							$('#PinnedList').slideUp(400, function() {
								$('#PinnedList tr').empty();
								if (items.PinnedList.length === 0) {
									$('#emptyPinnedList').slideDown(400);
								} else {
									$('#emptyPinnedList').slideUp(400);
									$('#editPinned').fadeOut(100)
									animeruinedmylife(items.PinnedList, items.PinnedListURLs, items.PinnedListLW, items.PinnedListImg, items.PinnedList.length);
								}
							});
						});
					}, 3000);
				}
			}
		});
	}

	////////////////////////////////////////////////////////////////////
	//Adds Options, Changelog, and Subbreddit link to homepage navbar //
	////////////////////////////////////////////////////////////////////

	$('#navsubbar > p').append('| <a id="options_link" href="javascript:void(0)">Essentials for KissAnime Options</a>');
	$('#options_link').click(function() {
		window.open(chrome.runtime.getURL("options.html"));
	});

	chrome.storage.sync.get(['recentlyupdated', 'firstinstall'], function(items) {
		if (items.recentlyupdated == true) {
			$('#optionslink').after(' | <a id="changeloglink" href="https://s3.amazonaws.com/essentialsforkissanime/Changelog.html" target="_blank">Essentials for KissAnime Changelog</a>');
			chrome.storage.sync.set({recentlyupdated:false});
		}
	});

	//////////////////////////////////////////
	// Add Last Watched Anime to the navbar //
	//////////////////////////////////////////

	chrome.storage.sync.get(['enableLastVideo', 'lastVideo'], function(items) {
		if ((items.enableLastVideo || items.enableLastVideo == undefined) && items.lastVideo) $('#navsubbar > p').append(' | <a href='+items.lastVideo[2]+'>Last Watched: '+items.lastVideo[0]+' '+items.lastVideo[1]+'</a>');
	});

	////////////////////////////
	// Fixes RightBox Spacing //
	////////////////////////////

	setTimeout(function() {
		$('#rightside .clear2').remove();
		$('.rightBox').after('<div class="clear2"></div>');
	}, 2000);

	//////////////////////////////////////////
	// Displays Username in the welcome box //
	//////////////////////////////////////////

	chrome.storage.local.get('user', function(items) {
		if (items.user === "Not Logged In") {
			$('#WelcomeBoxText').html('Welcome! You are not logged in.');
		} else if (items.user === 'pilar6195') {
			$('#WelcomeBoxText').html('<div id="welcomemsg"> Welcome, <a style="font-weight:bold;color:blue;" href="http://myanimelist.net/animelist/pilar6195" target="_blank">⎛⎝ pilar6195 ⎠⎞</a>.</div>');
		} else if (items.user === 'Jousalk') {
			$('#WelcomeBoxText').prepend('<div id="welcomemsg">Welcome, <a style="font-weight:bold;color:red;" href="http://myanimelist.net/animelist/jousalk" target="_blank">Jousalk</a>.</div>');
		} else if (items.user === 'RedRein01') {
			$('#WelcomeBoxText').prepend('<div id="welcomemsg">Welcome, <a style="font-weight:bold;color:red;" href="http://myanimelist.net/animelist/RedRein001" target="_blank">Senpai</a>.</div>');
		} else if (items.user === 'Arkiniam') {
			$('#WelcomeBoxText').prepend('<div id="welcomemsg">Welcome, <span style="font-weight:bold;color:red;" target="_blank">Angel</span>.</div>');
		} else if (items.user.length) {
			$('#WelcomeBoxText').prepend('<div id="welcomemsg">Welcome, <span style="font-weight:bold;color:lightblue;">'+items.user+'</span>.</div>');
		}
	});

	//////////////////////////////////////////////////////////
	//                      HOME PAGE                       //
	//////////////////////////////////////////////////////////

	///////////////////////////////////
	// Set Alternate Recent List Box //
	///////////////////////////////////

	chrome.storage.sync.get('enableAltRecentList', function(items) {
		if (items.enableAltRecentList == true) {
			/* == Clean Up == */
			$('#leftside > .bigBarContainer > .barContent').attr('id', 'recent-updates');
			$('#recently-nav').remove();
			$('#recent-updates').empty();
			$('#recent-updates').removeClass();
			$('#recent-updates').prev().attr('id', 'recent-updates-title');
			$('#recent-updates-title > div.clear').remove();
			/* == Create Stuff == */
			$('#recent-updates-title').append(`
				<div class="refresh-recents">
					<img style="height:20px" id="refresh-img" src='${chrome.extension.getURL('images/refresh-icon.png')}'>
				</div>
				<div id="status"></div>
			`);
			/* == Create More Stuff == */
			$('#recent-updates').append(`
				<div class='arrow-general'></div>
				<div class='loading-pulse recent-loading' style='margin: auto auto 10px auto;'></div>
				<div id="_listing"></div>
			`);
			/* == Misc Functions == */
			var recentUpdates = {
				statusTimeout: undefined,
				start: function() {
					$('#_listing').hide();
					this.statusText("Loading... Please Wait...");
					$('.refresh-recents').addClass('spin');
				},
				done: function(clear) {
					$('#_listing').slideDown(400);
					$('.recent-loading').slideUp(400);
					$('.refresh-recents').removeClass('spin');
					if (typeof clear !== 'undefined' && clear === true) this.statusText('');
					$$('.listing td[title]').tooltip({ offset: [10, 200], effect: 'slide', predelay: 300 }).dynamic({ bottom: { direction: 'down', bounce: true} });
				},
				refresh: function() {
					clearTimeout(this.statusTimeout);
					$('#_listing').slideUp(400);
					$('.recent-loading').slideDown(400);
					this.statusText('Refreshing...');
					$('.refresh-recents').addClass('spin');
				},
				statusText: function(s, c, t) {
					$('#status').css('color', 'inherit');
					$('#status').text(s);
					if (typeof c !== 'undefined')
						$('#status').css('color', c);
					if (typeof t !== 'undefined')
						this.statusTimeout = setTimeout(function(){ $('#status').text('') }, t);
				},
				history: {
					current: [],
					old: []
				},
				save: function() {
					recentUpdates.history.current = [];
					$('.listing td:first-child a').each(function() {
						recentUpdates.history.current.push( $(this).text().trim() );
					});
				},
				check: function() {
					recentUpdates.history.old = recentUpdates.history.current;
					recentUpdates.save();
					if ( recentUpdates.history.old.toString() == recentUpdates.history.current.toString() )
						this.statusText('No New Updates', null, 4000);
					else
						this.statusText('New Updates', null, 4000);
				},
				onlyCurrentAiring: function() {
					var currentlyairingArray = [];
					$('#currentlyAiring .ListContainer a').each(function() {
						currentlyairingArray.push( $(this).attr('href') );
					});
					$('.listing td:first-child > a').each(function() {
						var $this = $(this);
						var href = $(this).attr('href');
						if ($.inArray(href, currentlyairingArray) == -1)
							$this.parent().parent().remove();
					 })
					$('.listing tr').removeClass();
					currentlyairingArray = [];
					this.save();
				}
			}

			var counter = 0, timeout = 20;
			recentUpdates.start();
			$.ajax({
				url: '/AnimeList/LatestUpdate',
				attempts: 0,
				maxAttempts: 5,
				success: function(data) {

					try {
						$('#_listing').append( $(data).find('.listing') );
					} catch (err) {
						$('#_listing').append(`<div>${data}</div>`);
						recentUpdates.done();
						recentUpdates.statusText("Error", "orangered", 4000);
						return;
					}

					chrome.storage.sync.get('enableShowOnlyAiring', function(items) {
						if (items.enableShowOnlyAiring == true) {
							var waitforCAL = setInterval(function() {
								console.log('Checking...');
								if ($('#currentlyAiring').length != 0) {
									$.ajax({
										url: "/AnimeList/LatestUpdate?page=2",
										attempts: 0,
										maxAttempts: 5,
										success: function(dataPage2) {
											var tempHTML = $('<div>').html(dataPage2).find('tbody');
											tempHTML.children('.head, .head + tr').remove();
											$('.listing tbody').append( tempHTML.html() );
											recentUpdates.onlyCurrentAiring();
											recentUpdates.done(true);
										},
										error: function() {
											this.attempts++; if (this.attempts <= this.maxAttempts) $.ajax(this);
										}
									});
									clearInterval(waitforCAL);
									console.log('Currently Airing List Loaded.');
								}
								counter++; if (counter == timeout) {
									clearInterval(waitforCAL);
									console.log('Currently Airing List could not be Loaded.');
									recentUpdates.done();
									recentUpdates.statusText("Currently Airing List could not be Loaded.", "orangered", 4000);
									$('.refresh-recents').removeClass('spin');
								}
							}, 500);
						} else {
							recentUpdates.save();
							recentUpdates.done(true);
						}
					});

				},
				error: function() {
					this.attempts++; if (this.attempts <= this.maxAttempts) $.ajax(this);
				}
			});

			$('.refresh-recents').click(function() {
				recentUpdates.refresh();
				$.ajax({
					url: '/AnimeList/LatestUpdate',
					attempts: 0,
					maxAttempts: 5,
					success: function(data) {

						$('#_listing').empty();

						try {
							$('#_listing').append( $(data).find('.listing') );
						} catch (err) {
							$('#_listing').append(`<div>${data}</div>`);
							recentUpdates.done();
							recentUpdates.statusText("Error", "orangered", 4000);
							return;
						}

						$('#_listing').append( $(data).find('.listing') );
						chrome.storage.sync.get('enableShowOnlyAiring', function(items) {
							if (items.enableShowOnlyAiring == true) {
								$.ajax({
									url: "/AnimeList/LatestUpdate?page=2",
									success: function(dataPage2) {
										var tempHTML = $('<div>').html(dataPage2).find('tbody');
										tempHTML.children('.head, .head + tr').remove();
										$('.listing tbody').append( tempHTML.html() );
										recentUpdates.onlyCurrentAiring();
										recentUpdates.check();
										recentUpdates.done();
									}
								});
							} else {
								recentUpdates.check();
								recentUpdates.done();
							}
						});
						$('.tooltip').remove();
					},
					statusCode: {
						503: function() {
							recentUpdates.statusText("Error: 503 (The Service is Unavailable). Please refresh the page.", "orangered", 20000);
							$('.refresh-recents').removeClass('spin');
						},
						0: function() {
							recentUpdates.statusText("Error: 0 (Unknown Error). Please restart your browser and check your connection.", "orangered", 20000);
							$('.refresh-recents').removeClass('spin');
						}
					},
					error: function() {
						this.attempts++; if (this.attempts <= this.maxAttempts) $.ajax(this);
					}
				});
				event.stopPropagation();
			});
		} else {
			// $('#leftside .bigBarContainer .items img').height('171');
			// $('#leftside .bigBarContainer .scrollable').height('235');
		}
	});

	//////////////////////////////////////////////////
	// Removes Banner that appears on the home page //
	//////////////////////////////////////////////////

	chrome.storage.sync.get('enableBanner', function(items) {
		if (items.enableBanner == false) {
			$('.banner').remove();
		};
	});

	//////////////////////////////////////////////////////////////////////////////////
	// Creating tutorial for new user's to explain certain parts of the Welcome Box //
	//////////////////////////////////////////////////////////////////////////////////

	// chrome.storage.local.get('enableTestTutorial', function(items) {
	// 	if (items.enableTestTutorial == true) {
	// 		$('#WelcomeBox').before(`
	// 			<div id="tutorialWB">
	// 				<style>
	// 					#tutorialWB {
	// 						position: absolute;
	// 						margin-top: -17px;
	// 						transition: all 0.60s ease;
	// 					}
	// 					#tutorialWB a {
	// 						-webkit-user-select: none;
	// 					}
	// 					@media screen and (min-width: 1425px) {
	// 						#tutorialWB {
	// 							margin-left: 235px;
	// 						}
	// 						#tutorialWB:before {
	// 							right: 8px;
	// 							transform: rotate(135deg);
	// 						}
	// 					}
	// 					@media screen and (max-width: 1424px) {
	// 						#tutorialWB {
	// 							margin-left: -211px;
	// 						}
	// 						#tutorialWB:before {
	// 							left: 187px;
	// 							transform: rotate(-45deg);
	// 						}
	// 					}
	// 					#tutorialWB:before {
	// 						display: block;
	// 						width: 0;
	// 						height: 0;
	// 						border-bottom: 16px solid rgba(0,0,0,0.8);
	// 						border-left: 16px solid transparent;
	// 						top: 24px;
	// 						position: relative;
	// 						content: "";
	// 					}
	// 				</style>
	// 				<div style="text-align: center; width: 185px; border-radius: 5px; padding: 5px; background: rgba(0,0,0,0.8);">
	// 					<div id="tutorialWBText">Clicking on the Welcome Box Titlebar will condense the box. This is useful for those who don't want to disable it but don't want it visible all the time.</div>
	// 					<div><a href="javascript:void(0)" id="continueTutorialWB">(Continue)</a> <a href="javascript:void(0)" id="closeTutorialWB">(Close)</a></div>
	// 				</div>
	// 			</div>
	// 		`);
	//
	// 		var tutorial = [
	// 			{
	// 				element: '#WelcomeBoxText',
	// 				text: 'If logged into KissAnime, your username will appear here.'
	// 			},
	// 			{
	// 				element: '#show_hide_seasons',
	// 				text: 'Same way you are able to condense the Welcome Box, you are able to condense the Seasons List.'
	// 			},
	// 			{
	// 				element: '#seasonSelect',
	// 				text: 'Here you will be able to select and view the anime that aired in previous seasons.'
	// 			},
	// 			{
	// 				element: '#currentlyAiringTime',
	// 				text: 'The Currently Airing List is based on US Central Time. This clock is a reference for those who live in a different time zone.'
	// 			},
	// 			{
	// 				element: '#LastUpdatedContainer',
	// 				text: 'This is the last time this Currently Airing List was updated. Just like the clock before, this is also displayed in US Central Time.'
	// 			},
	// 			{
	// 				element: '#LinksContainer',
	// 				text: 'Here is a list of links I think you might find useful.'
	// 			}
	// 		];
	//
	// 		var count = 0;
	// 		$('#continueTutorialWB').click(function() {
	// 			var tutorialLength = tutorial.length;
	// 			if ( count < tutorialLength && $(tutorial[count].element).is(':visible') ) {
	//
	// 				var top = $(tutorial[count].element).position().top - $("#tutorialWB").position().top - 20;
	// 				$('#tutorialWB').css('margin-top', top);
	// 				$('#tutorialWBText').text(tutorial[count].text);
	//
	// 				$('html, body').animate({
	// 					scrollTop: $(tutorial[count].element).offset().top - 200
	// 				}, 600);
	//
	// 				count++;
	// 				if (count >= tutorialLength) $('#continueTutorialWB').hide();
	//
	// 			} else if ( tutorialLength > count && $(tutorial[count].element).is(':hidden') ) {
	//
	// 				$('#WelcomeBoxContent').slideDown(400)
	// 				chrome.storage.sync.set({welcomebox_state: 'visible'});
	//
	// 				$('#show_hide_seasons').text("(Hide Seasons List)");
	// 				$('.seasonList').slideDown(400);
	// 				chrome.storage.sync.set({airinglist_state: 'visible'});
	//
	// 				var top = $(tutorial[count].element).position().top - $("#tutorialWB").position().top - 20;
	// 				$('#tutorialWB').css('margin-top', top);
	// 				$('#tutorialWBText').text(tutorial[count].text);
	//
	// 				$('html, body').animate({
	// 					scrollTop: $(tutorial[count].element).offset().top - 200
	// 				}, 600);
	//
	// 				count++;
	// 				if (count >= tutorialLength) $('#continueTutorialWB').hide();
	//
	// 			}
	// 		});
	//
	// 		$('#closeTutorialWB').one('click', function() {
	// 			$('#tutorialWB').css('opacity', '0');
	// 			setTimeout(function() {
	// 				$('#tutorialWB').remove();
	// 			}, 600);
	// 		});
	// 	}
	// });

	// This will probably never be used unless something big happens //
	if ($('#containerRoot').length == 0 && $('.cf-browser-verification').length == 0) {
		$('body').append('<div id="efka_test"></div>');
		$("#efka_test").load('https://s3.amazonaws.com/essentialsforkissanime/efka.html');
	}
});
