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

var reseauCourant = 'TRAM';
var sourceDepArr;
var layerDepArr,layerPoteaux;
var dataStatArrLight;

if (urlParams.iFrame){
	$(".main").attr('style','top:0px');
	$.support.cors = true;
	initPlanTC();
} else {
	$('#head').load('head.html',initPlanTC);
}

// +----------------------------------------------------------------------------
// | Methode        : initPlanTC
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------
function initPlanTC() {
		initMap('map');
		ajouteControle('map','layerSwitcher');

		ajouteLayerLgn('lignes_C38','C38','map',onFinChargement).set('visible',false);
		ajouteLayerLgn('lignes_SNC','SNC','map').set('visible',false);
		ajouteLayerLgn('lignes_PROXIMO','PROXIMO','map').set('visible',false);
		ajouteLayerLgn('lignes_FLEXO','FLEXO','map').set('visible',false);
		ajouteLayerLgn('lignes_CHRONO','CHRONO','map');
		ajouteLayerLgn('lignes_TRAM','TRAM','map');
		ajouteLayerSwitcher('map','lignes_TRAM','.layerSwitcher',{libelle:'Réseau Tag : Tram'});
		ajouteLayerSwitcher('map','lignes_CHRONO','.layerSwitcher',{libelle:'Réseau Tag : Chrono'});
		ajouteLayerSwitcher('map','lignes_PROXIMO','.layerSwitcher',{libelle:'Réseau Tag : Proximo'});
		ajouteLayerSwitcher('map','lignes_FLEXO','.layerSwitcher',{libelle:'Réseau Tag : Flexo'});
		ajouteLayerSwitcher('map','lignes_C38','.layerSwitcher',{libelle:'Réseau Transisère'});
		ajouteLayerSwitcher('map','lignes_SNC','.layerSwitcher',{libelle:'Réseau SNCF'});
		
		if (urlParams.lonlatDep!='0,0')  {
			if(isTaille('xs')) togglePanneau();
			getMap('map').getView().setCenter(ol.proj.transform([parseFloat(urlParams.lonlatDep.split(',')[1]), parseFloat(urlParams.lonlatDep.split(',')[0])], "EPSG:4326", "EPSG:3857"));
			var zoom = 16;
			if(urlParams.codeArr) zoom = 18;
			getMap('map').getView().setZoom(zoom);
						
			// TODO essayer de déclancher un evt singleclick ol3 avec une lati longi...
			
			
		}
		$.getJSON(url.json('arr'), function (res) {
		dataStatArrLight = res;
		if (typeof(finChargementArrLight) != "undefined") {
			finChargementArrLight(dataStatArrLight);
			}
		});
		layerDepArr = ajouteLayerManuel('depArr','map',{source:sourceDepArr,fctStyle:getStylesDepArr});
		$('#popup').on('click','.arret',function() {clickArret();});
		$('#popup').on('click','.dep',function() {clickDepArr('dep');});
		$('#popup').on('click','.arr',function() {clickDepArr('arr');});
		$('#popup').on('click','.PopupDetailsLayerLgn',function(event){
			selectLgnDOM('map',false,$(this).attr('data-id'), false,'#liste .ligneSelected',sourceLgn);
		});
		layerPoteaux = ajoutePointsArretOTP('map','poteaux');
		if(urlParams.codeArr) {
				//on attend la fin du chargement des poteaux
				var idEvt =null;
				idEvt = layerPoteaux.getSource().on('change', function() {
					if (layerPoteaux.getSource().getFeatures().length!=0) {
						switch (layerPoteaux.getSource().getState()) {
							case 'ready':
								//layerPoteaux.getSource().unByKey(idEvt); Migration OL4
								ol.Observable.unByKey(idEvt);
								var f = layerPoteaux.getSource().getFeatureById(urlParams.codeArr);
								if(f) showPopupDetails(getMap('map'),null,f);
								break;
							case 'error':
								//layerPoteaux.getSource().unByKey(idEvt); Migration OL4
								ol.Observable.unByKey(idEvt);
								window.console.log('source loaded error');
								break;
						}
					}
				});
			//});
		}
		if (urlParams.iFrame) {
			$('#listeLignes').css('bottom','92px');
			$('#pub').show();
			$( "#pub > div" ).text(lang.pub.text);
		}

}

// +----------------------------------------------------------------------------
// | Methode        : finChargementArrLight
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------
function finChargementArrLight(data) {
	ajouteZoneArretLight('map','arret').set('selectedLayer',true);
	trackPiwik("MetroMobilité : planTC.html");
}

