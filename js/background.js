// Checks to see if extension updated or installed for the first time //

chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason == "install") {
		// Sets Default on Install //
		chrome.storage.sync.get(function(items) {
			if ($.isEmptyObject(items)) setDefault();
		});
		chrome.tabs.create({url: "options.html"});
		console.log('First Install');
	}
	else if (details.reason == "update") {
		/* chrome.storage.local.get('openOptionsOnUpdate', function(items) {
			if (items.openOptionsOnUpdate == true || items.openOptionsOnUpdate == null) chrome.tabs.create({url: "options.html"});
		}); */
		var version = chrome.app.getDetails().version;
		var notificationContent = {
		type: 'list',
		title: 'Essentials for KissAnime',
		message: 'Updated to Version: '+version+'',
		priority: 1,
		items: [{ title: 'Updated to Version:', message: ''+version+''},
				{ title: 'Click here to see what has changed.', message: ''}/* ,
				{ title: '', message: ''} */],
		iconUrl: 'NotificationIcon.png'
		}

		chrome.notifications.create('notifyUpdate', notificationContent, function() {console.log("Last Error:", chrome.runtime.lastError);});

		chrome.storage.sync.get(['PinnedList', 'PinnedListURLs', 'PinnedListLW', 'PinnedListImg'], function(items) {

			items.PinnedListImg = [];

			if (items.PinnedListImg !== 'undefined') {
				if (items.PinnedList.length != items.PinnedListImg.length) {
					console.log('PinnedListImg array is out of sync! Clearing PinnedListImg Array.');
					var ImgArray = [];
					console.log(items.PinnedList);
					items.PinnedList.forEach(function() {
						ImgArray.push('null');
					});
					chrome.storage.sync.set({PinnedListImg: ImgArray});
					chrome.storage.sync.remove('PinnedListTimeUpdate');
				}
			}

			if (items.PinnedListLW !== 'undefined') {
				if (items.PinnedList.length != items.PinnedListLW.length) {
					console.log('PinnedListLW array is out of sync! Clearing PinnedListLW Array.');
					var LWArray = [];
					$.each(items.PinnedList, function() {
						LWArray.push('null');
					});
					chrome.storage.sync.set({PinnedListLW: LWArray});
				}
			}

			/* var newStorageFormat = {
				'Titles': items.PinnedList,
				'URLs': items.PinnedListURLs,
				'Imgs': items.PinnedListImg,
				'LW': items.PinnedListImg
			} */

		});

		/*
			I will probably change the way the Pinned List Items are stored. As of right now everything is stored in 4 arrays:
			- PinnedList
			- PinnedListURLs
			- PinnedListImg
			- PinnedListLW
			I plan on storing them in 1 object with 4 arrays inside.
			Example:
				PinnedList = {
					'Titles': ['AnimeTitle1', 'AnimeTitle2', 'AnimeTitle3'],
					'URLs': ['AnimeURL1', 'AnimeURL2', 'AnimeURL3'],
					'Imgs': ['AnimeImg1', 'AnimeImg2', 'AnimeeImg3'],
					'LW': ['AnimeLW1', 'AnimeLW2', 'AnimeLW3']
				}
			Files that will have to be modified for this new format: homepage.js, animeinfo.js, popup.js, options.js, info.js, videopage.js
		*/

		chrome.storage.local.set({previousVersion: details.previousVersion});
		chrome.storage.local.set({recentlyupdated: true});
		chrome.storage.sync.remove('airinglist_state');

		console.log('Updated');

	}
});

