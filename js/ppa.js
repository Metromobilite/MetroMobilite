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
var codeList = [ ];

var mapLiveMap = null;
var sourceLiveMap = null;
var currentTripId = null;
var currentPatternId = null;//fake
var currentDest = null;
var currentServiceDay = null;
		

var langLocale = {
	ppa :
	{
		//oups : 'Oups...', //PROVISOIRE
		oups : 'Votre prochain passage sera bientôt disponible', //PROVISOIRE
		horaireReel : " Horaire réel",
		problemeReseau : "Merci de vérifier votre connection réseau.",
		pasHoraire : "Désolé, nous n'avons pas d'horaire pour cet arrêt.",
		pasPassage : "Pas de passage dans les prochaines 60 minutes.",
		erreurWS : "", //PROVISOIRE
		//erreurWS : "Suite à un problème technique nous ne sommes pas en mesure d'afficher les horaires.", //PROVISOIRE
		nousContacter : "Si le problème persiste, merci de bien vouloir nous contacter en précisant l'arrêt demandé et le code erreur. @metromobilite",
		emailBody : "Signalement de l'Erreur <%1> avec le code <%2>. Merci de bien vouloir préciser votre arrêt et votre direction : "
	}
}
//Prevent issue from URL param encoding (TAG/SMTC)
var params = urlParams.codeArret;

if (urlParams.codeArret && urlParams.codeArret.charAt(3)=='_') {
	params = urlParams.codeArret.replace("_",":");
}
if (isTaille('xs') || isTaille('xxs')) {

			var os = getMobileOperatingSystem();

			switch(os){
				case('Android'):
					$('#appli').css("display","inline-flex");
					$('#display').css("display","flex");
					$('#head>a span:first').css("display","none");
					$('.svgAndroid').css("display","block");
					$('#appli').attr("href", "https://play.google.com/store/apps/details?id=org.lametro.metromobilite");
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
			/*if (erreur) { //PROVISOIRE
				$('#btnSignal').on('click', function (event) {
						event.preventDefault();
						window.location = 'mailto:contact@metromobilite.fr?subject=erreur au prochain passage: '+ erreur + '&body=' + langLocale.ppa.emailBody.replace("%1",erreur).replace("%2",(!params?"EMPTY":params));
				});
				$('#information').css("height","40%");
				$('#btnSignal').show();
			}*/
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
	
	var searchUrl = url.ws();
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
					id: line.pattern.id,
					arrival:moment((t*1000)+(time.serviceDay*1000)),
					realtime: time.realtime,
					tripid:time.tripId,
					serviceDay:time.serviceDay,
					//"terminus": (time.tripId==''?{name:line.pattern.desc}:false)
					terminus: line.pattern.desc
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
	$('#content').empty();
	if(object.message){
		$('#content').html(("<div class='infoMsg'>"+ object.message +"</div>"));
		$('#glyphiconRefresh').show();
		return;
	}
	if (object.lines.length == 0) {
		$('#content').html(("<div class='infoMsg'>"+ langLocale.ppa.pasPassage +"</div>"));
		$('#glyphiconRefresh').show();
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
		obj.attr('data-linecolor',dataLignesTC[codeLgn].color);
		obj.attr('data-tripid',line.tripid);
		obj.attr('data-serviceday',line.serviceDay);
		obj.attr('data-line',line.id.split(":")[0]+"_"+line.id.split(":")[1]);
		$('#content').append(obj);
	});
	obj = $('<div class="line noborder"><div class="heure nocolor col-xs-12 text-right"><div class="rss"><img  class="logoRss" src="img/rss.svg"/>' + langLocale.ppa.horaireReel + '</div></div></div>');
	$('#content').append(obj);
	
	$('.line').show();
	if(!majLiveMapInterval) {
		setTimeout(function () {if(!majLiveMapInterval) {$('#glyphiconRefresh').show();}}, 10000);
	}
}
function displayArret(object){
	$('#information h3').html(object.info.name.split(", ")[1]);
	$('#information .desc1').html(object.info.name.split(", ")[0]);
	$('#information').attr('data-code',object.info.code);
}
function refresh(){
	$('#content').empty();
	codeList=[];
	$('#glyphiconRefresh').hide();
	//$('#map').css("visibility", "hidden");
	$('#map').hide();
	//$('#content').empty();
	startHARequest(params);
	//setTimeout(allowClick, 1000);
}
function error (param){
	console.log(param)
}
$('#glyphiconRefresh').click(function(e){
	e.preventDefault();
	refresh();
	return false;
});