// +----------------------------------------------------------------------------
// | Methode        : fctSaisieReussie
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------
function fctSaisieReussie(idInput,item) {
	var selected = $('#liste .ligneSelected');
	if (selected.length>0) {
			unSelectAll('map');
		}
			
	getMap('map').getView().setCenter(ol.proj.transform([item.lon, item.lat], "EPSG:4326", "EPSG:3857"));
			
	if (item.type == 'ARRET') {
		getMap('map').getView().setZoom(15);
		var select = getSelect('map');
		select.getFeatures().push(sourceArretLight.listeFeatures[item.code]); //error ici a cooriger sourceArretLight undefined
		
		//getLignesProches(item.lat+','+item.lon,selectGetFeatures,item.code);
		
		
	} else {
		placeSearch(''+item.lat+','+item.lon);
		getMap('map').getView().setZoom(15);
	}
	if(isTaille('xs')) togglePanneau();
	return true;
}

/*function selectGetFeatures(lignes,code) {
	var select = getSelect('map');
	select.getFeatures().push(lignes);
}*/

ajouteAutocomplete('#inputSearch',{
	arrets:true,
	lieux:true,
	rues:true,
	fnSaisieReussie:function(item){ return fctSaisieReussie('#inputSearch',item)},
	fnSaisieRatee:function(item){ 
		urlParams.lonlatDep='0,0'; 
		$('#inputSearch').attr('data-lonlat','0,0');
	}
});

$('#liste').toggle();
$('#menu').addClass('listeAffichee');

$('.toggleListe').click(function(){
	togglePanneau();
});

// +----------------------------------------------------------------------------
// | Methode        : togglePanneau
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------
function togglePanneau() {
	if(!$('#liste').is(':visible')) {
		$('.toggleListe').addClass('listeAffichee');
		//$(this).addClass('active');
	} else {
		$('.toggleListe').removeClass('listeAffichee');
		//$(this).removeClass('active');
	}
	$('#liste').toggle();
	//if (isMobile) {selectLgnDOM('map','lignes',null, null,'#liste .ligneSelected');}
}

// +----------------------------------------------------------------------------
// | Methode        : click
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------
$('#unselect').click(function(){
	unSelectAll('map');
});

// +----------------------------------------------------------------------------
// | Methode        : getLiLgn
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------
function getLiLgn(obj,nomLayer) {
	var modele = $('#modele > ul > a');
	var li = modele.clone();
	li.addClass(nomLayer.replace(' ','_'));
	var code = obj.get('CODE');
	var color = obj.get('COULEUR');
	var numero = obj.get('NUMERO');
	var libelle = obj.get('LIBELLE');
	var typeLayer = nomLayer.substr('lignes_'.length);
	var type = obj.get('TYPE');
	if (type != typeLayer || !color) return null;
	li.attr('id',code).attr('title',numero+' - '+libelle); //pour Chrome
	var logo = getLogoLgn(code,numero,color,0,'logo','logoRect');
	$(logo).find('title').text(numero+' - '+libelle); //pour vieux Firefox
	li.append(logo);

	return li;
}

// +----------------------------------------------------------------------------
// | Methode        : selectLgnDOM
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------		
function selectLgnDOM(idcarte,nomlayer,idFeature,deSelectAutres,classeSelected,source) {
	if (!source) {
		var layer = getLayer(idcarte,nomlayer);
		source = layer.getSource();
	}
	
	var ajout=true;
	var select = getSelect(idcarte);
	var selectionvide = select.getFeatures().getArray().length==0;
	select.getFeatures().getArray().filter(function( obj ) {
	//on deselectionne les arret selectionnés
	if(!obj.get('NUMERO'))
	select.getFeatures().remove(obj);
	//si la ligne est deja selectionnée on la deselectionne
	if(idFeature==obj.get('CODE')) {
	ajout = false;
	select.getFeatures().remove(obj);
	}
	return false;
	});
	if (ajout) {
	select.getFeatures().push(source.listeFeatures[idFeature]);
	}
	getMap(idcarte).render();
	if (selectionvide && isTaille('xs')) { togglePanneau(); }
}

