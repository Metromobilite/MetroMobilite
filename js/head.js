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

chargeLignes(function(){},updateEvtsTC);

//----------------------------------------------------------------------------
// Methode        : updateIndicesDeplacements()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
function updateIndicesDeplacements() {

	updateIndicesDeplacementsTr();
	updateIndicesDeplacementsTc();

}
//----------------------------------------------------------------------------
// Methode        : updateIndicesDeplacementsTr()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
function updateIndicesDeplacementsTr() {

	try {
		var urlIndicesDeplacementsTr = url.ws();
		urlIndicesDeplacementsTr += '/api/dyn/indiceTr/json';

		function successIndicesDeplacementsTr(response) {
			if (!response["IR1"]) return;
			response = response["IR1"];
			response = response[response.length-1];
			var indice = response.indice;
			updateicone('#iconetrafic path',indice,'Trafic');
			$('#iconetrafic').attr("alt", "Trafic : " + lang.indiceTrafic[indice]);
			$('#iconetrafic title').text("Trafic : " + lang.indiceTrafic[indice]);
			$('#diviconetrafic a').attr("title", "Trafic : " + lang.indiceTrafic[indice]);
			$('#diviconetrafic a').attr("alt", "Trafic : " + lang.indiceTrafic[indice]);
			$('#diviconetrafic').show();
		}
		function errorIndicesDeplacementsTr(response) {}
		
		$.ajax({
			type: "GET",
			url: urlIndicesDeplacementsTr,
			success: successIndicesDeplacementsTr,
			dataType:'json'
		}).error(errorIndicesDeplacementsTr);

	} catch(e) {
		console.error(e.lineNumber+' : '+e.message);
	}
}
//----------------------------------------------------------------------------
// Methode        : updateIndicesDeplacementsTc()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
function updateIndicesDeplacementsTc() {

	try {
		var urlIndicesDeplacementsTc = url.ws();
		urlIndicesDeplacementsTc += '/api/dyn/indiceTc/json';

		function successIndicesDeplacementsTc(response) {
			if (!response["ITC1"]) return;
			response = response["ITC1"];
			response = response[response.length-1];
			var indice = response.indice;
			updateicone('#iconeTC path',indice,'TC');
			//$('#iconeTC').attr("title", "Transport en Commun : " + lang.indiceTC[indice]);
			$('#iconeTC title').text("Transport en Commun : " + lang.indiceTC[indice]);
			$('#iconeTC').attr("alt", "Transport en Commun : " + lang.indiceTC[indice]);
			$('#diviconeTC').show();
		}
		function errorIndicesDeplacementsTc(response) {}
		
		$.ajax({
			type: "GET",
			url: urlIndicesDeplacementsTc,
			success: successIndicesDeplacementsTc,
			dataType:'json'
		}).error(errorIndicesDeplacementsTc);

	} catch(e) {
		console.error(e.lineNumber+' : '+e.message);
	}
}