function setDefault() {
	chrome.storage.local.set({firstinstall: true});
	chrome.storage.sync.set({
		// Global //
		enableAds: true,
		enableSocialButtons: true,
		enableCommentSections: true,
		enableCustomLogo: false,
		enableSlimHeader: false,
		enableNotifyUpdates: false,
		enableCustomScheme: false,
		enableFooter: true,

		// Home Page //
		enableHomepageAds: true,
		enableWelcomeBox: true,
		enablePinnedBox: true,
		enableAltPinnedBox: false,
		enableBanner: true,
		enableAltRecentList: false,
		enableShowOnlyAiring: false,
		enablePinnedTooltips: true,
		enableLatestEpisode: true,
		enableLastVideo: true,

		// Anime Page //
		enableFindinMAL: true,
		enableFindRedditDiscussions: true,
		enableDownloadAllLinks: false,

		// Bookmarks Page //
		relocateAiringBookmarks: false,

		// Video Page //
		enableVideoPageAds: true,
		enablePlayerSwitchers: true,
		enableLightsOff: true,
		enableDownloadLinks: true,
		enableFileName: true,
		enableBookmarkLink: true,
		enableAutoAdvEp: false,
		enableKeyboardShortcuts: false,
		enablePlaybackRate: false,
		enableAutoFullscreen: false,
		enableAutoHD: false,
		enableAutoLQ: false,
		enableAltVideoPage: false,
		enablePauseOnSwitch: false,
		enableStretchFullscreenVid: false,
		enableHTML5Fix: false,
		enableTheaterMode: false
	});
}

// Retrieves the Extension's Version Number and saves in local storage //

getVersion();
function getVersion() {
	var version = chrome.runtime.getManifest().version;
	var version_name = chrome.runtime.getManifest().version_name;
	chrome.storage.local.set({
		version: version,
		version_name: version_name
	});
}

function openOptionsPage() {
	chrome.runtime.openOptionsPage();
}

var extensionID = '';

checkIfWaifuExtensionInstalled();
function checkIfWaifuExtensionInstalled() {
	chrome.runtime.sendMessage(extensionID, {checkIfInstalled: true}, function(response) {
		if (response && response.isInstalled == true) {
			console.log('Installed');
			chrome.storage.local.set({waifuExtensionInstalled: true});
		} else {
			console.log('Not Installed');
			chrome.storage.local.set({waifuExtensionInstalled: false});
		}
	});
}

chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
	if (sender.id == extensionID) {
		if ('checkIfInstalled' in request) {
			if (request.checkIfInstalled == true) {
				sendResponse({isInstalled: true});
			}
		}
	}
});

/* redirects the video.js and video-js.css to the updated one packaged with this extension */
chrome.webRequest.onBeforeRequest.addListener(function(details) {
	console.debug(details);
	// Redirect //
	if( details.url.indexOf("/Scripts/video-js/video.js") > -1 ) return { redirectUrl: chrome.runtime.getURL('js/videojs/video.js') };
	if( details.url.indexOf("/Scripts/videojs.hotkeys.min.js") > -1 ) return { redirectUrl: chrome.runtime.getURL('js/videojs/videojs.hotkeys.js') };
	if( details.url.indexOf("/Scripts/video-js/video-js.css") > -1 ) return { redirectUrl: chrome.runtime.getURL('js/videojs/video-js.css') };
	// Cancel //
}, {urls: ["*://*.kissanime.ru/Scripts/*", "*://*.kisscartoon.se/Scripts/*"], types: ["script", "stylesheet"]}, ["blocking"]);

///////////////////////////////////////////////////
// Blocks Ads that comes from KissAnime's Domain //
///////////////////////////////////////////////////

var blockingEventBinded = false;
var optionStatus = [];
var blockingCallback = function(details) {
	blockingEventBinded = true;
	return {cancel: true}
};
var blockingDomains = {
	urls: [
		"*://kissanime.ru/ads/*",
		"*://kisscartoon.se/ads/*",
		"*://kissanime.ru/xyz/check.aspx",
		"*://kisscartoon.se/xyz/check.aspx"
	]
}

chrome.storage.sync.get(['enableAds', 'enableHomepageAds', 'enableVideoPageAds'], function(items) {
	optionStatus = [items.enableAds, items.enableHomepageAds, items.enableVideoPageAds];
	// || items.enableHomepageAds == false || items.enableVideoPageAds == false
	if ( items.enableAds == false ) {
		chrome.webRequest.onBeforeRequest.addListener(blockingCallback, blockingDomains, ['blocking']);
	}
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		if ( key == "enableAds" ) {
			if ( changes[key].newValue == true ) {
				chrome.webRequest.onBeforeRequest.removeListener(blockingCallback);
			} else {
				chrome.webRequest.onBeforeRequest.addListener(blockingCallback, blockingDomains, ['blocking']);
			}
		}
	}
});