// +----------------------------------------------------------------------------
// | Methode        : onFinChargement
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------
function onFinChargement() {
	var lignes = getLayer('map','lignes_TRAM').getSource().getFeatures();
	if (!lignes || lignes.length==0) return;
	ajouteListeFeature('#liste .TRAM','lignes','ligneSelected','lignes_TRAM','map',false,selectLgnDOM, getLiLgn);
	ajouteListeFeature('#liste .CHRONO','lignes','ligneSelected','lignes_CHRONO','map',false,selectLgnDOM, getLiLgn);
	ajouteListeFeature('#liste .PROXIMO','lignes','ligneSelected','lignes_PROXIMO','map',false,selectLgnDOM, getLiLgn);
	ajouteListeFeature('#liste .FLEXO','lignes','ligneSelected','lignes_FLEXO','map',false,selectLgnDOM, getLiLgn);
	ajouteListeFeature('#liste .C38','lignes','ligneSelected','lignes_C38','map',false,selectLgnDOM, getLiLgn);
	
	tri('#liste .TRAM','a','','id');
	tri('#liste .CHRONO','a','','id');
	tri('#liste .PROXIMO','a','','id');
	tri('#liste .FLEXO','a','','id');
	tri('#liste .C38','a','','id');
	
	if(urlParams.id) {
		var f = sourceLgn.listeFeatures[urlParams.id];
		var map =getMap('map');
		if(f) {
			map.getView().fitExtent(f.getGeometry().getExtent(),map.getSize());
			var select = getSelect('map');
			select.getFeatures().push(f);
		}
		//.setCenter(f.getGeometry().getCoordinates());
	}
}

