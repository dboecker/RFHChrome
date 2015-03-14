$.extend($.expr[':'],{
  containsExact: function(a,i,m){
    return $.trim(a.innerHTML.toLowerCase()) === m[3].toLowerCase();
  },
  containsExactCase: function(a,i,m){
    return $.trim(a.innerHTML) === m[3];
  },
  containsRegex: function(a,i,m){
    var regreg =  /^\/((?:\\\/|[^\/])+)\/([mig]{0,3})$/,
    reg = regreg.exec(m[3]);
    return reg ? RegExp(reg[1], reg[2]).test($.trim(a.innerHTML)) : false;
  }
});

// // function detectmissingnotes() {
	// // if(!tobool(localstorage["allowedsubmission"])) return;
	// // var kurse = [];
	
	// // $('td', localstorage["notes"]).find('center:contains("*")').parent().siblings().filter('td:nth-child(1)').each(function(index) {
		// // var kurs = extract($(this).text());
		// // kurse.push(kurs);
	// // });
	
	// // $(kurse).each(function() {
		// // this.semester = $(localstorage["notes"]).find("td:contains('"+this.code+"')").siblings().find('center:contains("*")').parents('tr').prevall().find(".semester_bez").html()
		// // this.termin = $(localstorage["notes"]).find("td:contains('"+this.code+"')").siblings().find('center:contains("*")').parents('tr').prevall().find(".termin_bez").html()
	// // });
	
	// // if(kurse.length > 0) {
		// // localstorage['missingnotes'] = json.stringify(kurse);
		// // $.ajax({
		  // // type: 'post',
		  // // data: { data: kurse },
		  // // url: 'http://bitsunleashed.de/rfhgrades/simpleapi/com.php?action=missingnotes&matrikelnummer=' + localstorage["user"],
		  // // success: function(data) {  }
		// // })
	// // } 
	
// // }

// // function comparemissingnotes() {
	// // if(!tobool(localstorage["allowedsubmission"])) return;
	// // var obj = jquery.parsejson(localstorage['missingnotes']);
	
	
	// // $(obj).each(function(index) {
		// // if($(localstorage["notes"]).find("td:contains('"+this.code+"')").siblings().find('center:contains("*")').length == 0) {
			// // if($(localstorage["notes"]).find("td:contains('"+this.code+"')").siblings().find('center:contains("nt")').length == 0) {
				// // console.log('reporting note');
				
				// // this.semester = $(localstorage["notes"]).find("td:contains('"+this.code+"')").siblings().not('center:contains("*")').parents('tr').prevall().find(".semester_bez").html()
				// // this.termin = $(localstorage["notes"]).find("td:contains('"+this.code+"')").siblings().not('center:contains("*")').parents('tr').prevall().find(".termin_bez").html()
				// // this.matrikelnummer = localstorage["user"];
			
				// // $.ajax({
				  // // type: 'post',
				  // // data: { data: this },
				  // // url: 'http://bitsunleashed.de/rfhgrades/simpleapi/com.php?action=reportnote', 
				  // // success: function(data) {}
				// // })
			// // }
			
		// // }
	// // });
// // }

// // function updatefillednotes() {
	// // if(!tobool(localstorage["allowedsubmission"])) return;
	// // if(!tobool(localstorage["loggedin"])) return;
	
	// // var kurse = [];
	
	// // $('td', localstorage["notes"]).filter('td[colspan!=3]').filter("td[class!='header_top']").children().filter('center').filter(function() {
       // // var match = /^[0-9]\.[0-9]$/;
	   // // return $(this).text().match(match);
    // // }).parent().parent().find('td:nth-child(1)').each(function(index) {
		// // var kurs = extract($(this).text());
		// // kurse.push(kurs);
	// // });
	
	// // $(kurse).each(function() {
		// // this.semester = $(localstorage["notes"]).find("td:contains('"+this.code+"')").siblings().not('center:contains("*")').parents('tr').prevall().find(".semester_bez").html()
		// // this.termin = $(localstorage["notes"]).find("td:contains('"+this.code+"')").siblings().not('center:contains("*")').parents('tr').prevall().find(".termin_bez").html()
	// // });
	
	// // if(kurse.length > 0) {
		// // $.ajax({
		  // // type: 'post',
		  // // data: { data: kurse },
		  // // url: 'http://bitsunleashed.de/rfhgrades/simpleapi/com.php?action=update',
		  // // success: function(data) {  }
		// // })
	// // } 
// // }

function trim(s) {
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s;
}

function extract(text) {
	var kurs = {
  		bez: trim(text.substr(0,text.length - 5)),
  		code: trim(text.substr(text.length - 5))
		};
	return kurs;
}

function toBool(str)
{
   if ("false" === str)
      return false;
   else 
      return str;
}

function openOptionsTab() {
	chrome.tabs.create({url: 'options.html'});
}

