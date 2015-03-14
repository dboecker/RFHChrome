var notes;
var updateTimout;
	
$(document).ready(function() {
	$("#divVersion").html(getVersion());
	$("#btnLogin").click(prepareLogin);
	$("#btnLogout").click(logout);
	$("#btnOptionen").click(openOptionsTab);
  
	$('#user').val(localStorage["user"]);
	$('#pass').val(localStorage["pass"]);
	
	if(toBool(localStorage["loggedIn"])) {
		$('#divLogin').hide();
		$('#divLogout').show();
		updateView();
	} else {
		$('#divLogin').show();
		$('#divLogout').hide();
		$('#resp').hide();
		$('#divContainer').hide();
	}
	chrome.browserAction.setBadgeText({"text":""})
	updateTimout = setInterval(updateView, 5000);

	var now = new Date();
	var diff = now.getTime() - localStorage['lastCheckDate'];
	
	if(diff > 180000) {
		$('#divLoading').show();
	}
	
	if(localStorage["mail"] === undefined && toBool(localStorage["loggedIn"])) {
		localStorage["allowedSubmission"] = true;
		localStorage["mail"] = "";
		// openOptionsTab();		
	}
	
	$('a').click(function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
	
});


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	// console.log(request.method );
	if (request.method == "loginSucessful") {
		$('#divLogin').hide();
		$('#divLogout').show();
	} else if (request.method == "loginFailed") {
		$('#divInfo').html("Logging failed!").fadeIn('slow');
	} else if (request.method == "loading") {
		console.log("show spinner");
		$('#divLoading').show();
	} else if (request.method == "newnotes") {
		newNotes();
	} else if (request.method == "newbanote") {
		newBANote();
	}else {
		updateView();
}});

function getVersion() {
    var details = chrome.app.getDetails();
    return details.version;
}
	
	
function updateView() {
		if(!toBool(localStorage["loggedIn"])) return;
		$('#divContainer').show();
		$('#resp').show().html($('table' , localStorage["notes"]));
		$("#resp [class*='header_top']").remove();
		$('#resp tr td:nth-child(2)').hide();
		$("#resp td[colspan*=3]").filter("[class!='termin_bez']").filter("[class!='semester_bez']").remove();
		
		if($('#resp td').length > 0) {
			var stars = $('#resp td').find('center:contains("*")').length;
			if(stars < localStorage['stars']) {
				 newNotes();
				 localStorage['stars'] = stars;
				 
			} else {
				localStorage['stars'] = stars;
			}
		}

		$('#divInfo').html("Ausstehende Noten : <b>" + stars + "</b><br/>Letztes Update : " + localStorage["lastCheck"]);
		$('#resp .button').replaceWith('<b>Neue Note!</b>');
		setTimeout(function(){ $('#divLoading').hide(); }, 2000);
		
		$('#studselink').attr('href', 'https://www.studse.rfh-koeln.de/vpruef/pruefungsergebnisse.php?PHPSESSID=' + localStorage["session"] + '&nav=1');


}

function newNotes() {
	var notification = webkitNotifications.createNotification(
	  '',  // icon url - can be relative
	  'Neue Note',  // notification title
	  'Eine neue Note wurde eingetragen!'  // notification body text
	);
	compareMissingNotes();
	notification.show();
	chrome.browserAction.setBadgeText({"text":"!"})
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
						
function pushToIphone() {
	$.ajax({
	  type: 'GET',
	  url: 'http://bitsunleashed.de/rfhgrades/simpleapi/com.php?action=push&matrikelnummer=' + localStorage["user"],
	  success: function(data) {}
	})
}

function prepareLogin() {
	console.log("trying to login");
	$('#divInfo').html("Logging in ...").fadeIn('slow');
	localStorage["user"] = $('#user').val()
	localStorage["pass"] = $('#pass').val()
	localStorage["credentials"] = $("#fLogin").serialize();
	localStorage['stars'] = 0;
	chrome.extension.sendMessage({method: "login"});
}

function logout() {
	clearTimeout(updateTimout);
	localStorage["user"] = "";
	localStorage["pass"] = "";
	localStorage["notes"] = "";
	localStorage["session"] = "";
	localStorage["loggedIn"] = false;
	$('#divContainer').hide();
	$('#divLogin').show();
	$('#divLogout').hide();
	$('#divInfo').html("");
	$('#resp').html("");
	$('#resp').hide();
	
}

