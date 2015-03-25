
$(document).ready(function() {
	var now = new Date();
	var diff = now.getTime() - localStorage['lastCheckDate'];
	
	if(diff > 180000) {
		chrome.extension.sendMessage({method: "loading"});
		pullNotes();
	}

    setInterval(pullNotes, 300000);
	// setInterval(updateFilledNotes, 600000);
});

function login () {
	console.log("logging in");
	
	$.ajax({
	  type: 'POST',
	  dataType: 'html',
	  url: 'https://www.studse.rfh-koeln.de/?func=login_check',
	  data: localStorage["credentials"],
	  success: function(data) {
		var sessionId = getURLParameter('PHPSESSID=',  $("<a=*[title='Prüfungsrelevante Daten']*>", data).attr('href'));
		
		if(sessionId.length > 5) {
			localStorage["session"] = sessionId;
			localStorage["loggedIn"] = true;
			chrome.extension.sendMessage({method: "loginSucessful"});
			localStorage['stars'] = 0;
			pullNotes();

			
		} else {
			localStorage["loggedIn"] = false;
			chrome.extension.sendMessage({method: "loginFailed"});
		}
		
	  }
	})
	
	return false;
}

function getURLParameter(name, url) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1]
    );
}

var data;
	
function pullNotes() {
	if(!toBool(localStorage["loggedIn"])) return;
	console.log("notes pulling");
	chrome.extension.sendMessage({method: "loading"});
	$.ajax({
	  type: 'GET',
	  dataType: 'html',
	  url: 'https://www.studse.rfh-koeln.de/vpruef/pruefungsergebnisse.php?PHPSESSID=' + localStorage["session"] +'&nav=1',
	  success: function(data) {
			localStorage['notes'] = data;
			var now =  new Date.now().toString("dd.MM.yyyy HH:mm:ss");

			
			if($("meta[http-equiv*='refresh']", localStorage['notes']).length > 0) {
				console.log("requesting new session");
				login();
			} else {
				console.log("notes pulled");
				localStorage['lastCheck'] = now;
				localStorage['lastCheckDate'] = new Date().getTime();
				
				
					var stars = $('td', localStorage['notes'] ).find('center:contains("*")').length;
					if(stars < localStorage['stars']) {
						 chrome.extension.sendMessage({method: "newnotes"});
						 localStorage['stars'] = stars;
					} else {
						localStorage['stars'] = stars;
					}
				
				
				// detectMissingNotes();
				// pullBANote();
				chrome.extension.sendMessage({method: "updateView"});
			}
	  }
	});
	

	
	return data;
}

function pullBANote() {
	if(!toBool(localStorage["loggedIn"])) return;
	console.log("notes pulling");
	chrome.extension.sendMessage({method: "loading"});
	$.ajax({
	  type: 'GET',
	  dataType: 'html',
	  url: 'https://www.studse.rfh-koeln.de/vpruef/thesis_beurteilung.php?PHPSESSID=' + localStorage["session"] +'&nav=1',
	  success: function(data) {
			localStorage['banote'] = data;

			console.log("ba note pulled");
			
			if($('td:contains("Gesamtnote")', localStorage['banote'] ).length > 0) {
				var stars = $('td:contains("*")', localStorage['banote'] ).length;
				if(stars < 1) {
					newBANote();
					chrome.extension.sendMessage({method: "newbanote"});
				}
				chrome.extension.sendMessage({method: "updateView"});
			}
			
	  }
	});
	return data;
}

function newBANote() {
	var notification = webkitNotifications.createNotification(
	  '',  // icon url - can be relative
	  'Bachelorarbeit Note',  // notification title
	  'Bachelorarbeit Note wurde eingetragen! - ' + $('td', localStorage['banote'] ).last().text() // notification body text
	);
	notification.show();
	chrome.browserAction.setBadgeText({"text":"!!!"})
}


function newNotes() {
	var notification = webkitNotifications.createNotification(
	  '',  // icon url - can be relative
	  'Neue Note',  // notification title
	  'Eine neue Note wurde eingetragen!'  // notification body text
	);
	// compareMissingNotes();
	notification.show();
	chrome.browserAction.setBadgeText({"text":"!"})
}

function pushToIphone() {
	$.ajax({
	  type: 'GET',
	  url: 'http://bitsunleashed.de/rfhgrades/simpleapi/com.php?action=push&matrikelnummer=' + localStorage["user"],
	  success: function(data) {}
	})
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.method == "login") {
		login();
	}  else if (request.method == "pullNotes") {
		pullNotes();
	}
});