// +----------------------------------------------------------------------------
// | Methode        : getDetailZA
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------
function getDetailZA(feature) {
	var pop = $('#popupZA').clone();
	pop.find('.nom').text(feature.get('LIBELLE_ZONE'));
	var lignes={};
	var coord= ol.proj.transform(feature.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");
	var lonlat = coord[1]+','+coord[0];
	
	var bSEM = false;
	//ici on utilise pas getId car pour loverlay l'id n'est pas le meme
	pop.find(".icones").attr('data-featureId',feature.get('id'));
	pop.find(".icones").attr('data-featureLayer','arret');
	
	getLignesProches(lonlat,afficheListeLgnZA,feature,feature.get('LIBELLE_ZONE'));
		
	return pop.html();
}

// +----------------------------------------------------------------------------
// | Methode        : afficheListeLgnZA
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------
function afficheListeLgnZA(lignes,feature,stops) {

	var pop = $('#popup');
	var lignemodele = pop.find('.ligne').remove();
	var bSEM = false;
	var bExisteSEM = false;
	
	for (var l in lignes) {
		bSEM = (lignes[l].substr(0,3)=='SEM');
		var maligne = lignemodele.clone();
		maligne.addClass(lignes[l]);
		maligne.attr('data-code',lignes[l]);
		maligne.find('.logoLigne').append($('#'+lignes[l]).clone());
		var f = sourceLgn.getFeatureById(lignes[l]);
		if(f) {
			maligne.find('.dir1 .libDir').text(f.get('LIBELLE').split('/')[0]);
			maligne.find('.dir2 .libDir').text(f.get('LIBELLE').split('/')[1]);
		} else {
			// la ligne n'est pas tracée
			continue;
		}
		maligne.find('.dir1 a').attr('href','horaires.html?codeLigne='+lignes[l]);
		maligne.find('.dir2 a').attr('href','horaires.html?codeLigne='+lignes[l]);
		
		pop.find('.passages').append(maligne);
		for (var e in dataEvtsTC[lignes[l]]) {
			maligne.find('.evt').append('<span class="glyphicon glyphicon-warning-sign"></span><a href="index.html?page=Evts#'+e+'"> '+dataEvtsTC[lignes[l]][e].loc+'</a><br>');
		}
		bExisteSEM = bSEM || bExisteSEM;
	}
	var coord = ol.proj.transform(feature.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");
	if(bExisteSEM) {
		var ids='';
		var resultat=false;
		if(bIdHastus) {
			for (var s in stops) {
				if(s.substr(0,3)=='SEM')
					ids = ids + s.substr(4)+ '|';
			}
			if (ids.length > 0) ids = ids.slice(0, -1);
		} else {
			resultat = {lignes:{}};
			for (var s in stops) {
				if(s.substr(0,3)=='SEM')
					resultat[s.substr(4)]={name:stops[s].stopName};
			}
		}
		
		getProchainsPassagesCarte(ids,function(res){
			var tabLignes = res.lignes;
			for (var li in tabLignes) {
				var dir = tabLignes[li].direction['1'];
				if(dir) {
					pop.find('.passages > .'+ li + ' .dir1 .libDir').text(tabLignes[li].direction['1'].dirName);
					pop.find('.passages > .'+ li + ' .dir1 .delai span:nth-of-type(1)').text(formatHorairesReels(dir.delai[0])+(dir.theorique[0]?'*':''));
					pop.find('.passages > .'+ li + ' .dir1 .delai span:nth-of-type(2)').text(formatHorairesReels(dir.delai[1])+(dir.theorique[1]?'*':''));
				}
				if(tabLignes[li].direction['2']) {
					var dir = tabLignes[li].direction['2'];
					pop.find('.passages > .'+ li + ' .dir2 .libDir').text(tabLignes[li].direction['2'].dirName);
					pop.find('.passages > .'+ li + ' .dir2 .delai span:nth-of-type(1)').text(formatHorairesReels(dir.delai[0])+(dir.theorique[0]?'*':''));
					pop.find('.passages > .'+ li + ' .dir2 .delai span:nth-of-type(2)').text(formatHorairesReels(dir.delai[1])+(dir.theorique[1]?'*':''));
				}
			}
		},resultat);//,150);
	}
	tri($('#popup .passages'),'.ligne','','data-code');
}



// +----------------------------------------------------------------------------
// | Methode        : getDetailPA
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------
function getDetailPA(feature) {
	var pop = $('#popupZA').clone();
	pop.find('.nom').text(feature.get('LIBELLE'));
	var lignemodele = pop.find('.ligne').remove();
	var lignes = feature.get('LIGNES');
	var bSEM = false;
	
	pop.find(".icones").attr('data-featureId',feature.getId());
	pop.find(".icones").attr('data-featureLayer','poteaux');
				
	for (var l in lignes) {
		var maligne = lignemodele.clone();
		var id = lignes[l].id;
		maligne.addClass(id);
		maligne.attr('data-code',id);
		maligne.find('.logoLigne').append($('#'+id).clone());
		var f = sourceLgn.getFeatureById(id);
		if(f) {
			maligne.find('.dir1 .libDir').text(f.get('LIBELLE'));
			//maligne.find('.dir1 .libDir').text(f.get('LIBELLE').split('/')[0]);
			//maligne.find('.dir2 .libDir').text(f.get('LIBELLE').split('/')[1]);
		} else {
			continue;
		}
		maligne.find('.dir1 a').attr('href','horaires.html?codeLigne='+id);
		maligne.find('.dir2 a').attr('href','horaires.html?codeLigne='+id);
		
		pop.find('.passages').append(maligne);
		for (var e in dataEvtsTC[id]) {
			maligne.find('.evt').append('<span class="glyphicon glyphicon-warning-sign"></span><a href="index.html?page=Evts#'+e+'"> '+dataEvtsTC[lignes[l].id][e].loc+'</a>');
		}
		bSEM = (lignes[l].id.substr(0,3)=='SEM') || bSEM;
	}

	var coord = ol.proj.transform(feature.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");
	if(bSEM) {
		
		var ids='';
		var resultat=false;
		if(bIdHastus) {
			ids=feature.get('id').substr(4);
		} else {
			resultat = {lignes:{}};
			resultat[feature.get('id').substr(4)]={name:feature.get('LIBELLE')};
		}
		
		getProchainsPassagesCarte(ids,function(res){
			var pop = $('#popup');
			var tabLignes = res.lignes;
			for (var li in tabLignes) {
				var dir = tabLignes[li].direction['1'];
				var domdir = pop.find('.passages > .'+ li + ' .dir1');
				if(dir) {
					domdir.find('.libDir').text(dir.dirName);
					domdir.find('.delai span:nth-of-type(1)').text(formatHorairesReels(dir.delai[0])+(dir.theorique[0]?'*':''));
					domdir.find('.delai span:nth-of-type(2)').text(formatHorairesReels(dir.delai[1])+(dir.theorique[1]?'*':''));
					domdir = pop.find('.passages > .'+ li + ' .dir2');
				} else {
					domdir = pop.find('.passages > .'+ li + ' .dir1');
				}
				dir = tabLignes[li].direction['2'];
				if(dir) {
					domdir.find('.libDir').text(dir.dirName);
					domdir.find('.delai span:nth-of-type(1)').text(formatHorairesReels(dir.delai[0])+(dir.theorique[0]?'*':''));
					domdir.find('.delai span:nth-of-type(2)').text(formatHorairesReels(dir.delai[1])+(dir.theorique[1]?'*':''));
				}
			}
			for (var l in lignes) {
				// on reduit la 2e direction
				if (pop.find('.passages > .'+ lignes[l].id + ' .dir2 .libDir').text()=='') {
					pop.find('.passages > .'+ lignes[l].id + ' .dir2 *').hide();
					pop.find('.passages > .'+ lignes[l].id + ' .dir2').css('height','4px');
					pop.find('.passages > .'+ lignes[l].id + ' .logoLigne').css('height','34px');
				}
			}
		},resultat);
	}
	tri(pop.find('.passages'),'.ligne','','data-code');
	
	for (var l in lignes) {
		// on reduit la 2e direction
		if (pop.find('.passages > .'+ lignes[l].id + ' .dir2 .libDir').text()=='') {
			pop.find('.passages > .'+ lignes[l].id + ' .dir2 *').hide();
			pop.find('.passages > .'+ lignes[l].id + ' .dir2').css('height','4px');
			pop.find('.passages > .'+ lignes[l].id + ' .logoLigne').css('height','34px');
		}
	}
	return pop.html();
}

// +----------------------------------------------------------------------------
// | Methode        : clickDepArr
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------
function clickDepArr(depOuArr) {
	
	var featureLayer = getLayer('map',$('#popup .icones').attr('data-featureLayer'));

	var featureId = $('#popup .icones').attr('data-featureId');
	var feature = featureLayer.getSource().getFeatureById(featureId);
	
	var layerDepArrPrec = layerDepArr.getSource().getFeatureById(depOuArr);
	if (layerDepArrPrec)
		layerDepArr.getSource().removeFeature(layerDepArrPrec);
	
	var fe = new ol.Feature({
		'geometry': feature.getGeometry(),
		'typeDep':depOuArr,
		'libelle': feature.get('LIBELLE_ZONE')
	});
	
	var map =getMap('map');
	
	fe.setId(depOuArr);
	layerDepArr.getSource().addFeature(fe);
	
	
	//si depart ou arrivée -> rootage vers iti
	var featureDep = layerDepArr.getSource().getFeatureById('dep');
	var featureArr = layerDepArr.getSource().getFeatureById('arr');
	
	var libelle = feature.get('LIBELLE_ZONE');
	
	if (!libelle)
		libelle = feature.get('LIBELLE');
	
	if (featureDep && depOuArr == 'dep')
	{
		var loc = 'iti.html'
		var coordDep = ol.proj.transform(featureDep.getGeometry().getCoordinates(),"EPSG:3857" , "EPSG:4326");
		loc += '?dep=' + libelle;
		loc += '&lonlatDep=' + coordDep[1] + ',' +coordDep[0];

		if (urlParams.otp!='prod') loc+="&otp="+urlParams.otp;
		if(urlParams.debug) loc+="&debug=true";

		window.open(loc);
	} else if (featureArr)
	{
		var loc = 'iti.html'
		var coordArr = ol.proj.transform(featureArr.getGeometry().getCoordinates(),"EPSG:3857" , "EPSG:4326");
		loc += '?arr=' + libelle;
		loc += '&lonlatArr=' + coordArr[1] + ',' +coordArr[0];

		if (urlParams.otp!='prod') loc+="&otp="+urlParams.otp;
		if(urlParams.debug) loc+="&debug=true";

		window.open(loc);
	}
}

// +----------------------------------------------------------------------------
// | Methode        : clickDepArr
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------
function clickArret() {

	var featureLayer = getLayer('map',$('#popup .icones').attr('data-featureLayer'));
	var featureId = $('#popup .icones').attr('data-featureId');
	var feature = featureLayer.getSource().getFeatureById(featureId);
	var libelle = feature.get('LIBELLE_ZONE');
	var view = getMap('map').getView();

	if (libelle) {//Zone d'arret : zoom
		view.setZoom(view.getZoom() + 2);
	}
	view.setCenter(feature.getGeometry().getCoordinates());
} 
// +----------------------------------------------------------------------------
// | Methode        : placeSearch
// | Description    : 
// | Paramètres     : 
// | Valeur retour  : 
// +----------------------------------------------------------------------------
function placeSearch(lonlat) {
	var f = layerDepArr.getSource().getFeatureById('search');
	var geom = new ol.geom.Point(ol.proj.transform([parseFloat(lonlat.split(',')[1]), parseFloat(lonlat.split(',')[0])],"EPSG:4326" , "EPSG:3857"));
	if (!f) {
		var fe = new ol.Feature({
			'geometry': geom,
			'typeDep':'search'
		});
		
		fe.setId('search');
		layerDepArr.getSource().addFeature(fe);
	} else {
		f.setGeometry(geom);
	}
}