/////////////////////////////////
// Anime Updates Notifications //
/////////////////////////////////////////////////////////////////////////////////////////////
// This is a really poor and inefficient way of finding new updates and displaying them.   //
// I'll revisit this later and improve it. For now it works fine with no noticeable issues. //
/////////////////////////////////////////////////////////////////////////////////////////////

/* chrome.storage.sync.get('enableNotifyUpdates', function(items) {
	if (items.enableNotifyUpdates == true) {
		NotifyUpdate();
		console.log('Notifications Toggled On');
	}
}); */

/* chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		if (key == "NotifyTimes") {
			NotifyUpdate();
		} else if (key == "enableNotifyUpdates") {
			chrome.storage.sync.get('enableNotifyUpdates', function(items) {
				if (items.enableNotifyUpdates == true) {
					NotifyUpdate();
					console.log('Notifications Toggled On');
				} else {
					clearInterval(updateNotificationInterval);
					console.log('Notifications Toggled Off');
				}
			});
		}
	}
}); */

//var updateNotificationInterval  = 0;
//var updateURL = 'https://kissanime.com/AnimeList/LatestUpdate';
/* I didn't realize that chrome will throttle the connection if the site is constantly returning 500 errors or greater and increase the time throttled after constant errors so now if the extension is
unable to reach https://kissanime.to/  after x amount of tries, it will  */
//var errorCount = 0;
//var maxErrorsAllowed = 10;
/* function NotifyUpdate() {
	var old;
	var current;
	var oldArray = [];
	var currentArray = [];
	$.ajax({
		url: updateURL,
		type: 'GET',
		success: function(data) {
			current = $(data).find('.listing').html();
			chrome.storage.sync.get('NotifyTimes', function(items) {
				var updateTime = items.NotifyTimes * 60000;
				console.log('Refresh Time: '+updateTime / 1000+'sec(s)');
				clearInterval(updateNotificationInterval);
				updateNotificationInterval = window.setInterval(function() {
					$.ajax({
						url: updateURL,
						type: 'GET',
						success: function(data_1) {
							old = current;
							current = $(data_1).find('.listing').html();

							if (old == current) {
								console.log('No New Updates');
							} else {
								currentArray = [];
								oldArray = [];
								$(old).find('td:first-child > a').each(function() {
									var AnimeName = $(this).text().trim();
									oldArray.push(AnimeName);
								});
								console.log(oldArray);
								$(current).find('td:first-child > a').each(function() {
									var AnimeName = $(this).text().trim();
									currentArray.push(AnimeName);
								});
								console.log(currentArray);

								var pos = currentArray.indexOf(oldArray[0]);
								currentArray.splice(pos);
								updates = currentArray.join(' | ');
								console.log(updates);
								console.log('New Updates.');
								sendUpdateNotification('New Updates Available. '+updates, null, 'animeUpdate');

							}
						},
						statusCode: {
							503: function() {doCookieCheck();}
						}
					});
				}, updateTime);
			});
		},
		statusCode: {
			503: function() {doCookieCheck();}
		}
	});

	function doCookieCheck() {
		chrome.cookies.get({'url': 'https://kissanime.to', 'name': 'cf_clearance'}, function(cookie) {
			if (cookie) {
				sendUpdateNotification('Unable to connect to KissAnime. The Service is Unavailable.', 20000, 'error');
			} else {
				sendUpdateNotification('Your CloudFlare Cookie has expired or been deleted. Due to this, we will not be able to notify you when new Anime is available. Please visit kissanime.to or click on this notification to fix this issue.', 20000, 'error');
			}
			errorCount++;
		});
	}

} */

function sendUpdateNotification(msg, t, type) {
	var notificationContent = {
		type: 'basic',
		title: 'Essentials for KissAnime',
		message: msg,
		priority: 1,
		iconUrl: 'NotificationIcon.png'
	}
	if (type == "animeUpdate") {
		chrome.notifications.create('notifyAnimeUpdate', notificationContent, function() {console.log("Last Error:", chrome.runtime.lastError);});
		if (t != null) {
			setTimeout(function(){chrome.notifications.clear('notifyAnimeUpdate')}, t);
		}
	} else if (type == "error") {
		chrome.notifications.create('error', notificationContent, function() {console.log("Last Error:", chrome.runtime.lastError);});
		if (t != null) {
			setTimeout(function(){chrome.notifications.clear('error')}, t);
		}
	} else {
		chrome.notifications.create(notificationContent, function() {console.log("Last Error:", chrome.runtime.lastError);});
	}
}

