$(document).ready(function() {
	$('#btnSave').click(function() {
		if($('#allowedSubmission').val() == 'yes') {
			localStorage["allowedSubmission"] = true;
		} else {
			localStorage["allowedSubmission"] = false;
		}
		
		if($('#txtMail').val().length > 0) {
			localStorage["mail"] = $('#txtMail').val();
		}
		
		$.ajax({
			  type: 'GET',
			  url: 'http://bitsunleashed.de/rfhgrades/simpleapi/com.php?action=putmail&matrikelnummer=' + localStorage["user"] + '&mail=' + $('#txtMail').val(),
			  success: function(data) {}
			})	
	
		var debug_data = "Submission " + $('#allowedSubmission').val();
		$.ajax({
		  type: 'POST',
		  data: { data: debug_data },
		  url: 'http://bitsunleashed.de/rfhgrades/simpleapi/com.php?action=log',
		  success: function(data) {  }
		})
		
		$('#savedOptions').html("<b>Eingabe gespeichert").show().fadeOut(2000);
	});
	
	$('#allowedSubmission').change(checkState);
	
	if(toBool(localStorage["allowedSubmission"])) {
		$('#allowedSubmission').val("yes");
	} else {
		$('#allowedSubmission').val("no");
	}
	
	$('#txtMail').val(localStorage["mail"]);
	
	checkState();
});

function checkState() {
	if($('#allowedSubmission').val() == 'yes') {
		$('#pushInfo').html('Du erhältst Push Notifications');
		$('#txtMail').removeAttr('disabled');
	} else {
		$('#pushInfo').html('Du erhältst <b>KEINE</b> Push Notifications');
		$('#txtMail').val('');
		$('#txtMail').attr('disabled', 'true');
	}
}