//--------------------------------------//
// getStylesLiveMap
//--------------------------------------//
function getStylesLiveMap(feature) {

	var typeId = feature.getId();
		
	if (!styleCache['stylePoint_'+typeId]) {
	
		if (typeId == 'ligne') { //Style de la ligne de bus/tram
				styleCache['style_'+typeId] = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: '#'+color,
						width: 5,
						opacity: 1,
						zIndex: 200
					}),
					zIndex: 200
				});
			
		} else if (typeId == 'busPosition') { //Style de la position du bus/tram
				styleCache['style_'+typeId] = new ol.style.Style({
					zIndex: 300,
					image:  new ol.style.Icon({src: 'img/Carto/tc.png',width:'10px', height:'10px' })
				});
		
		} else if (typeId == 'stopsPosition') { //Style de la position de l'arret
				styleCache['style_'+typeId] = new ol.style.Style({
					zIndex: 250,
					image:  new ol.style.Icon({src: 'img/Carto/Vous_etes_ici.png',anchor:[0.5,1]})					
				});		
		} else { //Style de la position de l'arret
				styleCache['style_'+typeId] = new ol.style.Style({
					zIndex: 210,
					image:  imageLgnArret					
				});		
		}
	
	}
	
	return [styleCache['style_'+typeId]] ;
}


function initLiveMap(_this,event){
	if(majLiveMapInterval) {
		refresh();
		$( document ).trigger( "evtLiveMapFermee" );
		return;
	}

	currentTripId = $(_this).parent().attr('data-tripid');
	currentPatternId = $(_this).parent().attr('data-line').split('_').join(':')+':0';
	currentServiceDay = $(_this).parent().attr('data-serviceday');
	currentDest = $(_this).parent().find('.terminus').text();
	color = $(_this).parent().attr('data-linecolor');
	var idcarte = 'map';
	if (!mapLiveMap) {
		//console.log('Création de la carte et de la source');
		mapLiveMap = initMap(idcarte,{overlayStyle:getStylesTypes});
		sourceLiveMap=new ol.source.Vector({projection: "EPSG:3857",format: new ol.format.GeoJSON()});
		var layerLiveMap = ajouteLayerManuel('liveMap',idcarte,{source:sourceLiveMap,fctStyle:function(f){return getStylesLiveMap(f)},color:color}).set('visible',true);
		//ajouteLayerSwitcher(idcarte,'liveMap','.layerSwitcher',{libelle:'TODO'});
	}
	$( document ).trigger( "evtLiveMapOuverte" );
	//updateLiveMap(idcarte,sourceLiveMap);
	
	event.stopPropagation();
}
var majLiveMapInterval;
$( document ).on( "evtLiveMapOuverte", {}, function( event ) {
	if (majLiveMapInterval) window.clearInterval(majPopupInterval);
	updateLiveMap('map',sourceLiveMap);
	majLiveMapInterval = window.setInterval(function() {updateLiveMap('map',sourceLiveMap,true);}, 3000);
});