//----------------------------------------------------------------------------
// Methode        : updateIndicesAtmo()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
function updateIndicesAtmo() {

	try {
		var urlIndicesAtmo = url.ws();
		urlIndicesAtmo += '/api/dyn/indiceAtmoFull/json';
	
		function successIndicesAtmo(response) {
			var dateDuJour = moment().format("YYYY-MM-DD");

			var indice;
			var color;
		    var colorPolice;
		    var qualificatif;

			if (typeof(response.indice_exposition_sensible) == 'undefined') return;
			$.each(response.indice_exposition_sensible, function(i, val) {
				if (val.date==dateDuJour){
					indice = val.valeur;
			     	color = val.couleur_html;
					colorPolice = getContrastYIQ(color);
					qualificatif = val.qualificatif;
				}
			});

			if (typeof(indice)!='undefined' && typeof(color)!='undefined') {
				
				indice = indice.split(",")[0];
				updateicone('#iconeatmo',(indice=='0'?'?':indice),'Atmo',color,colorPolice);

				$('#iconeatmo').attr("title", "Indice atmosphérique : " + qualificatif);
				$('#iconeatmo').attr("alt", "Indice atmosphérique : " + qualificatif);
 				$('#iconeatmo title').text("Indice atmosphérique : " + qualificatif);
				
				$('#diviconeatmo a').popover('destroy');
				if (response.commentaire!="") {
					$('#diviconeatmo a').popover({
							content:'<div class="detailsAtmo"><p>'+response.commentaire.replace(/&lt;br\ \/&gt;/g,'<br>')+'</p></div>',
							title: 'Indice Atmosphérique',
							trigger: 'focus',
							html:true,
							viewport:{ selector: $("body"), padding: 0 },
							container:$("body"),
							delay: { "show": 100, "hide": 100 },
							placement: 'auto'
					}).click(function(e) { /*e.preventDefault();*/ $(this).focus(); return false;}); //pour chrome
				}
				
				$('#diviconeatmo').show();
				
			}
			
		}
		function errorIndicesAtmo(response) {}
		
		$.ajax({
			type: "GET",
			url: urlIndicesAtmo,
			success: successIndicesAtmo,
			dataType : 'json'
			//async:  false,
		}).error(errorIndicesAtmo);

	} catch(e) {
		console.error(e.lineNumber+' : '+e.message);
	}
}
//----------------------------------------------------------------------------
// Methode        : updateMeteo()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
function updateMeteo() {

	try {
	
		var urlMeteo = url.ws();
		urlMeteo += '/api/dyn/meteo/json';
		var urlIconMeteo = url.ws();
		urlIconMeteo += '/api/icon/image?name=';
		
	
		//var urlMeteo = url.urlMeteo;

		function successMeteo(response) {
			
			if (response.fcst_day_0) {
				$('#divtemperaturemeteo span').text(response.fcst_day_0.tmin + "°/" + response.fcst_day_0.tmax + "°");
				$('#divtemperaturemeteo').css( "color", "yellow" );
				$('#divtemperaturemeteo').attr("title", response.fcst_day_0.condition);
				$('#divtemperaturemeteo').attr("alt", response.fcst_day_0.condition);
				
				$('#diviconemeteo a img').attr("src", urlIconMeteo + response.fcst_day_0.icon);//https://data.metromobilite.fr/api/icon/image?name=faibles-passages-nuageux.png
				$('#diviconemeteo img').attr("title", "http://www.prevision-meteo.ch");
				$('#diviconemeteo img').attr("alt", response.fcst_day_0.condition);
				
				
				$('#diviconemeteo a').popover('destroy');
				$('#diviconemeteo a').popover({
						content:'<div class="detailsMeteo"><p>'+response.fcst_day_0.condition+'</p></div>',
						title: '<div id="diviconemeteoTitle"><a href="http://www.prevision-meteo.ch/meteo/localite/grenoble" target="_blank">http://www.prevision-meteo.ch</a><div>',
						trigger: 'focus',
						html:true,
						viewport:{ selector: $("body"), padding: 0 },
						delay: { "show": 100, "hide": 100 },
						placement: 'auto'
				}).click(function(e) { e.preventDefault(); $(this).focus();}); //pour chrome
				$('#diviconemeteo a svg').remove();

				$('#diviconemeteo').show();
			}			
		}
		function errorMeteo(response) {
			$('#divtemperaturemeteo').hide();
			$('#diviconemeteo').hide();
			}
	
		$.ajax({
			url: urlMeteo,
			success: successMeteo,
			//async:  false,
			dataType : 'json',
			statusCode: {
				404: function(xhr, ajaxOptions, thrownError) {
					console.info('Meteo xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + 'thrownError : '+thrownError);
				}}
		}).error(errorMeteo);

	} catch(e) {
		console.error(e.lineNumber+' : '+e.message);
	}
}

//----------------------------------------------------------------------------
// Methode        : updateicone()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
function updateicone(icone,value,type,color,colorFont) {
	if (type=='Trafic') {
		if (value == 1) { $(icone).css('fill','#5bb224');}//Vert
		else if (value == 2) { $(icone).css('fill','#ffa500');}//Orange
		else if (value == 3) { $(icone).css('fill','#ff0000');}//Rouge
		else if (value == 4) { $(icone).css('fill','#000');}//Noir
		else {$(icone).css('fill','#a9a9a9');}//Gris
	}else if (type=='TC') {
		if (value == 1) { $(icone).css('fill','#5bb224');}//Vert
		else if (value == 2) { $(icone).css('fill','#ffa500');}//Orange
		else if (value == 3) { $(icone).css('fill','#ff0000');}//Rouge
		else if (value == 4) { $(icone).css('fill','#0000ff');}//Bleu
		else if (value == 5) { $(icone).css('fill','#000');}//Noir
		else {$(icone).css('fill','#a9a9a9');}//Gris
	} else if (type=='Atmo') {
		$(icone + ' path').css('fill',color);
		$(icone + ' text').css('fill',colorFont);
		$(icone + ' text').text(value);		
	}	
}
//----------------------------------------------------------------------------
// Methode        : updateEvtsTC()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//----------------------------------------------------------------------------
function updateEvtsTC(data) {
	try {
		if (data) {
			dataLignesTC = data;
		}
		
		//var urlSearch = url.json('dEvenementsTC');
		var urlSearch = url.ws();
		urlSearch += '/api/dyn/evtTC/json';

		function successEvtsTC(response) {

			var lignesNow = $('<div>');
			var codeListe = {};
			$('.evtsTC :nth-child(n+3)').remove();
			var listevtSEM = "";
			var listevtC38 = "";
			var listevtSNC = "";
			for (var codeEvt in response) {
				var code = response[codeEvt].listeLigneArret;
				/*if(code.substr(0,7)=='SNC_SNC') {
					code='SNC_'+code.substr(7);
				}*/
				var loc=response[codeEvt].texte.split('|')[0];
				var ddeb = moment(response[codeEvt].dateDebut,'DD/MM/YYYY HH:mm');
				var dfin = moment(response[codeEvt].dateFin,'DD/MM/YYYY HH:mm');
				if (!dataEvtsTC[code]) dataEvtsTC[code]={};
				if (!dataEvtsTC[code][codeEvt]) dataEvtsTC[code][codeEvt]={};
				dataEvtsTC[code][codeEvt].loc=loc;
				dataEvtsTC[code][codeEvt].ddeb=ddeb;
				dataEvtsTC[code][codeEvt].dfin=dfin;
				dataEvtsTC[code][codeEvt].hdeb=response[codeEvt].heureDebut;
				dataEvtsTC[code][codeEvt].hfin=response[codeEvt].heureFin;
				dataEvtsTC[code][codeEvt].we=response[codeEvt].weekEnd;
				dataEvtsTC[code][codeEvt].comment=urlify(response[codeEvt].texte.replace(/\|/g,'<br>'));
				if (dataLignesTC[code]) {
					var l = getLogoLgn(code,dataLignesTC[code].routeShortName,'#'+dataLignesTC[code].routeColor,false,'logoLgn','logoLgnRect');
					l.find('title').text(loc);
					//l.attr('data-code',code);
					var logo = $('<div>').append(l).html();
					var now  = moment(urlParams.heure).hour(0).minute(1);
					var dateOkDebut = now.isAfter(ddeb.hour(0).minute(0)) && now.isBefore(dfin.hour(23).minute(59));
					var dateOkFin = now.isAfter(ddeb.hour(0).minute(0)) && now.isBefore(dfin.hour(23).minute(59));
					var dateOkToday = ddeb.hour(0).minute(0).isBefore(urlParams.heure) && dfin.hour(23).minute(59).isAfter(urlParams.heure);
					if (isEvenementEnCours(ddeb,dfin)) { 
						if (!codeListe[code]) {
							lignesNow.append(l);
							codeListe[code]= loc;
						} else {
							codeListe[code]+= '\n' + loc;
							lignesNow.find('svg[data-code='+code+'] title').html(codeListe[code]);
						}
					}
					if(urlParams.page=='Evts' && (isEvenementEnCours(ddeb,dfin))) {
						
						if (code.substr(0,3) == 'SEM') {
							listevtSEM += '<div data-code="'+code+'"><h4 class="anchor" id="'+code+'">'+logo+'&nbsp'+response[codeEvt].texte.split('|')[0].split(':')[1]+'</h4>';
							listevtSEM += '<p>'+urlify(response[codeEvt].texte.replace(loc,'').replace(/\|/g,'<br>'))+'</p>';
							listevtSEM += '<a class="evtLoc" href="planTC.html?id=' + code + '"><span class="glyphicon glyphicon-screenshot"></span> ' + lang.localisationEvenement + '</a><br></div>';
						}
						
						if (code.substr(0,3) == 'C38') {
							listevtC38 += '<div data-code="'+code+'"><h4 class="anchor" id="'+code+'">'+logo+'&nbsp'+response[codeEvt].texte.split('|')[0].split(':')[1]+'</h4>';
							listevtC38 += '<p>'+urlify(response[codeEvt].texte.replace(loc,'').replace(/\|/g,'<br>'))+'</p>';
							listevtC38 += '<a class="evtLoc" href="planTC.html?id=' + code + '"><span class="glyphicon glyphicon-screenshot"></span> ' + lang.localisationEvenement + '</a><br></div>';
						}
						
						
						if (code.substr(0,3) == 'SNC') {
							listevtSNC += '<div data-code="'+code+'"><h4 class="anchor" id="'+code+'">'+logo+'&nbsp'+response[codeEvt].texte.split('|')[0].split(':')[1]+'</h4>';
							listevtSNC += '<p>'+urlify(response[codeEvt].texte.replace(loc,'').replace(/\|/g,'<br>'))+'</p>';
							//listevtSNC += '<a class="evtLoc" href="planTC.html?id=' + code + '"><span class="glyphicon glyphicon-screenshot"></span> ' + lang.localisationEvenement + '</a><br></div>';
						}
						
						codeListe[code.substr(0,3)]=true; //pour l'ajout de message 'aucune pertrubation
					}
				}
			}
			//tri des icones de la popup
			tri(lignesNow,'svg','','data-code');

			$('#diviconeTC a').popover('destroy');
			$('#diviconeTC a').popover({
					content:'<div class="detailsTC"><div>'+lignesNow.html()+'</div><br><div><a href="index.html?page=Evts">Toutes les perturbations</a></div></div>',
					trigger: 'focus',
					html:true,
					viewport:{ selector: $("body"), padding: 0 },
					delay: { "show": 100, "hide": 100 },
					placement: 'auto'
			}).click(function(e) {e.preventDefault(); $(this).focus();}); //pour chrome
			
			$('#diviconeTC').on('click','div',function(e){
				window.location='index.html?page=Evts';
			});
			
			if(urlParams.page=='Evts') {
				
				//tri de la listes des évènements.
				listevtSEM = $(listevtSEM).sort(function(a,b){
					return compareCodeLigne($(a).attr('data-code'),$(b).attr('data-code'));
				})
				listevtC38 = $(listevtC38).sort(function(a,b){
					return compareCodeLigne($(a).attr('data-code'),$(b).attr('data-code'));
				})
				listevtSNC = $(listevtSNC).sort(function(a,b){
					return compareCodeLigne($(a).attr('data-code'),$(b).attr('data-code'));
				})
				var appendText = '<p><br/>'+lang.aucunePerturbation_full+'</p>';
				if (!codeListe['SEM'])
					$('#SEM').append(appendText);
				else 
					$('#SEM').append(listevtSEM);
				if (!codeListe['C38'])
					$('#C38').append(appendText);
				else
					$('#C38').append(listevtC38);
				if (!codeListe['SNC']) {
					appendText = 'Toutes les perturbations sur : ';
					appendText += '<a href="https://www.ter.sncf.com/auvergne-rhone-alpes" target="_blank">www.ter.sncf.com/auvergne-rhone-alpes</a>';
					$('#SNC').append(appendText);
				} else
					$('#SNC').append(listevtSNC);
			}
		}
		
		$.ajax({
			type: "GET",
			url: urlSearch,
			success: successEvtsTC,
			dataType:'json'
		}).error(function(response) {});

	} catch(e) {
		console.error(e.lineNumber+' : '+e.message);
	}
}


//----------------------------------------------------------------------------
// Methode        : rechercheSurSite()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//----------------------------------------------------------------------------
function rechercheSurSite() {
if ($('#Rechercher').val() !="")
	window.open('https://www.google.com/search?q=site%3Awww.metromobilite.fr+' + $('#Rechercher').val() + '&gws_rd=ssl'); //version minimale
}