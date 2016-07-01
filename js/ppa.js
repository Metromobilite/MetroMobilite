// *
// Metromobilité is the mobile application of Grenoble Alpes Métropole <http://www.metromobilite.fr/>.
// It provides all the information and services for your travels in Grenoble agglomeration.

// Copyright (C) 2013
// Contributors:
//	NB/VT - sully-group - www.sully-group.fr - initialisation and implementation

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
// *
var processing = false;
var codeList = [ ];

var langLocale = {
	ppa :
	{
		oups : 'Oups...',
		horaireReel : " Horaire réel",
		problemeReseau : "Merci de vérifier votre connection réseau.",
		pasHoraire : "Désolé, nous n'avons pas d'horaire pour cet arrêt.",
		pasPassage : "Pas de passage dans les prochaines 60 minutes.",
		erreurWS : "Suite à un problème technique nous ne sommes pas en mesure d'afficher les horaires.",
		nousContacter : "Si le problème persiste, merci de bien vouloir nous contacter en précisant l'arrêt demandé et le code erreur. @metromobilite",
		emailBody : "Signalement de l'Erreur <%1> avec le code <%2>. Merci de bien vouloir préciser votre arrêt et votre direction : "
	}
}

//Deuximee ligne :  Nous signaler cette erreur.       signaler cette erreur... mail to et préciser l'arret....

//Prevent issue from URL param encoding (TAG/SMTC)
var params = urlParams.codeArret;

if(urlParams.codeArret && urlParams.codeArret.charAt(3)=='_') {
	params = urlParams.codeArret.replace("_",":");
}

if (isTaille('xs')) {

			var os = getMobileOperatingSystem();

			switch(os){
				case('Android'):
					$('#appli').css("display","inline-flex");
					$('#display').css("display","flex");
					$('#head>a span:first').css("display","none");
					$('.svgAndroid').css("display","block");
					$('#appli').attr("href", "http://play.google.com/store/apps/details?id=org.lametro.metromobilite");
				break;
				case('iOS'):
					$('#appli').css("display","inline-flex");
					$('#display').css("display","flex");
					$('#head>a span:first').css("display","none");
					$('.svgApple').css("display","block");
					$('#appli').attr("href", "itms-apps://itunes.apple.com/fr/app/domainsicle-domain-name-search/id966169282?ls=1&mt=8");
				break;
				case('Windows Phone'):
					$('#appli').css("display","inline-flex");
					$('#display').css("display","flex");
					$('#head>a span:first').css("display","none");
					$('.svgWindowsPhone').css("display","block");
					$('#appli').attr("href", "https://www.microsoft.com/en-us/store/apps/metromobilite/9nblggh1jp80");
				break;
				default:
				$('#appli').css("display","none");
			}
		}

chargeLignes(function(){},function(){
	startHARequest(params);
});

$(document).on( "evtLignesPasChargees", {}, function( event, data ) {
	afficheErreur(langLocale.ppa.problemeReseau);
});

function afficheErreur(param,erreur) {
			$('#information h3').html(langLocale.ppa.oups);
			$('#information .desc1').html(param);
			if (erreur) {
				$('#btnSignal').on('click', function (event) {
						event.preventDefault();
						window.location = 'mailto:contact@metromobilite.fr?subject=erreur au prochain passage: '+ erreur + '&body=' + langLocale.ppa.emailBody.replace("%1",erreur).replace("%2",(!params?"EMPTY":params));
				});
				$('#information').css("height","40%");
				$('#btnSignal').show();
			}
}

//Begining of the HA request
function startHARequest(code){
//building of the request object with any option
	if (typeof(urlParams.codeArret) == 'undefined') {
		afficheErreur(langLocale.ppa.erreurWS,"NO_PARAM");
		return;
	}
	if (urlParams.codeArret =="") {
		afficheErreur(langLocale.ppa.erreurWS,"PARAM_EMPTY");
		return;
	}
	var answer = {"info":{"code":code , "name":""},"lines":[]};
	
	getLigneHoraire(answer,{});
	
	//getArret(answer,{});
	
}