$( document ).on( "evtLiveMapFermee", {}, function( event ) {
	window.clearInterval(majLiveMapInterval);
	majLiveMapInterval = null;
});
//--------------------------------------//
// updateLiveMap
//--------------------------------------//
function updateLiveMap(idcarte,source,positionOnly) {
	
	try {
		var searchUrl = url.ws();
		//https://data.metromobilite.fr/api/routers/default/index/trips/SEM:1131623/position
		searchUrl += '/api/routers/default/index/trips/SEM:' + currentTripId + '/position';

		$.ajax({
			type: "GET",
			url: searchUrl,
			error: error,
			dataType: 'json'
		}).then(function(data) {
			if (data.pos) {
				
				//position du bus/tram
				var id = 'busPosition'
				var pointBus = ol.proj.transform(data.pos, "EPSG:4326", "EPSG:3857");
				var geomBus = new ol.geom.Point(pointBus);
					
				var featureBus = source.getFeatureById(id);
				if (!featureBus) {
					featureBus = new ol.Feature({'geometry': geomBus});
					featureBus.setId(id);
					source.addFeature(featureBus);
				} else if (geomBus.getCoordinates() != featureBus.get('geometry').getCoordinates()) {
					featureBus.set('geometry',geomBus);
				}

				var idArretCourrant = urlParams.codeArret.replace("_",":");
				var time = {};
				for(var i=0;i<data.times.length;i++){
					var stop = data.stops[i];
					if(stop.id.split(':')[0]+':'+stop.code==idArretCourrant) {
						time=data.times[i];
						break;
					}
				}
				var dep = (time.realtimeDeparture? time.realtimeDeparture : time.scheduledDeparture);
				var t = (dep*1000)+(currentServiceDay*1000);
				var objAffichage={lines:[{
					id: currentPatternId,
					arrival:moment(t) ,
					realtime: time.realtime,
					tripid:time.tripId,
					serviceDay:currentServiceDay,
					terminus: currentDest
				}]};
				if(t < new Date().getTime()) {
					refresh();// le bus est passé
					$( document ).trigger( "evtLiveMapFermee" );
				}

				if (!positionOnly) {
					
					var features=[];
					for(var i=0;i<data.stops.length;i++){
						var stop = data.stops[i];
						var id = (stop.id.split(':')[0]+':'+stop.code==idArretCourrant?'stopsPosition':stop.id);
						var point = ol.proj.transform([stop.lon,stop.lat], "EPSG:4326", "EPSG:3857");
						var geom = new ol.geom.Point(point);
							
						var f = source.getFeatureById(id);
						if (!f) {
							f = new ol.Feature({'geometry': geom});
							f.setId(id);
							features.push(f);
						} else if (geom.getCoordinates() != f.get('geometry').getCoordinates()) {
							f.set('geometry',geom);
						}
					}
					source.addFeatures(features);
									
					//Trace de la ligne
					id = 'ligne';
					var format = new ol.format.Polyline({});
					var coord = format.readGeometry(data.shape,{dataProjection:"EPSG:4326",featureProjection:"EPSG:3857"}).getCoordinates();
					var geom = new ol.geom.LineString(coord);
					
					var feature = source.getFeatureById(id);
					if (!feature) {
						feature = new ol.Feature({'geometry': geom});
						feature.setId(id);
						source.addFeature(feature);
					} else if (geom.getCoordinates() != feature.get('geometry').getCoordinates()) {
						feature.set('geometry',geom);
					}
					
					mapLiveMap.getView().setZoom(15);
					
/*					$('.line').hide();
					$('#glyphiconRefresh').hide();
					$('[data-tripid="' + currentTripId + '"]').show();*/
					//$('#map').css("visibility", "visible");
					$('#map').show();
					mapLiveMap.updateSize();
				}
				$('#glyphiconRefresh').hide();
				mapLiveMap.getView().setCenter(pointBus);
				displayResult(objAffichage);
				$('#content .line .livemap .glyphicon').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
			} else {
				console.error(data.message);
				$( document ).trigger( "evtLiveMapFermee" );//on arrete les refresh
				$('#map').hide();
				displayResult({message:data.message});
			}				
		});
	} catch(e) {
		console.error(e.lineNumber+' : '+e.message);
		$( document ).trigger( "evtLiveMapFermee" );//on arrete les refresh
		$('#map').hide();
		displayResult({message:'Course indéterminée'});
	}
}

trackPiwik("MetroMobilité : ppa.html?codeArret=" + urlParams.codeArret);