chrome.notifications.onClicked.addListener(function(notificationId) {
	if (notificationId == "notifyAnimeUpdate") {
		chrome.tabs.create({url: "https://kissanime.ru/"});
	} else if (notificationId == "notifyUpdate") {
		chrome.tabs.create({url: chrome.runtime.getURL('/changelog.html#current')});
	} else {
		chrome.tabs.create({url: "https://kissanime.ru/"});
	}
});

/////////////////////
// MAL Integration //
/////////////////////

var user; var pass;
chrome.storage.local.get(['MALuser', 'MALpass'], function(MAL) {
	user = MAL.MALuser;
	pass = MAL.MALpass;
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	console.log('changed');
	for (key in changes) {
		var changedKeys = changes[key];
		if (key == "MALuser" ) {
			user = changedKeys.newValue;
			console.log('Updated MAL Username');
		} else if (key == "MALpass") {
			pass = changedKeys.newValue;
			console.log('Updated MAL Password');
		} else if (key == "MALLoggedIn") {

		}
	}
});

// Login Auth //

function CheckLogin() {
	console.log('MAL: Logging In...');
	var returnData = [];
	$.ajax({
		url: 'https://myanimelist.net/api/account/verify_credentials.xml',
		type: 'GET',
		password: pass,
		username: user,
		async: false,
		dataType: 'xml',
		success: function(data) {
			console.log(data);
			var username_xml = $(data).find('username').text();
			returnData = [1, "Success"];
			chrome.storage.local.set({MALLoggedIn: true});
			console.log(username_xml);
		},
		error: function(data) {
			console.log(data);
			returnData = [2, "Error", data.responseText];
			chrome.storage.local.set({MALLoggedIn: false});
		}
	});
	return returnData;
}

function FindMALID(titles, kissanime_path) {
	var returnData = [];
	var checkXML = CheckXML(kissanime_path);
	if (checkXML) {
		var mal_id = checkXML;
		// This has to be done this way because you can't use the MAL API to search using the Anime ID so instead I have to request the page itself and find the element that contains the information I need.
		$.ajax({
			url: 'https://myanimelist.net/anime/' + mal_id,
			type: 'GET',
			async: false,
			timeout: 10000,
			success: function(data) {
				var malData = CheckUserMAL(mal_id);
				var malScore = $(data).find('[itemprop="ratingValue"]').text();
				var malEpisodes = $(data).find('.dark_text:contains("Episodes:")').parent().text().replace('Episodes:' ,'').trim();
				if (malEpisodes == 'Unknown') malEpisodes = '0';
				if (malData) returnData = [mal_id, malData[0], malData[1], malScore];
				else returnData = [mal_id, false, malEpisodes, malScore];
			}
		});
	} else {
		var i = 0;
		doSearch();
		function doSearch() {
			$.ajax({
				url: 'https://myanimelist.net/api/anime/search.xml',
				type: 'GET',
				password: pass,
				username: user,
				async: false,
				data: 'q=' + titles[i],
				processData : false,
				dataType: 'xml',
				timeout: 10000,
				success: function(data) {
					console.log(data);
					console.log(titles[i]);

					$(data).find('entry').each(function() {
						var synonyms = $(this).find('synonyms').text().split('; ');
						if (titles[i]) titles[i] = titles[i].toLowerCase();
						/* if ($(this).find('title').text() == titles[i] || $(this).find('english').text() == titles[i] || $(this).find('synonyms').text() == titles[i]) { */
						if ($(this).find('title').text().toLowerCase() == titles[i] || $(this).find('english').text().toLowerCase() == titles[i] || $.inArray(titles[i], synonyms) > -1) {
							returnData = $(this);
							return false;
						}
					});

					var mal_id = $(returnData).find('id').text();
					console.log( $(returnData).find('title').text() + ' ' +  mal_id);
					if ($(returnData).length) {
						var malData = CheckUserMAL(mal_id);
						if (malData) returnData = [mal_id, malData[0], malData[1], $(returnData).find('score').text()];
						else returnData = [mal_id, false, $(returnData).find('episodes').text(), $(returnData).find('score').text()];
					}
					i++; if (!$(returnData).length && i < titles.length) {
						doSearch();
					}

				},
				error: function(data) {
					console.log(data);
					return;
				}
			});
		}
	}
	return returnData;
}