function getLigneHoraire(object,options){

	var code = object.info.code;
	
	var searchUrl = (url.saisieChoisie=='local'?url.hostnameLocal+url.portWSTest:url.hostnameData);
	//var searchUrl = 'http://127.0.0.1:8082';
	
	searchUrl += '/api/routers/default/index/stops/'+code+'/stoptimes';
	var answer = object;

	$.ajax({
		type: "GET",
		url: searchUrl,
		error:function (xhr, ajaxOptions, thrownError) {
			console.log('xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + 'thrownError : '+thrownError);
		},
		dataType: 'json'
	}).then(function(responses, textStatus, request) {
		
		var status = request.getResponseHeader('MM-STOPTIMES-STATUS');
		
		if ((responses.length == 0) && status) {
			if (status == 'WRONG_ID')
				afficheErreur(langLocale.ppa.erreurWS,"WRONG_ID");
			else if (status == 'REMOTE_TIMEOUT')
				afficheErreur(langLocale.ppa.erreurWS,"TIMEOUT");
			else 
				afficheErreur(langLocale.ppa.erreurWS,"UNKNOWN");
			return;
		}
		
		if (responses.length == 0) {
			afficheErreur(langLocale.ppa.pasHoraire);
			return;
		}
		responses.forEach(function(line){
			line.times.forEach(function(time){
				if (!time.realtimeDeparture && !time.scheduledDeparture) return;
				var t = (time.realtimeDeparture? time.realtimeDeparture : time.scheduledDeparture);
				var data={
					"id": line.pattern.id,
					"arrival":moment((t*1000)+(time.serviceDay*1000)) ,
					"realtime": time.realtime,
					"tripid":time.tripId,
					//"terminus": (time.tripId==''?{name:line.pattern.desc}:false)
					"terminus": line.pattern.desc
				};
				//filtrage des horaires au terminus dans le cas ou on a directement la destination dans line.pattern.desc (pas de tripId)
				var nomArret = responses[0].times[0].stopName.split(',')[1];
				var nomDest = line.pattern.desc;
				if (/*time.tripId!='' ||*/ nomArret.trim().toUpperCase().latinise() != nomDest.trim().toUpperCase().latinise())
					answer.lines.push(data);
			});	
			
		});
		//on filtre avant d'aller chercher les terminus
		var object = answer;
		object.info.name = responses[0].times[0].stopName;
		displayArret(object);
		object = filterResults(object);
		
		//getLigneTerminus(object);
		displayResult(object);
	});
}

function filterResults(object) {
	//cut the object with following constraint : never more than 60mn, no more than 15 row,
	//no more than 2 same line row.
	var newObject = object.lines;
	// sort of the final object on time
	
	object.lines.sort(function(line1,line2){
		return (line1.arrival.unix())-(line2.arrival.unix());
	});
	//Sort the array with only 2 same lines.
	var temporyTable = {};
	object.lines.forEach(function(line,index){
		var name = line.id.split(":")[0]+":"+line.id.split(":")[1];
		if(typeof(temporyTable[name])=="undefined") {
			temporyTable[name]=1;
		} else {
			if(temporyTable[name]==1) {
				temporyTable[name]=2;
			} else {
				newObject.splice(index,1);
			}
		}
	});
	object.lines = newObject;

	//Sort the object with only line wich will pass until 65 mn
	newObject = object.lines.filter(function(line){
					var now = moment().unix();
					var late = line.arrival.unix();
					var res = late-now;
					return (res/60)<65;
				});
	object.lines = newObject;

	//Select only the 15th first rows.
	if(object.lines.length>15){
		object.lines = array_slice(object.lines,0,15);
	}
	
	return object;
}

function displayResult(object){
	if (object.lines.length == 0) {
		$('#content').html(("<div class='infoMsg'>"+ langLocale.ppa.pasPassage +"</div>"));
		return;
	}
	object.lines.forEach(function(line){
		if (line.terminus == "erreur") return;
		var codeLgn = line.id;
		if (codeLgn.indexOf(':') != -1)
			codeLgn = line.id.split(":")[0]+"_"+line.id.split(":")[1];
		var obj = $('#model>.line').clone();
		obj.find('.title').html(getLogoLgn(codeLgn,dataLignesTC[codeLgn].shortName,"#"+dataLignesTC[codeLgn].color,false,"logo","logoRect"));
		obj.find('.heure').html(formatDelaiPP(line.arrival) + (line.realtime?'<div class="rss"><img  class="logoRss" src="img/rss.svg"/></div>':''));
		if (isTaille('xxs') && (line.terminus.indexOf(",") > -1)) {
			obj.find('.terminus').html(line.terminus);
		}
		else {
			obj.find('.terminus').html(line.terminus);
		}
		obj.attr('data-timestamp',line.arrival);
		obj.attr('data-tripid',line.tripid);
		obj.attr('data-line',line.id.split(":")[0]+"_"+line.id.split(":")[1]);
		$('#content').append(obj);
	});
	
	obj = $('#model>.line').clone();
	obj.find('.terminus').html();
	
	obj.find('.heure').html(('<div class="rss"><img  class="logoRss" src="img/rss.svg"/>' + langLocale.ppa.horaireReel + '</div>'));
	obj.addClass('noborder');
	obj.find('.heure').addClass('nocolor');
	$('#content').append(obj);
}

function displayArret(object){
	$('#information h3').html(object.info.name.split(", ")[1]);
	$('#information .desc1').html(object.info.name.split(", ")[0]);
	$('#information').attr('data-code',object.info.code);
}

function allowClick(){
	processing = false;
}

function refresh(){
	if(processing) return;
	codeList=[];
	processing = true;
	$("#content").empty();
	startHARequest(params);
	setTimeout(allowClick, 1000);
}

function error (param){
	console.log(param)
}

$('#information').click(function(){
	refresh();
});

$(".footer").click(function() {
	if (isMobile()) {
		if (navigator.userAgent.indexOf("Android") != -1) {
			window.location.href="https://play.google.com/store/apps/details?id=org.lametro.metromobilite";
			return;
		}
		if ((navigator.userAgent.indexOf("iPhone") != -1) || (navigator.userAgent.indexOf("iPad") != -1) || (navigator.userAgent.indexOf("iPod") != -1)) {
			window.location.href="itmss://itunes.apple.com/us/app/metromobilite/id966169282?l=fr&ls=1&mt=8&ign-mscache=1&affC=QQANAAAACwApnyYHMWwzdjdNagZhcHBzdHYAAAAAEjcPFA%3D%3D&ign-msr=https%3A%2F%2Fitunesconnect.apple.com%2FWebObjects%2FiTunesConnect.woa%2Fra%2Fng%2Fapp%2F966169282";
			return;
		}
	}
	else
	{
		window.location.href="pages/AppliMobile.html";
	}
});

$("#hideFooter").click(function(e) {
	e.stopImmediatePropagation();
	$('.footer').hide();
	$('#content').css('height','75%');
	$('#main').css('height','90%');
});

trackPiwik("MetroMobilité : ppa.html");