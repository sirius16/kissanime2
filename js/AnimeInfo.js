// STILL NEEDS BE LOOKED OVER //

// Sets up toastr //
if (~location.origin.search("kissanime"))
toastr.options = {
	"closeButton": false,
	"debug": false,
	"newestOnTop": false,
	"progressBar": true,
	"positionClass": "toast-bottom-center",
	"preventDuplicates": true,
	"onclick": null,
	"showDuration": "fast",
	"hideDuration": "fast",
	"timeOut": "5000",
	"extendedTimeOut": "5000",
	"showEasing": "linear",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
}

// Foolproof way of making sure the user doesn't leave a forward slash at the end of the url for whatever reason. Not really. Just don't want to bother with finding a better solution.
if (window.location.pathname.slice(-1) === '/') window.location = window.location.href.slice(0, -1);
console.log("AnimeInfo.js")
if (/^\/(Anime|Cartoon)\/([^\/$]*)$/.test(window.location.pathname) || /^\/(Anime|Cartoon)\/([^\/$]*)\/$/.test(window.location.pathname)) {


	document.addEventListener('DOMContentLoaded', function() {

	
		var AnimeTitleRaw = $('.barContent > div > a.bigChar').text(); // Used for Pinned List related stuff
		var AnimeTitle = AnimeTitleRaw.replace(' (Sub)', '').replace(' (Dub)', '').trim();
		var OtherNamesArray = [];
		$('span:contains("Other name:")').parent().find('a').each(function() {
			OtherNamesArray.push($(this).text());
		});

		$('head').append('<link href='+chrome.runtime.getURL('InjectedCSS/AnimeInfo.css')+' rel="stylesheet" type="text/css">');
		$('span[id*="spanBookmark"]').parent().after(`<p>
			<span id="redditThreadContainer" class="KEPad" style="display:none"></span><br>
			<div id="malContainer">
				<span id="findinMALContainer" class="KEPad" style="display:none"></span>
			</div>
		</p>`);

		// Shows the MAL Search/Reddit Discussions Containers if the option is enabled //
		chrome.storage.sync.get(['enableFindinMAL', 'enableFindRedditDiscussions'], function(items) {
			if (items.enableFindinMAL == true) {
				$('#findinMALContainer').css('display', 'inline-block');
			}
			if (items.enableFindRedditDiscussions == true) {
				$('#redditThreadContainer').css('display', 'inline-block');
				redditDiscussionLinks();
			}
		});

		/////////////////////////////////////////////////
		//           Start MyAnimeList Stuff           //
		/////////////////////////////////////////////////
		// Lord have mercy on anyone who tries to make //
		//     sense of anything in this section.      //
		/////////////////////////////////////////////////

		var AnimeData;
		chrome.storage.local.get('enableMALAPI', function(items) {
			if (items.enableMALAPI == true) {
				$('#malContainer').hide();
				OtherNamesArray.unshift(AnimeTitle); var AnimeTitles = OtherNamesArray;
				chrome.runtime.sendMessage({MAL: [1, AnimeTitles, window.location.pathname]}, function(response) {
					console.log(response.MAL);
					if (response.MAL[0]) {
						$('#malContainer').show();
						$('html').attr({'data-MALID': response.MAL[0], 'data-malScore': response.MAL[3]});
						if (response.MAL[1] == true) {
							$('html').attr('data-ExistInUserMAL', true);
							AnimeData = $.parseXML(response.MAL[2]);
						} else {
							$('html').attr('data-ExistInUserMAL', false);
							AnimeData = response.MAL[2];
						}
						malApi();
					} else {
						$('#malContainer').show();
						malSearch();
					}
				});
			} else {
				malSearch();
			}
		});

		function malApi() {
			if ($('html').attr('data-MALID')) {
				$('#findinMALContainer').append('<img id="MALImage" class="KEImg" src='+chrome.runtime.getURL('images/mal-icon.png')+'>');
				$('#findinMALContainer').append('<a href="http://myanimelist.net/anime/'+$('html').attr('data-MALID')+'/" target="_blank">MAL Link</a>');
				$('#malContainer').prepend(`
					<span id="addRemoveMALContainer" class="KEPad">
						<img id="addRemoveMALImg" class="KEImg" src="/Content/images/plus.png">
						<a id="addRemoveMAL" href="javascript:void(0)"></a>
					</span>
					<span id="statusMALContainer" class="KEPad KEHide">
						<span>Your Status: </span>
						<select id="statusDropdown" class="KEDropdown">
							<option value="1">Watching</option>
							<option value="2">Completed</option>
							<option value="3">On Hold</option>
							<option value="4">Dropped</option>
							<option value="6" selected>Plan To Watch</option>
						</select>
					</span>
					<span id="scoreMALContainer" class="KEPad KEHide">
						<span>Your Score: </span>
						<select id="scoreDropdown" class="KEDropdown">
							<option value="0" selected>-</option>
							<option value="10">10</option>
							<option value="9">9</option>
							<option value="8">8</option>
							<option value="7">7</option>
							<option value="6">6</option>
							<option value="5">5</option>
							<option value="4">4</option>
							<option value="3">3</option>
							<option value="2">2</option>
							<option value="1">1</option>
						</select>
					</span>
					<span id="episodeMALContainer" class="KEPad KEHide">
						<span>Eps Seen:</span>
						<input type="number" id="episodesUserCurrentText" class="KETextInput" style="border: 1px solid grey;" value="0" min="0">
						<span>/</span>
						<input type="text" id="episodesTotalText" class="KETextInput" disabled>
					</span>

					<span id="userDate" class="KEPad KEHide">
						<span>Started:</span>
						<select id="startMonth" class="KEDropdown monthSelection">
							<option value="00" selected>- Month -</option>
							<option value="01">January</option>
							<option value="02">Febuary</option>
							<option value="03">March</option>
							<option value="04">April</option>
							<option value="05">May</option>
							<option value="06">June</option>
							<option value="07">July</option>
							<option value="08">August</option>
							<option value="09">September</option>
							<option value="10">October</option>
							<option value="11">November</option>
							<option value="12">December</option>
						</select>
						&nbsp;
						<select id="startDay" class="KEDropdown dateSelection">
							<option value="00" selected>- Day -</option>
						</select>
						&nbsp;
						<select id="startYear" class="KEDropdown yearSelection">
							<option value="0000" selected>- Year -</option>
						</select>
						&nbsp;
						<span>Finished:</span>
						<select id="endMonth" class="KEDropdown monthSelection">
							<option value="00" selected>- Month -</option>
							<option value="01">January</option>
							<option value="02">Febuary</option>
							<option value="03">March</option>
							<option value="04">April</option>
							<option value="05">May</option>
							<option value="06">June</option>
							<option value="07">July</option>
							<option value="08">August</option>
							<option value="09">September</option>
							<option value="10">October</option>
							<option value="11">November</option>
							<option value="12">December</option>
						</select>
						&nbsp;
						<select id="endDay" class="KEDropdown dateSelection">
							<option value="00" selected>- Day -</option>
						</select>
						&nbsp;
						<select id="endYear" class="KEDropdown yearSelection">
							<option value="0000" selected>- Year -</option>
						</select>
						&nbsp;
						<button type="button" id="saveDates" class="KEDropdown">Update Dates</button>
					</span>

					<span id="totalScoreMALContainer" class="KEPad">
						<span class="info">MAL Score: </span>
						<span id="malScore">N/A</span>
					</span>

				`);

				if ($('html').attr('data-malScore').length) $('#malScore').text($('html').attr('data-malScore')); // Sets MAL Score
				if ($('html').attr('data-ExistInUserMAL') == 'true') {
					$('#addRemoveMAL').text('Remove From MAL'); // Changes the Text
					$('#addRemoveMALImg').attr('src', '/Content/images/minus.png'); // Changes the Img
					$('#statusDropdown').val($(AnimeData).find('my_status').text()); // Adds the value for the Current Status
					$('#scoreDropdown').val($(AnimeData).find('my_score').text()); // Adds the value for the Current Score
					$('#episodesUserCurrentText').val($(AnimeData).find('my_watched_episodes').text()); // Adds the value for the Current Episode
					if ($(AnimeData).find('series_episodes').text() != 0) $('#episodesUserCurrentText').attr('max', $(AnimeData).find('series_episodes').text()); // Sets the max input value if the total episodes does not equal 0
					$('#episodesTotalText').val($(AnimeData).find('series_episodes').text()); // Adds the value for the Total Episodes

					for (var i = 1; i <= 31; i++) {
						var day = i; if (day.toString().length == 1) day = '0' + day;
						$('#startDay').append('<option value='+day+'>'+i+'</option>');
						$('#endDay').append('<option value='+day+'>'+i+'</option>');
					}
					for (var i = new Date().getFullYear(); i >= 1980; i--) {
						$('#startYear').append('<option value='+i+'>'+i+'</option>');
						$('#endYear').append('<option value='+i+'>'+i+'</option>');
					}
					var startDate = $(AnimeData).find('my_start_date').text().split('-');
					$('#startMonth').val(startDate[1]);
					$('#startDay').val(startDate[2]);
					$('#startYear').val(startDate[0]);
					var endDate = $(AnimeData).find('my_finish_date').text().split('-');
					$('#endMonth').val(endDate[1]);
					$('#endDay').val(endDate[2]);
					$('#endYear').val(endDate[0]);

					$('#statusMALContainer, #scoreMALContainer, #episodeMALContainer, #userDate').removeClass('KEHide'); // Shows every container
				} else {
					$('#addRemoveMAL').text('Add To MAL');
					$('#addRemoveMALImg').attr('src', '/Content/images/plus.png');
					$('#episodesUserCurrentText').attr('max', AnimeData);
					$('#episodesTotalText').val(AnimeData);
					//$('#statusMALContainer').hide();
				}
				// Add/Remove Link //
				$('#addRemoveMAL').click(function() {
					if ($('html').attr('data-ExistInUserMAL') == 'true') {
						createDialog('Are you sure you wish to remove <span style="color:yellow">'+AnimeTitle+'</span> from your MyAnimeList?', 'Confirmation', 'Yes', 'No', function() {
							chrome.runtime.sendMessage({MAL: [3, $('html').attr('data-MALID')]}, function(response) {
								console.log('Remove Status:', response.malStatusRemove);
								if (response.malStatusRemove[0] == "200") {
									$('html').attr('data-ExistInUserMAL', false); // Sets ExistInUserMAL to false
									$('#addRemoveMAL').text('Add To MAL'); // Changes the Text
									$('#addRemoveMALImg').attr('src', '/Content/images/plus.png'); // Changes the Img
									$('#statusDropdown').val('6'); $('#scoreDropdown').val('0'); $('#episodesUserCurrentText').val('0'); // Sets the Values to Default
									$('.dateSelection, .monthSelection').val('00'); $('.yearSelection').val('0000'); // Sets the Date Values to Default

									$('#statusMALContainer, #scoreMALContainer, #episodeMALContainer, #userDate').addClass('KEHide'); // Hides every container

									toastr['success']('Anime successfully removed from MyAnimeList!');
								} else if (response.malStatusRemove[0] == "400") {
									toastr['error']('An error has occured!');
								}
							});
						});
					} else {
						chrome.runtime.sendMessage({MAL: [2, $('html').attr('data-MALID')]}, function(response) {
							console.log('Add Status', response.malStatusAdd);
							if (response.malStatusAdd[0] == "Success") {
								$('html').attr('data-ExistInUserMAL', true);
								$('#addRemoveMAL').text('Remove From MAL');
								$('#addRemoveMALImg').attr('src', '/Content/images/minus.png');

								for (var i = 1; i <= 31; i++) {
									var day = i; if (day.toString().length == 1) day = '0' + day;
									$('#startDay').append('<option value='+day+'>'+i+'</option>');
									$('#endDay').append('<option value='+day+'>'+i+'</option>');
								}
								for (var i = new Date().getFullYear(); i >= 1980; i--) {
									$('#startYear').append('<option value='+i+'>'+i+'</option>');
									$('#endYear').append('<option value='+i+'>'+i+'</option>');
								}

								$('#statusMALContainer, #scoreMALContainer, #episodeMALContainer, #userDate').removeClass('KEHide');
								toastr['success']('Anime successfully added to MyAnimeList!');
							} else if (response.malStatusAdd[0] == "Error") {
								toastr['error']('An error has occured!');
							}
						});
					}
				});
				// User's MAL Status Dropdown //
				$('#statusDropdown').on('change', function() {
					var value = $(this).val();
					chrome.runtime.sendMessage({MAL: [5, $('html').attr('data-MALID'), value]}, function(response) {
						console.log('Update Status:', response.malUpdateStatus);
						if (response.malUpdateStatus[0] == "Success") {
							toastr['success']('Status successfully updated!');
						} else if (response.malUpdateStatus[0] == "Error") {
							toastr['error']('An error has occured!');
						}
					});
				});
				// User's MAL Score Dropdown //
				$('#scoreDropdown').on('change', function() {
					var value = $(this).val();
					chrome.runtime.sendMessage({MAL: [6, $('html').attr('data-MALID'), value]}, function(response) {
						console.log('Score Status:', response.malUpdateScore);
						if (response.malUpdateScore[0] == "Success") {
							toastr['success']('Score successfully updated!');
						} else if (response.malUpdateScore[0] == "Error") {
							toastr['error']('An error has occured!');
						}
					});
				});
				// User's MAL Episodes Input //
				var currentEpiValue;
				$('#episodesUserCurrentText').on('focus', function() {
					currentEpiValue = $(this).val();
					$(this).animate({'width': '40px'});
				});
				$('#episodesUserCurrentText').on('blur', function() {
					var value = $(this).val();
					$(this).animate({'width': '25px'});
					if (currentEpiValue != value) {
						chrome.runtime.sendMessage({MAL: [4, $('html').attr('data-MALID'), value]}, function(response) {
							console.log('Episode Status:', response.malUpdateEpisode);
							if (response.malUpdateEpisode[0] == "Success") {
								toastr['success']('Episode successfully updated!');
							} else if (response.malUpdateEpisode[0] == "Error") {
								toastr['error']('An error has occured!');
							}
						});
					}
				});

				$('#saveDates').click(function() {
					var startDate = $('#startMonth').val() + $('#startDay').val() + $('#startYear').val();
					var endDate = $('#endMonth').val() + $('#endDay').val() + $('#endYear').val();
					$('html').css('cursor', 'progress');
					chrome.runtime.sendMessage({'MAL': [7 ,$('html').attr('data-MALID'), [startDate, endDate]]}, function(response) {
						if (response.malUpdateDates[0] == "Success") {
							toastr['success']('Dates successfully updated!');
							$('html').css('cursor', 'default');
						} else if (response.malUpdateDates[0] == "Error") {
							toastr['error']('An error has occured!');
							$('html').css('cursor', 'default');
						}
					});
				});
				console.log(AnimeData);
			} else {
				$('#findinMALContainer').append('<img id="MALImage" class="KEImg" src='+chrome.runtime.getURL('images/mal-icon.png')+'>');
				$('#findinMALContainer').append('<a href="http://myanimelist.net/anime.php?q='+AnimeTitle+'" target="_blank">Find in MAL</a>');
			}
		}

		function malSearch() {
			$('#findinMALContainer').append('<img id="MALImage" class="KEImg" src='+chrome.runtime.getURL('images/mal-icon.png')+'>');
			$('#findinMALContainer').append('<a href="http://myanimelist.net/anime.php?q='+AnimeTitle+'" target="_blank">Find in MAL</a>');
		}

		///////////////////////////////////////////////
		//           End MyAnimeList Stuff           //
		///////////////////////////////////////////////

		///////////////////////////////////
		// Search for Reddit Discussions //
		///////////////////////////////////
		var reddit_logo = chrome.extension.getURL('images/reddit-icon.png');
		$('#redditThreadContainer').append('<img id="RedditImage" class="KEImg" src="'+reddit_logo+'">');
		$('#redditThreadContainer').append('<a id="RedditLink" href="http://www.reddit.com/r/anime/search?q=subreddit%3Aanime+self%3Ayes+title%3A%22%5BSpoilers%5D%22+title%3A%22%5BDiscussion%5D%22+%28selftext%3AMyAnimelist+OR+selftext%3AMAL%29+%28title%3A%22'+AnimeTitle.replace('(TV)','')+'%22+OR+title%3A%22'+OtherNamesArray[0]+'%22+OR+title%3A%22'+OtherNamesArray.last()+'%22%29&restrict_sr=on&sort=new&t=all" target="_blank">Reddit Discussions</a>');

		function redditDiscussionLinks() {
			$('.listing td:first-child').each(function() {
				var a = $(this).find('a');
				var episode = $(a).text().split("Episode").pop();
				episode = parseInt(episode);
				if (episode >= 0) {
					var urlvalue1 = AnimeTitle.replace('(TV)', '') + " - Episode " + episode;
					var urlvalue2 = OtherNamesArray[0] + " - Episode " + episode;
					var urlvalue3 = OtherNamesArray.last() + " - Episode " + episode;
					//var search = 'https://reddit.com/r/anime/search?q=' + 'subreddit:anime self:yes (selftext:MyAnimelist OR selftext:MAL) (title:"[Spoilers] '+urlvalue1+' [Discussion]" OR title:"[Spoilers] '+urlvalue2+' [Discussion]" OR title:"[Spoilers] '+urlvalue3+' [Discussion]")';
					//$(a).after(' - <a href='+encodeURI(search)+' target="_blank">Reddit Discussion</a>');
					$(a).after(' - <a href="https://www.reddit.com/r/anime/search?q=subreddit%3Aanime+self%3Ayes+%28selftext%3AMyAnimelist+OR+selftext%3AMAL%29+%28title%3A%22%5BSpoilers%5D+'+urlvalue1+'+%5BDiscussion%5D%22+OR+title%3A%22%5BSpoilers%5D+'+urlvalue2+'+%5BDiscussion%5D%22+OR+title%3A%22%5BSpoilers%5D+'+urlvalue3+'+%5BDiscussion%5D%22%29&sort=new&t=all" target="_blank">Reddit Discussion</a>');
				}
			});
		}

		/////////////////////////
		// Pinned List Manager //
		/////////////////////////
		$('#redditThreadContainer').after('<span id="PinnedManager"></span>');
		$('#PinnedManager').append('<img id="PMimg" class="KEImg" src="/Content/images/plus.png">');
		$('#PinnedManager').append('<a id="PinnedManagerText">Pin to Homepage</a>');
		$('#PinnedManagerText').css("cursor","pointer");
		var url = '//' + window.location.host + window.location.pathname;
		//var imgURL = $('body').find('img[src*="//kissanime.to/Uploads/Etc/"]').attr('src').replace(/(http|https):\/\/kissanime.to/g, '');
		var imgURL = $('#rightside .barContent img').first().attr('src');

		chrome.storage.sync.get('PinnedListURLs', function(items) {
			if (items.PinnedListURLs != null && items.PinnedListURLs.contains(window.location.pathname)) {
				$('#PinnedManagerText').text('Unpin from Homepage');
				$('#PMimg').attr('src', '/Content/images/minus.png');
			}
		});

		$('#PinnedManagerText').click(function() {
			chrome.storage.sync.get(['PinnedList', 'PinnedListURLs', 'PinnedListLW', 'PinnedListImg'], function(items) {

				if (items.PinnedList == null) { // If Pinned List doesn't exist. i.e New User

					var PinnedList = [ AnimeTitleRaw ];
					var PinnedListURLs = [ window.location.pathname ];
					var PinnedListLW = [ 'null' ];
					var PinnedListImg = [ imgURL ];
					$('#PinnedManagerText').text('Unpin from Homepage');
					$('#PMimg').attr('src', '/Content/images/minus.png');
					chrome.storage.sync.set({
						PinnedList: PinnedList,
						PinnedListURLs: PinnedListURLs,
						PinnedListLW: PinnedListLW,
						PinnedListImg: PinnedListImg
					});

				} else if ( items.PinnedListURLs.contains( window.location.pathname ) ) { // If Anime exist in Pinned List

					var PinnedList = items.PinnedList;
					var PinnedListURLs = items.PinnedListURLs;
					var PinnedListLW = items.PinnedListLW;
					var PinnedListImg = items.PinnedListImg;
					var AnimePos = items.PinnedListURLs.indexOf( window.location.pathname );
					PinnedList.splice( AnimePos, 1 );
					PinnedListURLs.splice( AnimePos, 1 );
					PinnedListLW.splice( AnimePos, 1 );
					PinnedListImg.splice( AnimePos, 1 );
					$('#PMimg').attr('src', '/Content/images/plus.png');
					$('#PinnedManagerText').text('Pin to Homepage');
					chrome.storage.sync.set({
						PinnedList: PinnedList,
						PinnedListURLs: PinnedListURLs,
						PinnedListLW: PinnedListLW,
						PinnedListImg: PinnedListImg
					});

				} else { // If Anime doesn't exist in Pinned List

					if ( items.PinnedList.length <= 70 ) {

						var PinnedList = items.PinnedList;
						var PinnedListURLs = items.PinnedListURLs;
						var PinnedListLW = items.PinnedListLW;
						var PinnedListImg = items.PinnedListImg;
						PinnedList.push( AnimeTitleRaw );
						PinnedListURLs.push( window.location.pathname );
						PinnedListLW.push( 'null' );
						PinnedListImg.push( imgURL );
						$('#PinnedManagerText').text('Unpin from Homepage');
						$('#PMimg').attr('src', '/Content/images/minus.png');
						chrome.storage.sync.set({
							PinnedList: PinnedList,
							PinnedListURLs: PinnedListURLs,
							PinnedListLW: PinnedListLW,
							PinnedListImg: PinnedListImg
						});

					} else {

						toastr['error']('Max Pinned List Items Reached! 70/70', '', {positionClass: "toast-top-center"});

					}
				}

			});
		});

		////////////////////////////////
		// Hides the comments warning //
		////////////////////////////////

		$('.episodeList div:last-child > div[style="color: #d5f406"]').hide();


		if (window.location.pathname == "/Anime/Sword-Art-Online") { // Sword Art Online

		} else if (window.location.pathname == "/Anime/Gakkou-Gurashi") { // Gakkougurashi

			console.log('rapgod');
			Mousetrap.bind('r a p g o d', function() { doEGVideo('its7cRd5PKs') });

		} else if (window.location.pathname == "/Anime/Kantai-Collection-KanColle") { // Kantai Collection

			console.log('kongou');
			console.log('panpakapan');
			Mousetrap.bind('k o n g o u', function() { doEGVideo('YnheOlgK5uo') });
			Mousetrap.bind('p a n p a k a p a n', function() { doEGVideo('3SB-xSbzyMQ') });

		} else if (window.location.pathname == "/Anime/Non-Non-Biyori") { // Non Non Biyori

			console.log('nyanpasu');
			Mousetrap.bind('n y a n p a s u', function() {
				doEGVideo('mNWJ7CNK8TI');
				$('.nyanpasu').remove();
				$('body').append('<img class="nyanpasu" style="height:200px;position:fixed;bottom:0;-webkit-transform:scaleX(-1)" src="http://i.imgur.com/mbkQxw6.png">');
				$('body').append('<img class="nyanpasu" style="height:200px;position:fixed;bottom:0;right:0" src="http://i.imgur.com/mbkQxw6.png">');
			});

		} else if (window.location.pathname == "/Anime/Strike-Witches") { // Strike Witches

			console.log('sometal');
			Mousetrap.bind('s o m e t a l', function() {
				doEGVideo('BgVbe5omsM4');
			});

		} else if (window.location.pathname == "/Anime/Yellow-Mosaic") { // Kiniro Mosaic

			console.log('ayayaya');
			Mousetrap.bind('a y a y a y a', function() { doEGVideo('rGy6FuGdeYk') });

		}

		function doEGVideo(url) {
			$('#egVideo').remove();
			$('body').append(`
				<div id="egVideo" style="position:absolute;top:80px;left:0;right:0;margin:0 auto;width:560px;text-align:center">
					<div id="close-video" style="cursor:pointer;position:absolute;left:4px;font-size:20px;font-weight:bold;">&#10005;</div>
					<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${url}?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>
				<div>
			`);
			$('#close-video').one('click', function() {
				$(this).parent().remove();
			});
		}

		// Download All //

		// Thanks to https://www.reddit.com/user/Nadermane for helping with this feature //
		chrome.storage.sync.get('enableDownloadAllLinks', function(items) {
			if (~location.origin.search("kissanime"))
				$.get('/Scripts/common.js', () => {
					console.log('%c[Download All] Loaded /Scripts/common.js', 'color:skyblue;');
					$.get('/Scripts/jquery.allofthelights-min.js?v=4', () => {
						console.log('%c[Download All] Loaded /Scripts/jquery.allofthelights-min.js', 'color:skyblue;');
						$.get('/Scripts/aes.js', () => {
							console.log('%c[Download All] Loaded /Scripts/aes.js', 'color:skyblue;');
							$.get('/Scripts/oran.min.js?v=3.19', () => {
								console.log('%c[Download All] Loaded /Scripts/oran.min.js', 'color:skyblue;');
								$.get('/Scripts/file3.js', () => {
									console.log('%c[Download ( All] Loaded /Scripts/file3.js', 'color:skyblue;');
									console.log('%c[Download All] All required scripts loaded!', 'color:skyblue;');
									// key.words = [
										// 1612810605,
										// -1015117318,
										// -304772104,
										// 600685473,
										// -879577236,
										// -1632917189,
										// -1671278281,
										// -793335108
									// ];
								});
							});
						});
					});
				});
				else if (~location.origin.search("kimcartoon"))
$kissenc.setSecretKey(localStorage.secretkey);					// (chainScripts = scripts => {
							// if (scripts.length)
								// $.getScript(scripts[0], () => !console.log('%c[Download All] Loaded %s', 'color:skyblue;',scripts.shift()) && chainScripts(scripts))
// else
						// })([
							// "https://kimcartoon.me/Scripts/aes.js",
							// "https://kimcartoon.me/Scripts/common.js?v=1",
							// "https://kimcartoon.me/Scripts/sha256.min.js",
							// "https://kimcartoon.me/Scripts/jquery.allofthelights-min.js?v=4",
							// "https://kimcartoon.me/Scripts/kimplayer.js?v=1",
							// "https://kimcartoon.me/Scripts/oran.min.js?v=3.19"
						// ]);


			
			if (items.enableDownloadAllLinks == true && $('.episodeList .listing').length) {
				var totalepisodes = $('.listing td:first-child').length;
				var isBusy = false;
				var SelectedQuality = "1080";
				var downloadMethod = "chrome";
				var downloadWarning = false;
				var SelectedEpisodesTitle = [];
				var SelectedEpisodes = [];
				var Links = [];
				var filenames = [];
				var quality = [];
				var extensions = [];
				var ajaxRequest;

				var tableElements = $(".listing > tbody > tr");
				var tableElementsHead = $( tableElements[0] ).html().trim().toLowerCase();

				if (tableElementsHead.indexOf("episode name") > -1 && tableElementsHead.indexOf("day added") > -1) {

					tableElements.splice(1,1);
					tableElements.each(function(index, value) {
						if ( index === 0 ) {
							$(this).append('<th>DL</th>');
						} else {
							$(this).append('<td><input type="checkbox" class="downloadCheckBox" name="downloadCheckBox"></td>');
						}
					});

					$('.listing').parent().before(`
							<div style="text-align:center;">
								<h3>Download Options:</h3>
								<span>Download Quality: </span>
								<select id="downloadQuality" class="KEDropdown">
									<option value="1080">1080p</option>
									<option value="720">720p</option>
									<option value="480">480p</option>
									<option value="360">360p</option>
								</select>
								&nbsp;
								<span>Download Method: </span>
								<select id="downloadMethod" class="KEDropdown">
									<option value="chrome">Default Chrome Downloader</option>
									<option value="extDLManager">External Download Manager</option>
								</select>

								<div class="clear2"></div>


								<label for="includeZeros">
									<div class="custcheck">
										<input id="includeZeros" style="display:none" type="checkbox" value="includeZeros">
									</div>
									<span>Include Leading Zeros in Episode #</span>
								</label>

								&nbsp;

								<label for="createFolder" id="createFolderContainer">
									<div class="custcheck">
										<input id="createFolder" style="display:none" type="checkbox" value="createFolder">
									</div>
									<span>Create Folder</span>
								</label>

								<div id="folderNameContainer" style="display:none;padding-top:5px">
									<label for="folderName">Folder Name</label>
									<input type="text" id="folderName" class="KEDropdown" size="60" style="text-align:center">
								</div>

								<div class="clear2"></div>
								<span>Select: </span><a href="javascript:void(0)" id="selectAll">All</a><span> | </span><a href="javascript:void(0)" id="selectNone">None</a><span> | </span><a href="javascript:void(0)" id="selectToggle">Toggle</a><span>
								&nbsp;
								<button type="button" id="downloadStart" class="KEDropdown">Start</button>

								<div id="downloadStatus" style="margin-top:10px;display:none"></div>

								<div id="textLinksContainer">
									<div class="clear2"></div>
									<textarea id="textLinks" rows="5" readonly></textarea>
									<div class="clear2"></div>
									<a href="javascript:void(0)" id="copyLinks">Copy Links to Clipboard</a>
								</div>
								<style>
									#textLinksContainer {
										display: none;
									}
									#textLinks {
										width: 100%;
										resize: none;
										white-space: pre;
										word-wrap: normal;
										color: white;
										background: rgba(22, 22, 22, 0.5);
										border: 1px dotted grey;
									}
									.custcheck {
										display: inline-block;
										vertical-align: sub;
										height: 12px;
										width: 12px;
										border: 1px solid grey;
									}
									#textLinks::-webkit-scrollbar {
										height: 0px;
										width: 0px;
									}
								</style>
							</div>
					`);
					// | </span><a href="javascript:void(0)" id="multiSelect" data-toggle="false">Multi Select <span id="multiSelectStatus">[OFF]</span></a>
				}

				$('#downloadQuality').change(function() {
					SelectedQuality = this.value;
				});

				$('#downloadMethod').change(function() {
					downloadMethod = this.value;

					if (this.value == 'chrome') {
						$('#createFolderContainer').show();
					} else {
						$('#createFolderContainer').hide();
						$('#createFolder')[0].checked = false;
						$('#createFolder').change();
					}

				});

				$('#folderName').val(AnimeTitle.replace(/[\\/:\*\?"<>\|]/g, '')).on('keypress', function(e) {
					if (/[\\/:\*\?"<>\|]/g.test(String.fromCharCode(e.keyCode))) {
						status('Charcater <span style="color:yellow">'+String.fromCharCode(e.keyCode)+'</span> not allowed in filename!', 3000);
						e.preventDefault();
					} else {
						return;
					}
				});

				$('#createFolder').change(function() {
					if (this.checked == true) {
						$('#folderNameContainer').show();
					} else {
						$('#folderNameContainer').hide();
					}
				});

				$('.custcheck input').change(function() {
					if (this.checked == true) {
						$(this).parent().css('background', 'skyblue');
					} else {
						$(this).parent().css('background', 'none');
					}
				});
				var lastChecked = null;

							$("body").keydown(e=>{if(e.key=="Escape"){$('#areYouAHuman').hide();status('<div style="color:gold">Retrying...</div>');setTimeout(function(){$('#areYouAHuman').remove();doRequest();},2000);}});
				$(document).ready(function() {


					var $chkboxes = $('.downloadCheckBox');
					$chkboxes.click(function(e) {
						if(!lastChecked) {
							lastChecked = this;
							return;
						}

						if(e.shiftKey) {
							var start = $chkboxes.index(this);
							var end = $chkboxes.index(lastChecked);

							$chkboxes.slice(Math.min(start,end), Math.max(start,end)+ 1).prop('checked', lastChecked.checked);

						}

						lastChecked = this;
					});
				});
				$(".downloadCheckBox").change(function() {
					this.checked ? $(this).closest('tr').addClass('ui-selected') : $(this).closest('tr').removeClass('ui-selected') ;
				});
				
				$(document).on('click', '#selectAll', function() {
					$(".downloadCheckBox").prop('checked', true).trigger('change');
				}).on('click', '#selectNone', function() {
					$(".downloadCheckBox").prop('checked', false).trigger('change');
				}).on('click', '#selectToggle', function() {
					$(".downloadCheckBox").each(function() {
						$(this).prop("checked", !$(this).prop("checked"));
					}).trigger('change');
				}).on('click', '#multiSelect', function() {
					if ($(this).attr('data-toggle') == "true") {
						$(this).attr('data-toggle', "false").find('#multiSelectStatus').text('[OFF]');
						// $('.listing > tbody').selectable('disable');
					} else {
						$(this).attr('data-toggle', "true").find('#multiSelectStatus').text('[ON]');
						// $('.listing > tbody').selectable('enable');
					}
				});

				x = $("table.listing > tbody");
				a = $("th").parent().remove();
				$(x).before("<thead>");
				$("thead").append(a);
				x.parent().tablesorter();
				// $('.listing > tbody').selectable({
					// disabled: true,
					// filter: 'tr:nth-child(n+2)',
					// cancel: 'a, input',
					// selecting: function(event, ui) {
						// $(ui.selecting).find(".downloadCheckBox").prop('checked', true);
					// },
					// unselecting: function(event, ui) {
						// $(ui.unselecting).find(".downloadCheckBox").prop('checked', false);
					// }
				// });

				$(document).on('click', '#downloadStart', function() {
					if (isBusy == false) {
						SelectedEpisodes = []; SelectedEpisodesTitle = []; Links = []; filenames = []; quality = []; extensions = []; // Clears the Arrays
						$(".downloadCheckBox:checked").parents('tr').each(function() {
							var episodeLink = $(this).children("td").first().find('a').first().prop('href');
							var episodeTitle = $(this).children("td").first().find('a').first().text().trim().replace(/[\\/:\*\?"<>\|]/g, ''); // .replace(/[\\/:\*\?"<>\|]/, '') removes any characters that cannot be used in windows filenames
							console.log(episodeTitle);
							if ($('#includeZeros')[0].checked == false) episodeTitle = episodeTitle.replace(/(?!Episode) \b0+/g, ' ');
							SelectedEpisodes.push(episodeLink);
							SelectedEpisodesTitle.push(episodeTitle);
							if ($('#createFolder')[0].checked == true) filenames.push($('#folderName').val()+'/'+episodeTitle);
							else filenames.push(episodeTitle);
						});
						if (SelectedEpisodes.length > 24 && downloadMethod == 'chrome') downloadWarning = true;
						else if (SelectedEpisodes.length <= 24 && downloadMethod == 'chrome') downloadWarning = false;
						if (SelectedEpisodes.length && downloadWarning == false) {
							$(this).text('Stop');
							$('#textLinksContainer').hide();
							status('<div style="color:gold">Starting...</div>');
							// $.get($("table tr td a").attr("href"),e=>console.log($("<script />",{text:$("script",e).filter((i,j)=>~j.innerText.search("Crypto")).text()}).appendTo("head")));
							doRequest();
						} else if (SelectedEpisodes.length && downloadWarning == true) {
							toastr['error']('<div style="margin-bottom:5px">You are about to start downloading 24+ episodes. DOING THIS IS NOT RECOMMENDED! YOU WILL BE SPAMMED WITH SAVE-AS DIALOG BOXES!</div><button type="button" class="downloadWarningContinue btn clear">Continue</button>&nbsp;<button type="button" class="downloadWarningCancel btn clear">Cancel</button>', 'Are you sure you wish to continue?', {timeOut: 0, extendedTimeOut: 0, positionClass: "toast-top-center"});
							$(document).on('click', '.downloadWarningContinue', function() {
								$('#downloadStart').text('Stop');
								$('#textLinksContainer').hide();

								doRequest();
							}).on('click', '.downloadWarningCancel', function() {
								console.log('Good. Smart choice.');
							});
						} else {
							status('Nothing is Selected!', 3000);
							console.log('Nothing is Selected!');
						}
					} else {
						$(this).text('Start');
						doEnd();
						ajaxRequest.abort();
						status('Stopped!', 3000);
					}
				});

				function doRequest() {
					console.log(SelectedEpisodes[0],SelectedEpisodesTitle[0]);
					$('#downloadQuality, #downloadMethod, #includeZeros, #createFolder, #folderName').prop('disabled', true);
					isBusy = true;
					ajaxRequest = $.ajax({
						url: SelectedEpisodes[0],
						success: function(data) {
							if (SelectedEpisodes.length > 0) {
								status('<div>Remaining: '+SelectedEpisodes.length+'</div></div>Finding Download Link for <span style="color:yellow">'+SelectedEpisodesTitle[0]+'</span></div>');
								// This is the point where the script will fail if KissAnime asks for the user to answer a Captcha. //
								try {
									console.log(data);
									console.log(location.origin.search("kimcartoon"));
									if (location.origin== "http://kimcartoon.me") {
										console.log(data.match(/decrypt.*"\);/)[0].slice(9,-3));
										var wra = $kissenc.decrypt(data.match(/decrypt.*"\);/)[0].slice(9,-3));
								console.log(!wra)
										if (!wra)
$("<iframe>",{id:"key",src:"http://kimcartoon.me/Cartoon/Alvinnn-And-the-Chipmunks-Season-3/Episode-2?id=75722",load:function(){$kissenc.setSecretKey(localStorage.secretkey);key.remove();status('<div style="color:gold">Retrying...</div>');setTimeout(function(){doRequest();},2000);}}).appendTo("body");										
										var DownloadContainer = new DOMParser().parseFromString(wra,"text/html").body
									}
									 else 
									var DownloadContainer = $("#divDownload", data).html(ovelWrap($("#divDownload", data).text().match(/ovelWrap\(.*?\)/)[0].slice(10, -2)));
									// var DownloadContainer = $(data).find('#divDownload')[0].outerHTML;
									console.log((DownloadContainer))
									console.log($(DownloadContainer))
									console.log($(DownloadContainer).find('a[href*="googlevideo"]'))
									
									// var DownloadContainer = $(data).find('#divDownload')[0].outerHTML;
									// var DownloadContainer2 = $(data).find('#selectQuality')[0].outerHTML;
								} catch(err) {
									status('<div style="color:orangered">Captcha Required!</div>');
									$('body').append('<iframe id="areYouAHuman" class="nah" src='+SelectedEpisodes[0]+'></iframe>');
									$('#areYouAHuman').css({
										'position': 'fixed',
										'width': '1000px',
										'height': '500px',
										'top': '10%',
										'left': '0px',
										'right': '0px',
										'margin': 'auto'
									});
									$('#areYouAHuman').load(function() {
										//$('#areYouAHuman').contents().find("#head, #headnav, #footer").hide();
										$('#areYouAHuman').contents().find("body > *:not('#containerRoot')").hide();
										$('#areYouAHuman').contents().find("#containerRoot > *:not('#container')").hide();
										$('#areYouAHuman').contents().find('body').prepend("<h2 style='padding-left: 5px'>The Download All option has Triggered KissAnime's Bot Detection. Please answer the Captcha below to continue.</h2>");

										$('#areYouAHuman').contents().find("#formVerify #btnSubmit").click(function(e) {
											
											$('#areYouAHuman').hide();
											status('<div style="color:gold">Retrying...</div>');
											setTimeout(function(){$('#areYouAHuman').remove();
												doRequest();
											},2000);
										});
									});
								}
								if ($(DownloadContainer).find('a[href*="googlevideo"]').length) {
									console.log('Direct GoogleVideo Link');

									//var itag37, itag22, itag59, itag18, itag43; itag37 = itag22 = itag59 = itag18 = itag43 = $('<a>');

									/* $.getScript('/Scripts/asp.js', function() {
										$(DownloadContainer2).find('option').each(function(a, b) {
											var _a = asp.wrap($(this).val());
											if ( _a.includes('itag=37') ) itag37 = itag37.attr('href', _a);
											if ( _a.includes('itag=22') ) itag22 = itag22.attr('href', _a);
											if ( _a.includes('itag=59') ) itag59 = itag59.attr('href', _a);
											if ( _a.includes('itag=18') ) itag18 = itag18.attr('href', _a);
											if ( _a.includes('itag=43') ) itag43 = itag43.attr('href', _a);
										});
										test();
									}); */

									var itag37 = $(DownloadContainer).find('a[href*="itag=37"]');
									var itag22 = $(DownloadContainer).find('a[href*="itag=22"]');
									var itag59 = $(DownloadContainer).find('a[href*="itag=59"]');
									var itag18 = $(DownloadContainer).find('a[href*="itag=18"]');
									var itag43 = $(DownloadContainer).find('a[href*="itag=43"]');

									//function test() {
										if (SelectedQuality == "1080") {
											if (itag37.length) {
												Links.push(itag37.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag37.text().split('.')[1]);
											} else if (itag22.length) {
												Links.push(itag22.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag22.text().split('.')[1]);
											} else if (itag59.length) {
												Links.push(itag59.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag59.text().split('.')[1]);
											} else if (itag18.length) {
												Links.push(itag18.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag18.text().split('.')[1]);
											} else if (itag43.length) {
												Links.push(itag43.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag43.text().split('.')[1]);
											} else {
												Links.push('No Link');
											}
										} else if (SelectedQuality == "720") {
											if (itag22.length) {
												Links.push(itag22.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag22.text().split('.')[1]);
											} else if (itag59.length) {
												Links.push(itag59.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag59.text().split('.')[1]);
											} else if (itag18.length) {
												Links.push(itag18.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag18.text().split('.')[1]);
											} else if (itag43.length) {
												Links.push(itag43.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag43.text().split('.')[1]);
											} else {
												Links.push('No Link');
											}
										} else if (SelectedQuality == "480") {
											if (itag59.length) {
												Links.push(itag59.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag59.text().split('.')[1]);
											} else if (itag18.length) {
												Links.push(itag18.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag18.text().split('.')[1]);
											} else if (itag43.length) {
												Links.push(itag43.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag43.text().split('.')[1]);
											} else {
												Links.push('No Link');
											}
										} else if (SelectedQuality == "360") {
											if (itag18.length) {
												Links.push(itag18.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag18.text().split('.')[1]);
											} else if (itag43.length) {
												Links.push(itag43.attr('href') + "&title=" + encodeURI(SelectedEpisodesTitle[0]));
												extensions.push(itag43.text().split('.')[1]);
											} else {
												Links.push('No Link');
											}
										}

										console.log(SelectedEpisodesTitle[0]);
										console.log('1080p: '+itag37.attr('href'));
										console.log('720p: '+itag22.attr('href'));
										console.log('480p: '+itag59.attr('href'));
										console.log('360p: '+itag18.attr('href'));
										console.log('360p?: '+itag43.attr('href'));

										SelectedEpisodesTitle.shift();
										SelectedEpisodes.shift();
										doRequest();

									//}

								} else if ($(DownloadContainer).find('a[href*="blogspot"]').length) {
									console.log('Blogspot Link');

									var m37 = $(DownloadContainer).find('a[href$="m37"]');
									var m22 = $(DownloadContainer).find('a[href$="m22"]');
									var m18 = $(DownloadContainer).find('a[href$="m18"]');
									var m36 = $(DownloadContainer).find('a[href$="m36"]');

									// m37 = 1080p or equivalent //
									// m22 = 720p or equivalent  //
									// m18 = 360p or equivalent  //
									// m36 = 180p or equivalent  //

									if (SelectedQuality == "1080") {
										if (m37.length) { // 1080
											Links.push(m37.attr('href'));
											extensions.push(m37.text().split('.')[1]);
										} else if (m22.length) { // 720
											Links.push(m22.attr('href'));
											extensions.push(m22.text().split('.')[1]);
										} else if (m18.length) { // 360
											Links.push(m18.attr('href'));
											extensions.push(m18.text().split('.')[1]);
										} else if (m36.length) {
											Links.push(m36.attr('href'));
											extensions.push(m36.text().split('.')[1]);
										} else {
											Links.push('No Link');
										}
									} else if (SelectedQuality == "720") {
										if (m22.length) { // 720
											Links.push(m22.attr('href'));
											extensions.push(m22.text().split('.')[1]);
										} else if (m18.length) { // 360
											Links.push(m18.attr('href'));
											extensions.push(m18.text().split('.')[1]);
										} else if (m36.length) {
											Links.push(m36.attr('href'));
											extensions.push(m36.text().split('.')[1]);
										} else {
											Links.push('No Link');
										}
									} else if (SelectedQuality == "480" || SelectedQuality == "360") {
										if (m18.length) { // 360
											Links.push(m18.attr('href'));
											extensions.push(m18.text().split('.')[1]);
										} else if (m36.length) {
											Links.push(m36.attr('href'));
											extensions.push(m36.text().split('.')[1]);
										} else {
											Links.push('No Link');
										}
									}

									console.log(SelectedEpisodesTitle[0]);
									console.log('1080p: '+m37.attr('href'));
									console.log('720p: '+m22.attr('href'));
									console.log('360?: '+m18.attr('href'));
									console.log('240/180p?: '+m36.attr('href'));

									SelectedEpisodesTitle.shift();
									SelectedEpisodes.shift();
									doRequest();
								} else if ($(DownloadContainer).find('a').length){
									Links.push($(DownloadContainer).find("a:first").attr("href"))
									extensions.push($(DownloadContainer).find("a:first").text().split('.')[1]);
									console.log(SelectedEpisodesTitle[0]);
									SelectedEpisodesTitle.shift();
									SelectedEpisodes.shift();
									doRequest();
								}
							} else {
								$('#downloadStart').text('Start');
								status('Completed!', 3000);
								doEnd();
							}
						},
						error: function() {
							if (isBusy == false) {
								console.debug('Aborted!');
								return;
							} else {
								doRequest();
							}
						}
					});
				}

				function doEnd() {
					$('#downloadQuality, #downloadMethod, #includeZeros, #createFolder, #folderName').prop('disabled', false);
					isBusy = false;
					if (downloadMethod == 'chrome') {
						var downloads = [];
						for (var i = 0; Links.length > i; i++) {
							console.log('Filename: /'+filenames[i]+'.'+extensions[i]);
							downloads.push({
								'url': Links[i],
								/* 'filename': filenames[i]+' ['+quality[i]+'p].'+extensions[i], */
								'filename': filenames[i]+'.'+extensions[i],
								'saveAs': false
							});
						}
						console.log(downloads);
						wgetDownload = "";
						for (i of downloads)
						wgetDownload += 'wget -t0 -c -b -O "' + i.filename + '" "' + i.url + '" --no-check-certificate\n'
						// $("<textarea>")
						chrome.storage.local.get("download", r => {
							download = r.download || {};
							today = (download[new Date().toISOString().replace(/T.*/, "")] || []).concat(wgetDownload.trim().split("\n"));
							download[new Date().toISOString().replace(/T.*/, "")] = today;
							r.download = download;
							chrome.storage.sync.set(r);
						})
						
						$("<textarea>",{text:wgetDownload}).appendTo("body")[0].select();document.execCommand("copy")
						chrome.runtime.sendMessage({
							'task': 'dsownloadAll',
							'data': []
						}, function(response) {
							// Useless. Didn't even realize I didn't set anything as a response.
							console.log(response);
							if ($.isEmptyObject(response)) {
								console.debug('Essentials for KissAnime: undefined object returned in response!');
							} else if (response.download == false) {
								console.debug('Essentials for KissAnime: permission for chrome.download has been denied!');
								toastr['error']('Essentials for KissAnime does not have permission to download!');
							} else if (response.download == true) {
								console.debug('Essentials for KissAnime: permission for chrome.download has been approved!')
							}
						});
					} else if (downloadMethod == 'extDLManager') {
						$('#textLinksContainer').show();
						$('#textLinks').val(Links.join("\n"));
					}
				}

				$(document).on('click', '#copyLinks', function() {
					$('#textLinks').select();
					document.execCommand('copy');
				});

				var statusTimeout;
				function status(text, timeout) {
					clearTimeout(statusTimeout);
					$('#downloadStatus').html(text).show();
					if (timeout != null) statusTimeout = setTimeout(function(){$('#downloadStatus').html('').hide();}, timeout);
				}

			}
		});

		// Color in the console //
		function consoleLogColor(text, color) {
			console.log('%c'+text, 'color:'+color);
		}

	});

}