function FindMALID2(title) {
	var returnData = [];
	var i = 0;
	doSearch();
	function doSearch() {
		$.ajax({
			url: 'https://myanimelist.net/api/anime/search.xml',
			type: 'GET',
			password: pass,
			username: user,
			async: false,
			data: 'q=' + title,
			processData : false,
			dataType: 'xml',
			timeout: 10000,
			success: function(data) {
				console.log(data);
				console.log(title);
				$(data).find('entry').each(function() {
					var synonyms = $(this).find('synonyms').text().split('; ');
					if (StringCompare(title, $(this).find('title').text()) < 5 || StringCompare(title, $(this).find('english').text()) < 5) {
						returnData = $(this);
						return false;
					} else {
						var $this = $(this);
						$.each(synonyms, function(index, value) {
							if (StringCompare(title, synonyms[index]) < 4) {
								returnData = $this;
								return false;
							}
						});
					}
				});

				var mal_id = $(returnData).find('id').text();
				console.log( $(returnData).find('title').text() + ' ' +  mal_id);

				returnData = [mal_id];

			},
			error: function(data) {
				console.log(data);
				return;
			}
		});
	}
	return returnData;
}

function StringCompare(a, b) {
	if (a.length === 0) return b.length;
	if (b.length === 0) return a.length;
	var matrix = [];
	var i;
	for (i = 0; i <= b.length; i++) {
		matrix[i] = [i];
	}
	var j;
	for (j = 0; j <= a.length; j++) {
		matrix[0][j] = j;
	}
	for (i = 1; i <= b.length; i++) {
		for (j = 1; j <= a.length; j++) {
			if (b.charAt(i-1) == a.charAt(j-1)) {
				matrix[i][j] = matrix[i-1][j-1];
			} else {
				matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
				Math.min(matrix[i][j-1] + 1, // insertion
				matrix[i-1][j] + 1)); // deletion
			}
		}
	}
	return matrix[b.length][a.length];
}

function CheckUserMAL(id, format) {
	var returnData; var userMAL;
	$.ajax({
		url: 'https://myanimelist.net/malappinfo.php',
		method: 'GET',
		async: false,
		data: 'u=' + user + '&status=all&type=anime',
		dataType: 'xml',
		success: function(data) {
			userMAL = data;
		},
		error: function(data) {
			console.log(data);
			return;
		}
	});
	$(userMAL).find('anime').each(function() {
		var mal_id = $(this).find('series_animedb_id').text();
		if (id == mal_id) {
			if (format == 'xml') returnData = [true, this];
			else returnData = [true, $(this)[0].outerHTML];
		}
	});
	return returnData;
}

// Add Anime to MAL //

function AddAnimeToMAL(id, status) {
	var returnData = [];
	$.ajax({
		url: 'https://myanimelist.net/api/animelist/add/'+id+'.xml',
		type: 'POST',
		password: pass,
		username: user,
		async: false,
		data: 'data=<?xml version="1.0" encoding="UTF-8"?><entry><status>'+status+'</status></entry>',
		success: function(data) {
			console.log('Success', $(data).filter('title').text());
			returnData = ['Success', $(data).filter('title').text().split(' ')[0], $(data).filter('title').text().split(' ')[1]]
		},
		error: function(data) {
			console.log(data);
			console.log('Error:', data.status, data.responseText);
			returnData = ['Error', data.status, data.responseText];
		}
	});
	return returnData;
}

// Remove Anime from MAL //

function RemoveAnimeFromMAL(id) {
	var returnData = [];
	$.ajax({
		url: 'https://myanimelist.net/api/animelist/delete/'+id+'.xml',
		type: 'DELETE',
		password: pass,
		username: user,
		async: false,
		dataType: 'xml',
		succes: function(data) {
			console.log(data.status+' '+data.responseText);
			returnData = [data.status, data.responseText];
		},
		error: function(data) {
			console.log(data);
			console.log(data.status+' '+data.responseText);
			returnData = [data.status, data.responseText];
		}
	});
	return returnData;
}

function UpdateAnimeEpisode(id, episode) {
	var returnData = []; var xml;
	var malData = CheckUserMAL(id, 'xml');
	var dateFull = new Date();
	var month = dateFull.getMonth() + 1;
	var date = dateFull.getDate()
	if (month.toString().length == 1) month = '0' + month;
	if (date.toString().length == 1) date = '0' + date;
	dateFull = month+date+dateFull.getFullYear();
	if ( $(malData).find('my_start_date').text() == "0000-00-00" && episode == 1) {
		xml = 'data=<?xml version="1.0" encoding="UTF-8"?><entry><episode>'+episode+'</episode><date_start>'+dateFull+'</date_start><status>1</status></entry>';
		console.log('No Date Detected. Setting Date.');
	} else if ( $(malData).find('series_episodes').text() == episode && $(malData).find('series_episodes').text() != 0 ) {
		xml = 'data=<?xml version="1.0" encoding="UTF-8"?><entry><episode>'+episode+'</episode><date_finish>'+dateFull+'</date_finish><status>2</status></entry>';
		console.log('Anime Finished. Setting Completed Date.');
	} else if ( episode > 0 && episode < $(malData).find('series_episodes').text() && $(malData).find('my_status').text() == 6 ) {
		xml = 'data=<?xml version="1.0" encoding="UTF-8"?><entry><episode>'+episode+'</episode><status>1</status></entry>';
		console.log('Date Detected. Status is set to PTW.');
	} else {
		xml = 'data=<?xml version="1.0" encoding="UTF-8"?><entry><episode>'+episode+'</episode></entry>';
		console.log('Date Detected. Updating Normally.');
	}
	$.ajax({
		url: 'https://myanimelist.net/api/animelist/update/'+id+'.xml',
		type: 'POST',
		password: pass,
		username: user,
		async: false,
		data: xml,
		success: function(data) {
			console.log('Success', data);
			returnData = ['Success', data];
		},
		error: function(data) {
			console.log(data);
			console.log('Error:', data.status, data.responseText);
			returnData = ['Error', data.status, data.responseText];
		}
	});
	return returnData;
}

function UpdateAnimeStatus(id, status) {
	var returnData = [];
	$.ajax({
		url: 'https://myanimelist.net/api/animelist/update/'+id+'.xml',
		type: 'POST',
		password: pass,
		username: user,
		async: false,
		data: 'data=<?xml version="1.0" encoding="UTF-8"?><entry><status>'+status+'</status></entry>',
		success: function(data) {
			console.log('Success', data);
			returnData = ['Success', data];
		},
		error: function(data) {
			console.log(data);
			console.log('Error:', data.status, data.responseText);
			returnData = ['Error', data.status, data.responseText];
		}
	});
	return returnData;
}

function UpdateAnimeScore(id, score) {
	var returnData = [];
	$.ajax({
		url: 'https://myanimelist.net/api/animelist/update/'+id+'.xml',
		type: 'POST',
		password: pass,
		username: user,
		async: false,
		data: 'data=<?xml version="1.0" encoding="UTF-8"?><entry><score>'+score+'</score></entry>',
		success: function(data) {
			console.log(data);
			returnData = ['Success', data];
		},
		error: function(data) {
			console.log(data);
			console.log('Error:', data.status, data.responseText);
			returnData = ['Error', data.status, data.responseText];
		}
	});
	return returnData;
}

function UpdateAnimeDates(id, dates) {
	console.log(dates[0], dates[1]);
	var returnData = [];
	$.ajax({
		url: 'https://myanimelist.net/api/animelist/update/'+id+'.xml',
		type: 'POST',
		password: pass,
		username: user,
		async: false,
		data: 'data=<?xml version="1.0" encoding="UTF-8"?><entry><date_start>'+dates[0]+'</date_start><date_finish>'+dates[1]+'</date_finish></entry>',
		success: function(data) {
			console.log('Success', data);
			returnData = ['Success', data];
		},
		error: function(data) {
			console.log(data);
			console.log('Error:', data.status, data.responseText);
			returnData = ['Error', data.status, data.responseText];
		}
	});
	return returnData;
}

function CheckXML(kissanime_path) {
	var result;
	$.ajax({
		url: 'https://s3.amazonaws.com/essentialsforkissanime/KissAnime-MAL.xml',
		async: false,
		type: 'GET',
		dataType: 'xml',
		timeout: 5000,
		success: function(data) {
			result = $(data).find('entry').filter(function() {
				return $(this).find('kissanime_path').text() == kissanime_path;
			});
			result = $(result).find('mal_id').text();
		},
		error: function(data) {
			return;
		}
	});
	return result;
}

/*
	Request Codes:
	0 = Check Auth                         [Request Code]
	1 = Search Anime ID and Status         [Request Code, Anime Title]
	2 = Add To MAL                         [Request Code, Anime ID]
	3 = Remove From MAL                    [Request Code, Anime ID]
	4 = Update Episode                     [Request Code, Anime ID, Episode]
	5 = Update Status                      [Request Code, Anime ID, Status]
	6 = Update Score                       [Request Code, Anime ID, Status]
	7 = Update Dates					   [Request Code, Anime ID, Dates Array]
*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	if ('MAL' in request) {
		var request = request.MAL;
		if (request[0] == 0) {
			console.log('Request Type:', request[0], '(Check MAL Login)');
			var LoginStatus = CheckLogin();
			sendResponse({MALLoginStatus: LoginStatus});
		} else if (request[0] == 1) {
			console.log('Request Type:', request[0], '(Search Anime ID and Status)');
			console.log('Request ID/Name:', request[1]);
			var MAL = FindMALID(request[1], request[2]);
			sendResponse({MAL: MAL});
		} else if (request[0] == 2) {
			console.log('Request Type:', request[0], '(Add To MyAnimeList)');
			console.log('Request ID:', request[1]);
			var malStatusAdd = AddAnimeToMAL(request[1], 6); // Default 6 = Plan To Watch
			sendResponse({malStatusAdd: malStatusAdd});
		} else if (request[0] == 3) {
			console.log('Request Type:', request[0], '(Remove From MyAnimeList)');
			console.log('Request ID:', request[1]);
			var malStatusRemove = RemoveAnimeFromMAL(request[1]);
			sendResponse({malStatusRemove: malStatusRemove});
		} else if (request[0] == 4) {
			console.log('Request Type:', request[0], '(Update Anime Episode)');
			console.log('Request ID:', request[1]);
			console.log('Request Episode:', request[2]);
			var malUpdateEpisode = UpdateAnimeEpisode(request[1], request[2]);
			sendResponse({malUpdateEpisode: malUpdateEpisode});
		} else if (request[0] == 5) {
			console.log('Request Type:', request[0], '(Update Anime Status)');
			console.log('Request ID:', request[1]);
			console.log('Request Status:', request[2]);
			var malUpdateStatus = UpdateAnimeStatus(request[1], request[2]);
			sendResponse({malUpdateStatus: malUpdateStatus});
		} else if (request[0] == 6) {
			console.log('Request Type:', request[0], '(Update Anime Score)');
			console.log('Request ID:', request[1]);
			console.log('Request Score:', request[2]);
			var malUpdateScore = UpdateAnimeScore(request[1], request[2]);
			sendResponse({malUpdateScore: malUpdateScore});
		} else if (request[0] == 7) {
			console.log('Request Type:', request[0], '(Update Anime Dates)');
			console.log('Request ID:', request[1]);
			console.log('Request Dates:', request[2]);
			var malUpdateDates = UpdateAnimeDates(request[1], request[2]);
			sendResponse({malUpdateDates: malUpdateDates});
		}
	} else if ('task' in request) {
		if(request['task'] == 'downloadAll') {
			try {
				console.log("Begin Download")
				downloadAll(request['data']);
				success = !0
			} catch(e) {
				success = !1
				var result = chrome.permissions.contains({permissions: ['downloads']}, function(result) {
					if (result == false) console.error('Essentials for KissAnime does not have permission to download!');
				});
			} finally {
			sendResponse({download:success})}
		}
	} else if ('open' in request) {
		if (request['open'] == 'extPage') {
			chrome.tabs.create({url: 'chrome://extensions/'});
		}
	}

});

downloadAll = function(items) {
    item = items.shift();
    chrome.downloads.download(item, function() {
        if (items.length > 0) downloadAll(items);
    });
}

chrome.storage.local.get(function(data) {
	console.log('Local Storage:');
	console.log(data);
});
chrome.storage.sync.get(function(data) {
	console.log('Sync Storage:');
	console.log(data);
});
