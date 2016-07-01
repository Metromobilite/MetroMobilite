﻿// *
// Metromobilité is the mobile application of Grenoble Alpes Métropole <http://www.metromobilite.fr/>.
// It provides all the information and services for your travels in Grenoble agglomeration.
// Available for Android, iOs, Windows Phone, it's been developed on Cordova https://cordova.apache.org/.

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

//--------------------------------------//
// globals
//--------------------------------------//
var gg = "EPSG:4326";
var sm = "EPSG:3857";
var maps = [];
var sourceLgn;
var sourcePoints;
var sourceTrr;
var sourceEvt;
var sourceArretLight;
var sourcePkg;
var sourceCov;
//var sourceOmms;
var evtCache = [];
var filtreLgn = null;
var VERT = '#66CC33';
var ORANGE = '#FF6600';
var ROUGE = '#ff0000';
var styleCache = [];
var listesAMettreAJour = [];
var dateAffichee = urlParams.heure;
var majPopupInterval;
var filtreTypeEvt = 'type';
var filtreCodeEvt = 'code';

var iconeaccident = {src: 'img/Carto/images_evt/p_accident.png',anchor:[0.5,1] };
var iconebouchon = {src: 'img/Carto/images_evt/p_bouchon.png',anchor:[0.5,1] };
var iconechantier = {src: 'img/Carto/images_evt/p_chantier.png',anchor:[0.5,1] };
var iconemanifestation = {src: 'img/Carto/images_evt/p_manifestation.png',anchor:[0.5,1] };
var iconeobstacle = {src: 'img/Carto/images_evt/p_obstacle.png',anchor:[0.5,1] };
var iconerestriction = {src: 'img/Carto/images_evt/p_restriction.png',anchor:[0.5,1] };
var iconepanne = {src: 'img/Carto/images_evt/p_panne.png',anchor:[0.5,1] };
var iconePME = new ol.style.Icon({src: 'img/Carto/images_evt/PME.png' });
var iconePKG = {src: 'img/Carto/p_Park.png',anchor:[0.5,1]};
var iconePAR = {src: 'img/Carto/p_PR_0.png',anchor:[0.5,1]};
var iconeMVA = {src: 'img/Carto/p_MV_Agence.png',anchor:[0.5,1]};
var iconeMVC = {src: 'img/Carto/p_MV_Consigne.png',anchor:[0.5,1]};
var iconebus = new ol.style.Icon({src: 'img/Carto/tc.png',anchor:[0.5,-0.5], width:'10px', height:'10px' });
var iconebulle = new ol.style.Icon({src: 'img/Carto/bulle.png',anchor:[0.5,-0.5], width:'10px', height:'10px' });
var iconevelo = new ol.style.Icon({src: 'img/Carto/velo.png',anchor:[0.5,-0.5], width:'10px', height:'10px'});
var iconepieton = new ol.style.Icon({src: 'img/Carto/pieton.png',anchor:[0.5,-0.5], width:'10px', height:'10px'});
var iconeiroad = new ol.style.Icon({src: 'img/Carto/iroad.png',anchor:[0.5,-0.5], width:'10px', height:'10px'});
var iconevoiture = new ol.style.Icon({src: 'img/Carto/voiture.png',anchor:[0.5,-0.5], width:'10px', height:'10px'});
var iconePMV = {src: 'img/Carto/PMV.png',scale:1,anchor:[0.5,1] };
var iconeCAM = {src: 'img/Carto/CAM_1.png',scale:1,anchor:[0.5,1] };
var iconecitelibbyhamo = {src: 'img/p_citelibbyhamo.png',scale:1,anchor:[0.5,1]};
var iconecitelib = {src: 'img/p_citelib.png',scale:1,anchor:[0.5,1]};
var iconeDepositaires = {src: 'img/Carto/p_relaisTAG.png',anchor:[0.5,1] };
var iconeDat = {src: 'img/Carto/p_Dat.png',anchor:[0.5,1] };
var iconeAgenceMM = {src: 'img/Carto/p_agenceMM.png',anchor:[0.5,1] };
var iconePointService = {src: 'img/Carto/p_pointservice.png',anchor:[0.5,1] };
var iconeArret = {src: 'img/zoneArret.png',anchor:[0.5,1]};
var iconePArret = {src: 'img/pointArret.png',anchor:[0.5,1]};
var iconePositionNoir = {src: 'img/Carto/Vous_etes_ici.png',anchor:[0.5,1]};
var iconePositionRouge = new ol.style.Icon({src: 'img/Carto/positionRouge.svg',anchor:[0.5,1]});
var iconePositionVert = new ol.style.Icon({src: 'img/Carto/positionVert.svg',anchor:[0.5,1]});
var iconePositionBleu = new ol.style.Icon({src: 'img/Carto/positionBleu.svg',anchor:[0.5,1]});
var iconeDepart = {src: 'img/Carto/Depart' + (urlParams.lang=='fr'?'':'_' + urlParams.lang + '') + '.png',anchor:[0.5,1]};
var iconeArrivee = {src: 'img/Carto/Arrivee' + (urlParams.lang=='fr'?'':'_' + urlParams.lang + '') + '.png',anchor:[0.5,1]};

var imageLgnArret = new ol.style.Circle({
	radius: 6,
	fill: new ol.style.Fill({color: '#FFFFFF'}),
	stroke: new ol.style.Stroke({color: '#000000', width: 1})
});
var imageLgnArretSelect = new ol.style.Circle({
	radius: 6,
	fill: new ol.style.Fill({color: '#FF0000'}),
	stroke: new ol.style.Stroke({color: '#000000', width: 1})
});

var stylesTypes = {
	agenceM:{icon:iconeAgenceMM,iconMaxres:50,text:'NOM',textMaxRes:1,titre:'Agence M'},
	pointService:{icon:iconePointService,iconMaxres:50,text:'NOM',textMaxRes:1,titre:'Points Service'},
	dat:{icon:iconeDat,iconMaxres:5,text:'ARRET',textMaxRes:1,titre:'Distributeur automatique de titres'},
	depositaire:{icon:iconeDepositaires,iconMaxres:5,text:'NOM',textMaxRes:1,titre:'Dépositaires'},
	rue:{icon:iconeArret,iconMaxres:20,text:'LIBELLE',textMaxRes:1,titre:'Rue'},
	lieux:{icon:iconeArret,iconMaxres:3,text:'LIBELLE',textMaxRes:1,titre:'Lieu'},
	arret:{icon:iconeArret,iconMaxres:5,iconMinres:0.51,text:'LIBELLE',textMaxRes:2},//pas de titre : text a la place
	pointArret:{icon:iconePArret,iconMaxres:0.5,text:'LIBELLE',textMaxRes:0.2},
	citelib:{icon:iconecitelib,iconMaxres:5,text:'Nom de la station',textMaxRes:1,titre:'Cité Lib'},
	omms:{icon:iconecitelibbyhamo,iconMaxres:5,text:'LIBELLE',textMaxRes:1,titre:'Cité Lib by Ha:mo'},
	PMV:{icon:iconePMV,iconMaxres:50,text:'LIBELLE',textMaxRes:1,titre:'Panneaux à messages variables'},
	CAM:{icon:iconeCAM,iconMaxres:50,text:'LIBELLE',textMaxRes:1,titre:'Caméras de circulation'},
	PKG:{icon:iconePKG,iconMaxres:5,text:'LIBELLE',textMaxRes:1,titre:'Parkings'},
	PAR:{icon:iconePAR,iconMaxres:5,text:'LIBELLE',textMaxRes:1,titre:'P+R'},
	covoiturage:{icon:iconeArret,iconMaxres:3,text:'LIBELLE',textMaxRes:1,titre:'Covoiturage'},
	MVA:{icon:iconeMVA,iconMaxres:50,text:'LIBELLE',textMaxRes:1,titre:'Agence Metro-Velo'},
	MVC:{icon:iconeMVC,iconMaxres:5,text:'LIBELLE',textMaxRes:1,titre:'Consigne Metro-Velo'},
	dep:{icon:iconeDepart,iconMaxres:100000,text:'LIBELLE',textMaxRes:0,titre:'Depart'},
	arr:{icon:iconeArrivee,iconMaxres:100000,text:'LIBELLE',textMaxRes:0,titre:'Arrivée'},
	search:{icon:iconePositionNoir,iconMaxres:100000,text:'LIBELLE',textMaxRes:0,titre:'Resultat de recherche'}
};

//--------------------------------------//
// ajouteControle
//--------------------------------------//
function ajouteControle(idcarte,type,fct,opt_options) {
	
	var options = opt_options || {};
	
	var map = maps[idcarte];
	var fctMaj=fct;
	if(type=='localize') {
		map.addControl(new localize());
		$('#'+idcarte+' .localize button').click(function(){
			fctMaj(options);
			return false;
		});
	}
	if(type=='refresh') {
		map.addControl(new refresh());
		$('#'+idcarte+' .refresh button').click(function(){
			fctMaj();
			return false;
		});
	}
	if(type=='layerSwitcher') {
		map.addControl(new layerSwitcher());
		$('#'+idcarte+' .layer-switcher').after($('#'+idcarte).parent().find('.layerSwitcher'));
		//.layerSwitcher la classe de la balise englobante
		//.close-switcher la classe du bouton pour fermer le switcher
		$('#'+idcarte+' .layer-switcher button,#'+idcarte+' .close-switcher').click(function(e){
			//$(carte+' .layerSwitcher, .layer-switcher').toggle();
			var a = $(e.target).closest('.layer-switcher,.layerSwitcher');
			a.toggle();
			a.siblings('.layer-switcher,.layerSwitcher').toggle();
			return false;
		});
	}
}

//--------------------------------------//
// localize
//--------------------------------------//
function localize(opt_options) {

  var options = opt_options || {};

  //var anchor = document.createElement('a');
  //anchor.href = '#localize';
  var anchor = document.createElement('button');
  
  anchor.className="ol-zoom-in"; // empeche la compression yuicompressor
  anchor.setAttribute("type", "button");
  anchor.setAttribute("title", lang.maPosition);  

  var element = document.createElement('div');
  element.className = 'localize ol-control controle-ol ol-unselectable'; 
  element.appendChild(anchor);

 var e = document.createElement('span');
  e.className = 'glyphicon glyphicon-screenshot'; 
  anchor.appendChild(e);


  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });

}
ol.inherits(localize, ol.control.Control);

//--------------------------------------//
// refresh
//--------------------------------------//
function refresh(opt_options) {

  var options = opt_options || {};

  //var anchor = document.createElement('a');
  //anchor.href = '#refresh';
  var anchor = document.createElement('button');
  
  anchor.className="ol-zoom-in";
  anchor.setAttribute("type", "button");
  anchor.setAttribute("title", lang.rafraichir);

  //var this_ = this;
  var element = document.createElement('div');
  element.className = 'refresh ol-control controle-ol ol-unselectable'; 
  element.appendChild(anchor);

 var e = document.createElement('span');
  e.className = 'glyphicon glyphicon-refresh'; 
  anchor.appendChild(e);

  var e2 = document.createElement('span');
  e2.className = 'sr-only';
  e2.innerHTML = lang.rafraichir;
  anchor.appendChild(e2);


  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });

}
ol.inherits(refresh, ol.control.Control);

//--------------------------------------//
// layerSwitcher
//--------------------------------------//
function layerSwitcher(opt_options) {

  var options = opt_options || {};

  var anchor = document.createElement('button');
  
  anchor.className="ol-zoom-in";
  anchor.setAttribute("type", "button");
  anchor.setAttribute("title", lang.affichageDesCartographie);
 
  var element = document.createElement('div');
  element.className = 'layer-switcher ol-control controle-ol ol-unselectable'; 
  element.appendChild(anchor);
  
  var e = document.createElement('span');
  e.className = 'glyphicon glyphicon-menu-hamburger';

  var e2 = document.createElement('span');
  e2.className = 'sr-only';
  e2.innerHTML = lang.affichageDesCartographie;
   
  anchor.appendChild(e);
  anchor.appendChild(e2);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });

}
ol.inherits(layerSwitcher, ol.control.Control);

//--------------------------------------//
// ajouteLayerSwitcher
//--------------------------------------//
function ajouteLayerSwitcher(idcarte,nomlayer,layerswitcher,options) {
	//todo supprimer les h1 quand ils ne seront plus sur aucune carte
	if (!options) options={};
	var libelle = (options && options.libelle ? options.libelle:nomlayer);
	var classe = '';
	if (options.classe) {
		classe = 'class="'+options.classe+'"';
	}
	var e = $('<li '+classe+' ><input id="'+nomlayer+'" type="checkbox" data-map="'+idcarte+'" data-layer="'+nomlayer+'"/><label for="'+nomlayer+'">'+libelle+'</label></li>');
	$(layerswitcher+' .layers' ).append(e);
	var layer = getLayer(idcarte,nomlayer);
	if (layer) {
		$('#'+nomlayer).prop('checked', layer.get('visible'));
	}
	$('#panel h1[data-layer="'+nomlayer+'"], h2[data-layer="'+nomlayer+'"]').append('<div class="pull-right check" title="Affichage des ' +  libelle  + '" alt="Affiche les ' +  libelle  + '"><div class="switch"></div></div>');
	$(layerswitcher+' #'+nomlayer).unbind('change').on('change',function(e){
		var nomlayer=$(e.target).attr('data-layer');
		var idcarte=$(e.target).attr('data-map');
		var layer = getLayer(idcarte,nomlayer);
		if (!layer && options.initFct) {
			layer = options.initFct();
		}
		var bVisible = $(e.target).is(':checked');
		
		layer.set('visible', bVisible);
		var h1 = $('#panel h1[data-layer="'+nomlayer+'"], #panel h2[data-layer="'+nomlayer+'"]');
		h1.toggleClass('layerVisible',bVisible);
	});
}
	$('#panel h1, #panel h2').click(function(){
		var nomLayer = $(this).attr('data-layer');
		var bVisible = !$('#'+nomLayer).is(':checked');
		activeLayer(nomLayer,!bVisible);
		
		nomLayer = $(this).attr('data-layer2');
		if(nomLayer) {
			bVisible = !$('#'+nomLayer).is(':checked');
			activeLayer(nomLayer,!bVisible);
		}
		
		if(isTaille('xs') && togglePanneau) {togglePanneau();}
		return false;
	});

//--------------------------------------//
// getStylesOverlay
//--------------------------------------//
function getStylesOverlay(feature,resolution,select) {
	var styles;
	var type = feature.get('typeDep');
	
	if(!feature) {return [];}
	if (feature.get('bVisible')==false) return [];
	if (feature.getGeometry().getType() == 'MultiLineString' || feature.getGeometry().getType() == 'LineString') {
		if (!styleCache['lgnFondSelect']) {
			styleCache['lgnFondSelect'] = new ol.style.Style({
				stroke:new ol.style.Stroke({
					color: '#FFFFFF',
					width: 10,
					opacity: 1,
					zIndex: 1
				})
			});
		}
		if (!styleCache['lgnSelect_'+getCouleur(feature)]) {
			styleCache['lgnSelect_'+getCouleur(feature)] = new ol.style.Style({
				stroke:new ol.style.Stroke({
					color: getCouleur(feature),
					width: 8,
					opacity: 1,
					zIndex: 2
				})
			});
		}
		styles = [
			styleCache['lgnFondSelect'],
			styleCache['lgnSelect_'+getCouleur(feature)]
		];
		return styles;
	} else if (feature.getGeometry().getType() == 'Point') {
		var text='';
		var font='';
		var image=imageLgnArret;
		var color = '#ffffff';
				
		if(type) { //Point de depart ou d'arrivée
			
			text=String.fromCharCode(57442);
			font='20px Glyphicons Halflings, Arial';
			color='#000000';
			if (type=='dep') {
				color='#009900';
			} else if (type=='arr'){
				color='#ff0000';
			}
			image=null;
			
			
			if (!styleCache['deparr_'+type+(select?'_selected':'')]) {
				styleCache['za_'+type+(select?'_selected':'')] = new ol.style.Style({
					zIndex: 13,
					image: image,
					text: new ol.style.Text({
						font: font,
						text: text,
						//rotation: 0.5,
						textAlign:'start',
						textBaseline:'middle',
						offsetX:10,
						offsetY:6,
						//scale:1,
						fill: new ol.style.Fill({
							color: color
						}),
						stroke: new ol.style.Stroke({
							color: '#ffffff',
							width: 3
						})
					})
				});
			} 
			styles = [
				styleCache['za_'+type+(select?'_selected':'')]
			];
			
			return styles ;
			
		} 
		else if(!feature.get('LIBELLE_ZONE')) { //Point d'arret
			text='';
			font = '12px Arial,Calibri,sans-serif';
			image=null;
			color= '#00ff00';
		} 
		else { //Zone d'arret
			text = resolution < 10 ? feature.get('LIBELLE_ZONE') : '';
			font = '12px Arial,Calibri,sans-serif';
			image=(select?imageLgnArretSelect:imageLgnArret);
		}
		if (!styleCache['za_'+text+(select?'_selected':'')]) {
			styleCache['za_'+text+(select?'_selected':'')] = new ol.style.Style({
				zIndex: 13,
				image: image,
				text: new ol.style.Text({
					font: font,
					text: text,
					//rotation: 0.5,
					textAlign:'start',
					textBaseline:'middle',
					offsetX:10,
					offsetY:6,
					//scale:1,
					fill: new ol.style.Fill({
						color: 'rgba(0, 0, 0, 1)'
					}),
					stroke: new ol.style.Stroke({
						color: '#ffffff',
						width: 3
					})
				})
			});
		} 
		styles = [
			styleCache['za_'+text+(select?'_selected':'')]
		];
		
		return styles ;
	}
}

//--------------------------------------//
// initMap
//--------------------------------------//
function initMap(idcarte,opt) {

	var options = {
		renderer: ['canvas'],
		//renderers:ol.RendererHint.WEBGL,
		target: idcarte,
		overlayStyle:getStylesOverlay,
		selectStyle:getStylesOverlay
	};
	if (!opt) {opt={};}
	if (opt.selectStyle) options.selectStyle=opt.selectStyle;
	if (opt.overlayStyle) options.overlayStyle=opt.overlayStyle;
	
	var map = new ol.Map(options);
	maps[idcarte] = map;
	
	map.fondParDefaut = ajouteFond(idcarte,urlParams.fond,opt.sourceFond, 'fond Mapnik en N&B');
 
	var scaleLineControl = new ol.control.ScaleLine();//{bottomOutUnits:'',bottomInUnits:'',maxWidth:150}
	map.addControl(scaleLineControl);
	
	if(!opt.lon || !opt.lat) {
		opt.lon = 5.731641;
		opt.lat = 45.180645;
	}
	if(!opt.zoom) {opt.zoom = 13;}
	if(!opt.maxZoom) {opt.maxZoom = 19;}
	if(!opt.minZoom) {opt.minZoom = 10;}
	//emprise par defaut
	var centerPt = ol.proj.transform([opt.lon, opt.lat], gg, sm);
	var view = new ol.View({
		center: centerPt,
		zoom: opt.zoom,
		maxZoom:opt.maxZoom,
		minZoom:opt.minZoom
	});	
	map.setView(view);

	var featuresOverlay = new ol.FeatureOverlay({
		map: map,
		style: options.overlayStyle
	});
	map.featuresOverlay =featuresOverlay;

	var select = new ol.interaction.Select({
			layers:function(e){ return layerSelectionnables(e,idcarte);},
			style: function(feature,resolution){ return options.selectStyle(feature,resolution,true);}
	});
	map.addInteraction(select);
	select.getFeatures().on('change:length', function(e) {
		
		// on affiche/cache les layers en hideonselect en fonction du contenu de la selection
		// seul les layers selectionnés dans le layerswitcher sont concernés
		// on deselectionne tout dans les listes
		var layers = maps[idcarte].getLayers();
		for (var i=0;i<layers.getLength();i++) {
			var l = layers.item(i);
			if (l.get('selectable')=='hideonselect' && l.get('selectedLayer')==true) {
				l.set('visible',e.target.getLength()==0);
			}
			if(l.get('containerSelector') && l.get('liSelectedClass')) {
				var liSelectedClass = l.get('liSelectedClass');
				var containerSelector = l.get('containerSelector');
				$(containerSelector +' > .' +liSelectedClass).removeClass(liSelectedClass);
				//suppression du contenu de la liste d'icone dans la barre principale navbar navbarlistLogo(a faire)
				$('.logoBar').remove();
			}
		}
		getMap(idcarte).featuresOverlay.getFeatures().clear();
		if (e.target.getLength()!=0) {
			for (var i=0;i<e.target.getLength();i++) {
				var t = e.target.item(i);
				if (t.get('NUMERO')!= null) { //lignes TC
					if(t.get('ZONES_ARRET')) {
						ajouteZonesArret(idcarte,'',t.get('ZONES_ARRET'),(e.target.getLength() == 1?e.target.item(0):null));
					}
					if(t.get('liSelectedClass')) {
					
						var code = t.get('CODE');
						var numero = t.get('NUMERO');
						var color = t.get('COULEUR');

						var liSelectedClass = t.get('liSelectedClass');
						$('#'+code).addClass(liSelectedClass);
						//Rajoute de l'icone dans la navbar navbarlistLogo
						$('.navbarlistLogo').append(getLogoLgn(code,numero,color,false,'logoBar','logoBarRect'));
					}
				}
				if (t.get('LIGNESARRET')!= null) { //Zones d'Arret
					if (e.target.getLength() == 1) {
						//on affiche en overlay les lignes qui passent par cet arret
						var tabLignes = t.get('LIGNESARRET').split(',');
						for (var ligne in tabLignes) {
							if(sourceLgn.listeFeatures[tabLignes[ligne]]) {
								getMap(idcarte).featuresOverlay.addFeature(sourceLgn.listeFeatures[tabLignes[ligne]]);
								ajouteZonesArret(idcarte,'',sourceLgn.listeFeatures[tabLignes[ligne]].get('ZONES_ARRET'));
							}
						}
					}
				}
			}
		}
	});
	var popupId = 'popup';
	if (opt.popupId) popupId = opt.popupId;
	var element = document.getElementById(popupId);
	
	if(element) {
	
		if (!isTaille('xxs') && (typeof(appMetromobilite)=='undefined' || !appMetromobilite)) {
			var popup = new ol.Overlay({
				element: element,
				//positioning: ol.OverlayPositioning.BOTTOM_CENTER,
				stopEvent: true
			});
			map.addOverlay(popup);
			map.popup =popup;
		}
		map.popupSelector="#" + popupId;
		$(element).on('click','.PopupDetails-Close',function(){
			$(element).hide();
			$( document ).trigger( "evtPopupFermee",map );
			return false;
		});
	}

	// display popup on click
	map.on('singleclick', function(evt) {
		try{
		showPopupDetails(map,evt);
		return false;
		} catch(e){
			console.log(e.msg+' : '+e.lineNumber);
		}
	});
	
	map.updateSize();
	
	return map;
}

//--------------------------------------//
// showPopupDetails
//--------------------------------------//
function showPopupDetails(map,evt,featurePredefini){
		var element = document.querySelector(map.popupSelector);
		if(element) {
			var details = '';
			var detailsSeul = '';
			var featureSeul =false;
			var f = null;
			var prevCodes ={};
			var first=true;
			var prevDescrition="";
			
			var h='';
			var getDetailsFeature = function(feature, layer){
				var d='';
				if (first) {
					h+='<span class="PopupDetails-Close pull-right"><span class="glyphicon glyphicon-remove"></span></span>';
					if (feature.get('description') && prevDescrition != feature.get('description'))
						h+='<div class="row PopupDetailsEntete'+ feature.get('type') + '">' + feature.get('description') + '</div>';
					first=false;
				}
				if (feature.get('detailsCallback')) {
					f = feature;
					if(!feature.get('detailsSeul'))
						d+='<div class="PopupDetails-detailsCallback">' + feature.get('detailsCallback')(feature) + '</div>';
				}
				if (feature.get('detailsSeul')&& !featureSeul) {
					detailsSeul=d;
					featureSeul=f;
				}
				if (d!='') {
					d='<div class="PopupDetails-body-multiple">' + d + '</div>';
				}
				details+=d;
				
				return true;
			};
			var coord;
			var bPopupOuverte = false;
			if (typeof(featurePredefini)!='undefined') {
				getDetailsFeature(featurePredefini);
				bPopupOuverte = true;
				coord = featurePredefini.getGeometry().getCoordinates();
			} else {
				if(map.forEachFeatureAtPixel(evt.pixel, getDetailsFeature)) {
					bPopupOuverte = true;
				}
				coord = evt.coordinate;
			}
			if (f) {
				if (featureSeul && featureSeul.get('detailsCallback')) {
					detailsSeul+='<div class="PopupDetails-detailsCallback" data-id="'+featureSeul.getId()+'">' + featureSeul.get('detailsCallback')(featureSeul) + '</div>';
				}
				var fullDetails = '<div class="PopupDetails"><div class="PopupDetails-head">'+h+'</div><div class="PopupDetails-body">' + (detailsSeul!=''?detailsSeul:details) + '</div></div>';
				
				if (!isTaille('xxs') && (typeof(appMetromobilite)=='undefined' || !appMetromobilite)) {
					map.popup.setPosition(coord);
				}
				$(element).show();
				$(element).html(fullDetails);
				$( document ).trigger( "evtPopupOuverte", map );
			} //else {
				//$(element).hide();
			//}
		}
		// cas depart arrivee d'itineraire
		if (map.singleClickCallback && evt.coordinate) {
			map.singleClickCallback(evt.coordinate);
		}
}

//--------------------------------------//
// ajouteFond
//--------------------------------------//
function ajouteFond(idcarte,fond,sourceForcee,idForcee) {
	var map = maps[idcarte];
	var layer=null;
	var id = null;
	var source = null;
	var attributionsOSM = new ol.Attribution({
            html: 'Tiles &copy; <a href="http://www.openstreetmap.org/">' +
                'openstreetmap</a>'
          });
	switch(fond) {
		case 'mapquest':
			id = "fond MapQuest";
			source = new ol.source.MapQuest({layer: 'osm'});
			break;
		case 'mapquestSat':
			id="fond MapQuest Sat";
			source = new ol.source.MapQuest({layer: 'sat'});
			break;
		case 'mapquestHyb':
			id = "fond MapQuest Hybride";
			source = new ol.source.MapQuest({layer: 'hyb'});
			break;
		case 'OSM':
			id = "fond OSM";
			source = new ol.source.OSM();
			break;
		case 'bw-mapnik':
			id = "fond Mapnik en N&B";
			source = new ol.source.XYZ({attributions: [attributionsOSM],
				url: 'http://{a-c}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
			});
			break;
		case 'bw-noicons':
			id = "fond Mapnik N&B sans icones";
			source = new ol.source.XYZ({attributions: [attributionsOSM],
				url: 'http://{a-c}.tiles.wmflabs.org/bw-noicons/{z}/{x}/{y}.png'
			});
			break;
		case 'cartodb':
			id = "fond CartoDB";
			source = new ol.source.XYZ({
				url: 'http://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
				attributions: [new ol.Attribution({ html: ['&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'] })]
			});
			break;
		default:
			id = "metromobilite";
			source = new ol.source.XYZ({
				tileUrlFunction: function(coordinate) {
					if(coordinate == null){
						return "";
					} 
					var z = coordinate[0];//.z;
					var x = coordinate[1];//.x;
					var y = coordinate[2];
					//var y = (1 << z) - coordinate[2]/*.y*/ - 1;
					return 'http://data.metromobilite.fr/carte/'+z+'/'+x+'/'+y+'.png';
				},
				maxZoom:18
			});
	}
	if (id != null && source != null) {
		if(sourceForcee) source = sourceForcee;
		if(idForcee) id = idForcee;
		layer = new ol.layer.Tile({id:id,source: source,extent:ol.proj.transformExtent([5.4185,44.8432,6.3798,45.5169], gg, sm)});
		layer.set('fond',true);
		map.addLayer(layer);
	}
	return layer;
}

//--------------------------------------//
// activeLayer
//--------------------------------------//
function activeLayer(nomLayer,bHide) {
	$('#'+ nomLayer).prop('checked', !bHide);
	$('#'+ nomLayer).trigger('change');
}

//--------------------------------------//
// cacheToutLayers
//--------------------------------------//
function cacheToutLayers(idcarte) {
	$('#'+ idcarte+' .layerSwitcher .layers li input').prop('checked', false);
	$('#'+ idcarte+' .layerSwitcher .layers li input').trigger('change');
}

//--------------------------------------//
// getSelect
//--------------------------------------//
function getSelect(idcarte) {
	var interactions = maps[idcarte].getInteractions();
	var select =null;
	for (var i=0;i<interactions.getLength();i++) {
		if (interactions.item(i) instanceof ol.interaction.Select) {
			select = interactions.item(i);
			break;
		}	
	}
	return select;
}

//--------------------------------------//
// unSelectAll
//--------------------------------------//
function unSelectAll(idcarte) {

	var select = getSelect(idcarte);
	select.getFeatures().clear();
	getMap(idcarte).render();
}

//--------------------------------------//
// getLayer
//--------------------------------------//
function getLayer(idcarte,nomLayer) {
	try {
		if(typeof(nomLayer.getVisible) != 'undefined') return nomLayer; //on a passé layer au lieu de nomLayer
		var map = maps[idcarte];
		var layer = map.getLayers().getArray().filter(function( obj ) {return obj.get('id') == nomLayer;})[0];
		
		return layer;
		}
		catch(e) {
			console.log(e.linNumber+' : '+e.message);
			return null;
		}
}

//--------------------------------------//
// afficheLayer
//--------------------------------------//
function afficheLayer(nomLayer,idCarte,affiche,layerSeul,prefixeLayerSeul) {

	var layer = getLayer(idCarte,nomLayer);
	if (layer) {
		if (!layerSeul) {
			layer.set('visible',affiche);
		} else {
			var layers = getMap(idCarte).getLayers();
			for (var i=0;i<layers.getLength();i++) {
				var l = layers.item(i);
				if(l.get('visible') && l.get('id').substr(0,prefixeLayerSeul.length)==prefixeLayerSeul) {
					l.set('visible',false);
					l.set('selectedLayer',false);
				}
			}
			layer.set('visible',true);
			layer.set('selectedLayer',true);
		}
	}
}

//--------------------------------------//
// ajouteLayerManuel
//--------------------------------------//
function ajouteLayerManuel(nomLayer,idcarte,options) {
	try {
		var map = maps[idcarte];
		if (!options) {options = {};}
		if (!options || !options.fctStyle) {options.fctStyle = getStylesGeojson;}
		if (!options || !options.color) {options.color = '#000000';}
		if (!options || !options.maxResolution) {options.maxResolution = 999999;}

		if (getLayer(idcarte,nomLayer)!=null) return;
		
		if (!options.source) {
			options.source = new ol.source.GeoJSON({
				projection: sm
			});
			options.source.on('addfeature', function(event) {
				var feature = event.feature;
				if(feature.get('CODE')) feature.set('id',feature.get('CODE'));
				
				if(options.detailsCallback) {
					feature.set('detailsCallback',options.detailsCallback);
				}
				if(options.detailsSeul) {
					feature.set('detailsSeul',options.detailsSeul);
				}
			});
		}
		var layer = new ol.layer.Vector({
			id: nomLayer,
			visible:false,
			source: options.source,
			maxResolution:options.maxResolution,
			style:function(feature,resolution){return options.fctStyle(feature,resolution,options.color);}
		});

		if (options.indexLayer) 
			map.getLayers().insertAt(options.indexLayer,layer);
		else
			map.addLayer(layer);
		return layer;

	} catch(e) {
		console.error(e.lineNumber+' : '+e.message);
	}
}

//--------------------------------------//
// getStylesGeojson
//--------------------------------------//
function getStylesGeojson(feature,resolution,color) {
	var styles =[];
	
	if (feature.getGeometry().getType() == 'MultiLineString' || feature.getGeometry().getType() == 'LineString'
	|| feature.getGeometry().getType() == 'MultiPolygon' || feature.getGeometry().getType() == 'Polygon') {
		if (!styleCache['styleLigne_'+color]) {
			styleCache['styleLigne_'+color] = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: color,
					width: 3,
					opacity: 1,
					zIndex: 200
				}),
				zIndex: 200
			});
		}
		
		styles = [styleCache['styleLigne_'+color]] ;
		
			
	} else if (feature.getGeometry().getType() == 'Point') {
		if (!styleCache['stylePoint_'+color]) {
			styleCache['stylePoint_'+color] = new ol.style.Style({
				zIndex: 13,
				image: new ol.style.Circle({
					radius: 6,
					fill: new ol.style.Fill({color: color}),
					stroke: new ol.style.Stroke({color: '#000000', width: 1})
				})
			});
		} 
		styles = resolution < 35 ? [styleCache['stylePoint_'+color]] : [];
	}
	return styles ;
}

//--------------------------------------//
// getLignesProches
//--------------------------------------//
function getLignesProches(lonlat,callback,feature,nomZAFiltre,idCarte) {
	var searchUrl = (url.saisieChoisie=='local'?url.hostnameLocal+url.portWSTest:url.hostnameData);
		searchUrl += '/api/linesNear/json';
		searchUrl += '?x='+lonlat.split(',')[1];
		searchUrl += '&y='+lonlat.split(',')[0];

	$.ajax({
		type: "GET",
		url: searchUrl,
		error:error,
		dataType:   'json'
	}).then(function(response) {
		var lignes = {};
		response.forEach(function(e){
			var code = e.replace(':','_');
			lignes[code]=code;
		});

		if (callback) callback(lignes,feature,null,idCarte);
	});
	
	return '';//car on replace le contenu en asynchrone.
}

//--------------------------------------//
// afficheListeLgn
//--------------------------------------//
function afficheListeLgn(lignes,feature,stops,idCarte) {
	var mondiv =$('<div>');
	var map = getMap(idCarte);
	var ter = false; //Evite d'avoir des doublons TER
	for(var l in lignes) {
		//if(sourceLgn && sourceLgn.listeFeatures[lignes[l]]) {
		if(dataLignesTC && dataLignesTC[l] && !ter) {
			//var f=sourceLgn.listeFeatures[l];
			mondiv.append(getLogoLgn(l,dataLignesTC[l].routeShortName,'#'+dataLignesTC[l].routeColor,false,'logoSmall','logoRectSmall'));
			if (dataLignesTC[l].code.substr(0,3) == "SNC") ter = true;
		}
	}
	tri(mondiv,'svg','','data-code');
	if (mondiv.html()!="")
		$(map.popupSelector + ' .PopupDetails-detailsCallback').append('<span class="lignesProches">' + lang.carteMobile.lignesProches + '</span>' + mondiv.html());
}

//--------------------------------------//
// estAfficheLayer
//--------------------------------------//
function estAfficheLayer(nomLayer,idCarte) {
	var layer = getLayer(idCarte,nomLayer);
	if (layer) return layer.get('selectedLayer');
}

//--------------------------------------//
// getMap
//--------------------------------------//
function getMap(idcarte) {
	return maps[idcarte];
}

//--------------------------------------//
// layerSelectionnables
//--------------------------------------//
function layerSelectionnables(e,idcarte) {
	return (typeof(e.get('selectable'))!="undefined" && (e.get('selectable')==true || e.get('selectable')=='hideonselect'));
}

//--------------------------------------//
// error
//--------------------------------------//
function error(xhr, status, error) {
	try {
		fct_attente_horaires(false);
		var err = eval("(" + (xhr.responseText=="timeout"?"le serveur ne repond pas.":xhr.responseText) + ")");
		if (typeof(err) != "undefined")
			console.log(err.Message);
		else console.log('carte.js error : ' + status+' : '+error);
	} catch(e) {
		console.log(e.lineNumber+' : '+e.message);
	}
}

//--------------------------------------//
// getStylesTypes
//--------------------------------------//
function getStylesTypes(feature,resolution,color) {
	var styles=[];
	
	if (feature.getGeometry().getType() == 'MultiLineString' || feature.getGeometry().getType() == 'LineString') {
		if (!styleCache['styleLigne_'+color]) {
			styleCache['styleLigne_'+color] = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: color,
					width: 3,
					opacity: 1,
					zIndex: 200
				}),
				zIndex: 200
			});
		}
		
		styles = [styleCache['styleLigne_'+color]] ;
		
	} else if (feature.getGeometry().getType() == 'Point') {
		var type = feature.get('type');
		var text = (resolution < stylesTypes[type].textMaxRes ? feature.get(stylesTypes[type].text):'');
		var font = 'bold 12px Verdana,Calibri,sans-serif';
		if(stylesTypes[type].font) font = stylesTypes[type].font;
		var fillColor = 'rgba(0, 0, 0, 1)';
		var strokeColor = '#ffffff';
		if(stylesTypes[type].color) fillColor = stylesTypes[type].color;

		var nsv = feature.get('nsv');
		if(!nsv) nsv = 0;
		var orientation = 0;
		if(feature.get('CAP')) orientation = feature.get('CAP');
		if (!styleCache['stylePoint_'+type+text+nsv+orientation]) {
			var image = ''+stylesTypes[type].icon.src;
			image = image.replace(/\_[0-4].png$/g,'_'+nsv+'.png');
			stylesTypes[type].icon.src = image;
			stylesTypes[type].icon.rotation = Math.PI / 180 * orientation; //convertion en radian;
			if (nsv==0 && feature.get('CAP')) stylesTypes[type].icon.opacity = 0.25;

			var styleOpt = {
				zIndex: 13,
				image:  new ol.style.Icon(stylesTypes[type].icon)
			};
			if (stylesTypes[type].text && text != '') {
				styleOpt.text = new ol.style.Text({
					font: font,
					text: text,
					textAlign:'start',
					textBaseline:'middle',
					offsetX:10,
					offsetY:6,
					//scale:1,
					fill: new ol.style.Fill({
						color: fillColor
					}),
					stroke: new ol.style.Stroke({
						color: strokeColor,
						width: 3
					})
				});
			}
			styleCache['stylePoint_'+type+text+nsv+orientation] = new ol.style.Style(styleOpt);
		}
		styles = (resolution < 50 
				&& resolution < stylesTypes[type].iconMaxres 
				&& (!stylesTypes[type].iconMinres || resolution > stylesTypes[type].iconMinres)
				&& (!feature.get('arr_visible') || feature.get('arr_visible') == '1')
				) ? [styleCache['stylePoint_'+type+text+nsv+orientation]] : [];
	}

	return styles ;
}

//--------------------------------------//
// creeSourceType
//--------------------------------------//
function creeSourceType(idcarte,types,options) {
	if(!options) options = {};
	if(!options.fctDetails) options.fctDetails=getDetails;

	var vectorSource = new ol.source.ServerVector({
	  loader: function(extent, resolution, projection) {
		var epsg4326Extent = ol.proj.transformExtent(extent, projection, 'EPSG:4326');
		
		var searchUrl = (url.saisieChoisie=='local'?url.hostnameLocal+url.portWSTest:url.hostnameData);
			searchUrl += '/api/bbox/json?';
			searchUrl += 'ymax='+epsg4326Extent[3];
			searchUrl += '&xmin='+epsg4326Extent[0];
			searchUrl += '&ymin='+epsg4326Extent[1];
			searchUrl += '&xmax='+epsg4326Extent[2];
			searchUrl += '&types='+types;

		$.ajax({
			type: "GET",
			url: searchUrl,
			error:error,
			dataType: 'json'
		}).then(function(response) {
			response.features.forEach(function (feature){
				var type = feature.properties.type;
				var id = type+'_'+feature.properties.id;
				if(type=='PME') id=feature.properties.id;
				if (!vectorSource.getFeatureById(id)) {
					var geom = new ol.geom.Point(ol.proj.transform(feature.geometry.coordinates, gg, sm));
					var opt = feature.properties;
					opt.geometry = geom;
					opt.id = id;
					opt.detailsCallback = options.fctDetails;
					opt.detailsSeul = true;
					opt.description = (stylesTypes[type].titre?stylesTypes[type].titre:feature.properties[stylesTypes[type].text]);
					var feature = new ol.Feature(opt);
					feature.setId(id);
					vectorSource.addFeature(feature);
				}
			});
			types.split(',').forEach(function(type){
				$( document ).trigger( 'evtSourceChargee', type );
			});
		});
	  },
	  projection: 'EPSG:3857'
	});
	
	return vectorSource;
}

//--------------------------------------//
// ajouteLayerType
//--------------------------------------//
function ajouteLayerType(idcarte,nomlayer,type,options) {
	if(!options) options = {};
	if(!options.fctStyle) options.fctStyle=getStylesTypes;
	if(!options.layerSwitcherSelector) options.layerSwitcherSelector='#'+idcarte+' .layerSwitcher';
	if(!options.layerSwitcherName) options.layerSwitcherName=nomlayer;
	if(!options.source) options.source = creeSourceType(idcarte,type,options);
	if(!options.noSwitcher) options.noSwitcher = false;

	var layer = ajouteLayerManuel(nomlayer,idcarte,{
		source:options.source,
		maxResolution:options.maxResolution,
		fctStyle:function(feature,resolution,color) {
			if(feature.get('type')!=type) return [];
			
			return options.fctStyle(feature,resolution,color);
		}
	});
		
	getMap(idcarte).addLayer(layer);
	
	if (!options.noSwitcher) ajouteLayerSwitcher(idcarte,nomlayer,options.layerSwitcherSelector,{
		libelle:options.layerSwitcherName
	});
	
			/*********************** DEBUT TEST CLUSTER ***********************/
			/*var clusterSource = new ol.source.Cluster({
			  distance: 40,
			  source: sourcePoints
			});

			var styleCache = {};
			var clusters = new ol.layer.Vector({
			  source: clusterSource,
			  style: function(feature, resolution) {
				  
				//return getStylesTypes(feature, resolution,color);
				  
				var size = feature.get('features').length;
				var style = styleCache[size];
				if (!style) {
					style = [new ol.style.Style({
						image: new ol.style.Circle({
						  radius: 20,
						  stroke: new ol.style.Stroke({
							color: '#fff'
						  }),
						  fill: new ol.style.Fill({
							color: '#3399CC'
						  })
						}),
						text: new ol.style.Text({
						  text: size.toString(),
						  fill: new ol.style.Fill({
							color: '#fff'
						  })
						})
				  })];
				  styleCache[size] = style;
				}
				return style;
			  }
			});
			getMap(idcarte).addLayer(clusters);
			*/
			/*********************** FIN TEST CLUSTER ***********************/
	
	return layer;
}

//--------------------------------------//
// getCouleur
//--------------------------------------//
function getCouleur(feature) {
	var color = dataLignesTC[feature.get('CODE')].routeColor;
	if (typeof(color) != "undefined" && color && color !='') 
		return colorToHex('#'+color);
	else {
		return '';
	}
}

//--------------------------------------//
// getStylesLgn
//--------------------------------------//
var getStylesLgn = function(feature,resolution,typeLayer) {
	var type = feature.get('TYPE');
	if (type != typeLayer && typeLayer!='SEM') return false;
	if (typeLayer=='SEM' && type != 'TRAM' && type != 'CHRONO' && type != 'PROXIMO' && type != 'FLEXO') return false;
	if (filtreLgn && filtreLgn.split(",").indexOf(feature.get('CODE'))==-1) return false;
	
	var color_fond = '#FFFFFF';
	var width_fond = 10;
	var zIndex_fond  = 100;
	
	var color_ligne = getCouleur(feature);
	//var width_ligne = 8;
	var zIndex_ligne = 101;
	
	var color_centre = 'rgba(255, 255, 255, 0.5)';
	var width_centre = 2;
	var zIndex_centre = 102;
	var lineDash_centre = null;
	
	var lgnFond = 'lgnFond_' + type;
	var lgnCentre = 'lgnCentre_' + type;
	var lgnCode = 'lgn_'+feature.get('CODE');
	
	switch(type) {

	case 'CHRONO':
			width_centre = 0;
			zIndex_fond = 90;
			zIndex_ligne = 91;
		break;
		
		case 'PROXIMO':
			width_centre = 0;
			width_fond = 8;
			width_ligne = 6;
			
			zIndex_fond = 80;
			zIndex_ligne = 81;
			zIndex_centre = 82;
		break;
		
		case 'FLEXO':
			width_fond = 8;
			width_ligne = 6;
			width_centre = 4;
			lineDash_centre = [0,10];
			color_centre = 'rgba(255, 255, 255, 1)';
			
			zIndex_fond = 70;
			zIndex_ligne = 71;
			zIndex_centre = 72;
		break;
		
		case 'C38':
			if(feature.get('structurante')==true) {
				width_centre = 4;
				lineDash_centre = [0,10];
				color_centre = 'rgba(0, 0, 0, 1)';
				
				zIndex_fond = 90;
				zIndex_ligne = 91;
				zIndex_centre = 92;
			} else {
				width_centre = 0;
				width_fond = 6;
				width_ligne = 4;
			}

		break;

		case 'SNC':
			width_centre = 0;
			width_fond = 6;
			width_ligne = 4;
		break;

		default:
	}

	if(!styleCache[lgnFond]) {
		styleCache[lgnFond] = new ol.style.Style({
				stroke:new ol.style.Stroke({
				color: color_fond,
				width: 5,//width_fond,
				zIndex: zIndex_fond
			}),
			zIndex: zIndex_fond
		});
	}

	if(!styleCache[lgnCentre]) {
		styleCache[lgnCentre] = new ol.style.Style({
				stroke:new ol.style.Stroke({
				color: color_centre,
				lineDash: lineDash_centre,
				width: 0,//width_centre,
				zIndex: zIndex_centre
			}),
			zIndex: zIndex_centre
		});
	}

	if(!styleCache[lgnCode]) {
		styleCache[lgnCode] = new ol.style.Style({
			stroke:new ol.style.Stroke({
				color: color_ligne,
				width: 3,//width_ligne,
				zIndex: zIndex_ligne
			}),
			zIndex: zIndex_ligne
		});
	}

	var styles = [styleCache[lgnCode]];
	
	if (width_fond!=0) styles.push(styleCache[lgnFond]);
	if (width_centre!=0) styles.push(styleCache[lgnCentre]);
	
	return styles;
};

//--------------------------------------//
// getStylesSelect
//--------------------------------------//
function getStylesSelect(feature,resolution){
	return getStylesOverlay(feature,resolution,false);
}

//--------------------------------------//
// chargeGeomLigne
//--------------------------------------//
function chargeGeomLigne(idcarte,code,reseau,options){
	var map = getMap(idcarte);
	
	var searchUrl = (url.saisieChoisie=='local'?url.hostnameLocal+url.portWSTest:url.hostnameData);
		searchUrl += '/api/lines/poly?';
		searchUrl += 'types=ligne';
		if(code) searchUrl += '&codes='+code;
		if(reseau) searchUrl += '&reseaux='+reseau;

	$.ajax({
		type: "GET",
		url: searchUrl,
		error:error,
		dataType: 'json'
	}).then(function(response) {
		
		var format = new ol.format.Polyline({});
		response.features.forEach(function (feature){
			var geom;
			if(Array.isArray(feature.properties.shape)) {
				var coord = [];
				feature.properties.shape.forEach(function (s){
					coord.push(format.readGeometry(s,{dataProjection:gg,featureProjection:sm}).getCoordinates());
				});
				geom = new ol.geom.MultiLineString(coord);
			} else {
				var coord = format.readGeometry(feature.properties.shape,{dataProjection:gg,featureProjection:sm}).getCoordinates();
				geom = new ol.geom.LineString(coord);
			}
			var id = feature.properties.CODE;
			var opt = feature.properties;
			var listeZA = feature.properties.ZONES_ARRET;
			opt.geometry = geom;
			opt.detailsCallback = options.fctDetails;
			opt.TYPE = getTypeLigne(opt.CODE,opt.CODE.substr(4));
			opt.description = 'Ligne';
			opt.bVisible=true;
			var feature = new ol.Feature(opt);
			feature.setId(id);
			options.source.addFeature(feature);
			if (options.chargeZA) chargeZALigne(idcarte,code,listeZA,{fctDetails:options.fctDetails,source:sourceSel});
		});
	});
}

//--------------------------------------//
// chargeZALigne
//--------------------------------------//
function chargeZALigne(idcarte,codeLigne,listeZA,options){
	var map = getMap(idcarte);
	if(!codeLigne) return;
	codeLigne=codeLigne.replace('_',':');
	//var searchUrl = url.hostnameData;
	//	searchUrl += '/otp/routers/default/index/routes/'+codeLigne+'/stops';
	var searchUrl = (url.saisieChoisie=='local'?url.hostnameLocal+url.portWSTest:url.hostnameData);
		searchUrl += '/api/points/json?';
		searchUrl += 'types=arret&codes='+listeZA;
		
	$.ajax({
		type: "GET",
		url: searchUrl,
		error:error,
		dataType: 'json'
	}).then(function(response) {
		response.features.forEach(function (f){
			var id = 'arret_'+f.properties.CODE;
			if (options.source.getFeatureById(id)) {
				options.source.getFeatureById(id).set('bVisible',true);
				return;
			}
			var geom = new ol.geom.Point(f.geometry.coordinates).transform(gg, sm);
			var opt = {};
			opt.geometry = geom;
			opt.id = id;
			opt.CODE = f.properties.CODE;
			opt.description = f.properties.LIBELLE;
			opt.detailsCallback = options.fctDetails;
			opt.detailsSeul = true;
			opt.LIBELLE_ZONE = f.properties.LIBELLE;
			opt.COMMUNE = f.properties.COMMUNE;
			opt.type = 'arretSel';
			opt.bVisible=true;
			var feature = new ol.Feature(opt);
			feature.setId(id);
			options.source.addFeature(feature);
		});
	});
}

//--------------------------------------//
// ajouteLignes
//--------------------------------------//
function ajouteLignes(idcarte,getDetails) {
	var insertAt = getMap(idcarte).getLayers().getLength();
	sourceLgn = new ol.source.GeoJSON({
		projection: sm
	});
	sourceLgn.on('addfeature', function(event) {
		var feature = event.feature;
		if(feature.get('CODE')) feature.set('id',feature.get('CODE'));
	});

	ajouteLayerSwitcher(idcarte,'lignes_TRAM','#'+idcarte+' .layerSwitcher',{
		libelle:'Réseau Tag : Tram',
		initFct:function(){
			var layerLgnTram = ajouteLayerManuel('lignes_TRAM',idcarte,{indexLayer:insertAt,source:sourceLgn,fctStyle:function(f,res){return getStylesLgn(f,res,'TRAM')}});
			insertAt++;
			chargeGeomLigne(idcarte,typesLgn.TRAM.join(','),null,{fctDetails:getDetails,source:sourceLgn,chargeZA:false});
			return layerLgnTram;
		}
	});

	ajouteLayerSwitcher(idcarte,'lignes_CHRONO','#'+idcarte+' .layerSwitcher',{
		libelle:'Réseau Tag : Chrono',
		initFct:function(){
			var layerLgnChrono = ajouteLayerManuel('lignes_CHRONO',idcarte,{indexLayer:insertAt,source:sourceLgn,fctStyle:function(f,res){return getStylesLgn(f,res,'CHRONO')}});
			insertAt++;
			chargeGeomLigne(idcarte,typesLgn.CHRONO.join(','),null,{fctDetails:getDetails,source:sourceLgn,chargeZA:false});
			return layerLgnChrono;
		}
	});
	
	//var codesLgnFond = typesLgn.TRAM.concat(typesLgn.CHRONO);
	//chargeGeomLigne(idcarte,codesLgnFond.join(','),null,{fctDetails:getDetails,source:sourceLgn,chargeZA:false});
	
	ajouteLayerSwitcher(idcarte,'lignes_PROXIMO','#'+idcarte+' .layerSwitcher',{
		libelle:'Réseau Tag : Proximo',
		initFct:function(){
			var layerLgnProximo = ajouteLayerManuel('lignes_PROXIMO',idcarte,{indexLayer:insertAt,source:sourceLgn,fctStyle:function(f,res){return getStylesLgn(f,res,'PROXIMO')}});
			insertAt++;
			chargeGeomLigne(idcarte,typesLgn.PROXIMO.join(','),null,{fctDetails:getDetails,source:sourceLgn,chargeZA:false});
			return layerLgnProximo;
		}
	});
	
	ajouteLayerSwitcher(idcarte,'lignes_FLEXO','#'+idcarte+' .layerSwitcher',{
		libelle:'Réseau Tag : Flexo',
		initFct:function(){
			var layerLgnProximo = ajouteLayerManuel('lignes_FLEXO',idcarte,{indexLayer:insertAt,source:sourceLgn,fctStyle:function(f,res){return getStylesLgn(f,res,'FLEXO')}});
			insertAt++;
			chargeGeomLigne(idcarte,typesLgn.FLEXO.join(','),null,{fctDetails:getDetails,source:sourceLgn,chargeZA:false});
			return layerLgnProximo;
		}
	});
	ajouteLayerSwitcher(idcarte,'lignes_C38','#'+idcarte+' .layerSwitcher',{
		libelle:'Réseau Transisère',
		initFct:function(){
			var layerLgnProximo = ajouteLayerManuel('lignes_C38',idcarte,{indexLayer:insertAt,source:sourceLgn,fctStyle:function(f,res){return getStylesLgn(f,res,'C38')}});
			insertAt++;
			chargeGeomLigne(idcarte,typesLgn.C38.join(','),null,{fctDetails:getDetails,source:sourceLgn,chargeZA:false});
			return layerLgnProximo;
		}
	});
	ajouteLayerSwitcher(idcarte,'lignes_SNC','#'+idcarte+' .layerSwitcher',{
		libelle:'Réseau SNCF',
		initFct:function(){
			var layerLgnProximo = ajouteLayerManuel('lignes_SNC',idcarte,{indexLayer:insertAt,source:sourceLgn,fctStyle:function(f,res){return getStylesLgn(f,res,'SNC')}});
			insertAt++;
			chargeGeomLigne(idcarte,typesLgn.SNC.join(','),null,{fctDetails:getDetails,source:sourceLgn,chargeZA:false});
			return layerLgnProximo;
		}
	});
}

//--------------------------------------//
// getDetailsCovoiturage
//--------------------------------------//
function getDetailsCovoiturage(feature) {
	var details = '<div id="detailCov"><h5>'+feature.get('name') +'</h5>'+'<p>'+ feature.get('contenu')+'</p></div>';
	return '<p>'+details+'</p>';
}
//--------------------------------------//
// ajouteLayerCovoiturage
//--------------------------------------//
function ajouteLayerCovoiturage(nomLayer,idcarte) {
	try {
		var map = maps[idcarte];

		if (getLayer(idcarte,nomLayer)!=null) return;
		if (!sourceCov) {
			sourceCov = new ol.source.KML({
				url: url.json('cov'),
				projection: sm
			});
			sourceCov.on('addfeature', function(event) {
				var feature = event.feature;
				feature.set('contenu',feature.get('description'));
				feature.set('detailsCallback',getDetailsCovoiturage);
				feature.set('detailsSeul',true);
				feature.set('type','covoiturage');
				feature.set('commentaires',feature.get('description'));
				feature.set('description','Covoiturage');
				feature.setId(feature.get('name'));
				feature.set('LIBELLE',feature.get('name'));
			});
				
			var idEvt =null;
			idEvt = sourceCov.on('change', function() {
				switch (sourceCov.getState()) {
				case 'ready':
					sourceCov.unByKey(idEvt);
					$( document ).trigger( 'evtSourceChargee', 'covoiturage' );
					break;
				case 'error':
					sourceCov.unByKey(idEvt);
					console.log('source loaded error');
					break;
				}
			});

		}
		var covLayer = new ol.layer.Vector({
			id: nomLayer,
			visible:false,
			source: sourceCov,
		});
		map.addLayer(covLayer);

		return covLayer;
	} catch(e) {
		console.error(e.lineNumber+' : '+e.message);
	}
}

//--------------------------------------//
// updateDynPkg
//--------------------------------------//
function updateDynPkg(idcarte,source) {
	var urlDynPkg = url.json('dPkg');
	if (!source) return;
	function successUpdate(doc,idcarte) {
		var map = maps[idcarte];
		
		var dateFichier = moment(doc.date, 'DD/MM/YYYY HH:mm').toDate();
		if (doc.features) {
			for (var i=0;i<doc.features.length;i++) {
			
				var type=doc.features[i].properties.TYPE;

				var feature = source.getFeatureById(type.toUpperCase() + '_' + doc.features[i].properties.CODE.toUpperCase());
				if (feature) {
					feature.set('nsv',doc.features[i].properties.NSV_ID);
					feature.set('dispo',doc.features[i].properties.DISPO);
					feature.set('recordTime',dateFichier);
				} else {
					//inutile car peut arriver si hors zone d'affichage
					//console.info('getFeatureById(' + type.toUpperCase() + '_' + doc.features[i].properties.CODE.toUpperCase() + ') not found') ;
				}
			}
		}
		//map.render();
		//source.changed();
		$( document ).trigger( "evtMajDynPopup", {type:'PKG', map:map});
		$( document ).trigger( "evtMajDynPopup", {type:'PAR', map:map});
	}
	$.ajax({
		type: "GET",
		url: urlDynPkg,
		success: function(data) {successUpdate(data,idcarte);},
		error:error,
		dataType:   'json'
	}).error(error);
}

//--------------------------------------//
// updateEvtTR
//--------------------------------------//
function updateEvtTR(idcarte,source,options) {
	var map = maps[idcarte];
	try {
		var searchUrl = (url.saisieChoisie=='local'?url.hostnameLocal+url.portWSTest:url.hostnameData);
		searchUrl += '/api/dyn/evtTR/json';

		$.ajax({
			type: "GET",
			url: searchUrl,
			error: error,
			dataType: 'json'
		}).then(function(data) {
			for (var code in evtCache) {
				evtCache[code].remove = true;
			}
			for (var code in data) {
				parseEvtTr(code,data[code],source,options);
				evtCache[code]={remove:false};
			}
			for (var code in evtCache) {
				if(evtCache[code].remove) {
					source.removeFeature(source.getFeatureById(code));
					delete evtCache[code];
				}
			}
			$( document ).trigger( "evtMajDyn", 'evtTr' );
		});
		

	} catch(e) {
		console.error(e.lineNumber+' : '+e.message);
	}
}

//--------------------------------------//
// parseEvtTr
//--------------------------------------//
function parseEvtTr(code,evt,source,options) {
	if (!options) options = {};

	var nat = evt.type;
	//var ssnat = $(this).find('SsNat').text().toLowerCase();
	//? var loc = $(this).find('Loc').text();
	var id = code;
	var details = urlify(evt.texte).replace(/\|/g,'<br>');
	var ddeb = moment(evt.dateDebut,'DD/MM/YYYY HH:mm:ss');
	var dfin = moment(evt.dateFin,'DD/MM/YYYY HH:mm:ss');
	var hdeb = (evt.heureDebut=='00:00:00'?false:evt.heureDebut);
	var hfin = (evt.heureFin=='00:00:00'?false:evt.heureFin);
	var we = evt.weekEnd;
	details += (hdeb?'<br>De '+hdeb:'');
	details += (hfin?' à '+hfin:'');
	details += (we=='0'?' en semaine.':'');
	details += (we=='1'?' le week-end.':'');
	var now  = moment(urlParams.heure);
	var dansPeriode = now.isAfter(ddeb) && now.isBefore(dfin);
	nowHeure = now.format('HH:mm:ss');
	var bWE = ((we=='1' && (now.day()==0 || now.day()==6)) || (we=='0' && (now.day()>0 && now.day()<6)) || we=='2');
	var bHeure = (!hdeb || !hfin || (hdeb > hfin && hdeb > nowHeure && nowHeure > hfin) || (hdeb < hfin && !(nowHeure > hfin) && !(nowHeure < hdeb)));
	var enCours = dansPeriode && bWE && bHeure;

	var bientot = moment(urlParams.heure).add(1, 'days').isAfter(ddeb) && !now.isAfter(ddeb);
	var periode = {enCours:enCours,dansPeriode:dansPeriode,bientot:bientot};
	var geom = new ol.geom.Point(ol.proj.transform([parseFloat(evt.longitude),parseFloat(evt.latitude)], gg, sm));
	var feature = source.getFeatureById(id);
	if (!feature) {
		feature = new ol.Feature({
			'id':id,
			'geometry': geom,
			'CODE': id,
			'description':lang.perturbations,
			'type':'evtTr',
			'nat':nat,
			//'ssnat':ssnat,
			'zidx':500
		});
		feature.setId(id);
		if (options.detailsCallback) feature.set("detailsCallback",options.detailsCallback);
		if (options.detailsSeul) feature.set("detailsSeul",options.detailsSeul);
		source.addFeature(feature);
	} else {
		if (geom.getCoordinates() != feature.get('geometry').getCoordinates()) {
			feature.set('geometry',geom);
		}
	}
	feature.set('contenu','<p>'+details+'</p>');
	//?feature.set('loc',loc);
	feature.set('dateAffichee',urlParams.heure);
	feature.set('visible',periode.dansPeriode||periode.bientot);
	feature.set('periode',periode);
	
}

//--------------------------------------//
// getStylesEvt
//--------------------------------------//
function getStylesEvt(feature,resolution) {
	var nat = feature.get('nat');
	var dateAfficheeFeature = feature.get('dateAffichee');
	if (urlParams.heure != dateAfficheeFeature) {
		var periode;
		if(feature.get('timePeriods'))
			periode = getPeriode(feature.get('timePeriods'),urlParams.heure);
		else
			periode = feature.get('periode');
		feature.set('dateAffichee',urlParams.heure);
		feature.set('visible',periode.dansPeriode||periode.bientot);
		feature.set('periode',periode);
	}
	var bFiltre = (filtreTypeEvt==nat || filtreTypeEvt == 'type') && (filtreCodeEvt==feature.get('CODE').substr(0,3) || filtreCodeEvt == 'code');
	
	if(!feature.get('visible') || !bFiltre) return [];
	var transp = feature.get('periode').bientot || (!feature.get('periode').enCours);

	if(!styleCache['evtIcon_'+nat+'_'+transp]) {
		var optimage = eval('icone'+nat);
		if (transp) 
			optimage.opacity=0.6;
		else
			optimage.opacity=1;
		styleCache['evtIcon_'+nat+'_'+transp] = new ol.style.Style({
				image: new ol.style.Icon(optimage)
			});
	}
	
	return [styleCache['evtIcon_'+nat+'_'+transp]];
}

//--------------------------------------//
// updateDynTrr
//--------------------------------------//
function updateDynTrr(nomLayer,idcarte,type,source) {
	updateDyn(nomLayer,idcarte,'trr',sourceTrr);
}

//--------------------------------------//
// updateDynTrrC38
//--------------------------------------//
function updateDynTrrC38(nomLayer,idcarte,type,source) {
	updateDyn(nomLayer,idcarte,'trrC38',sourceTrr);
}

//--------------------------------------//
// updateDynPmv
//--------------------------------------//
function updateDynPmv(idcarte,source) {
	updateDyn('PMV',idcarte,'PMV',source);
}

//--------------------------------------//
// updateDyn
//--------------------------------------//
function updateDyn(nomLayer,idcarte,type,source) {
	var map = maps[idcarte];
	var type = type;
	var source = source;
	try {
		var searchUrl = (url.saisieChoisie=='local'?url.hostnameLocal+url.portWSTest:url.hostnameData);
		searchUrl += '/api/dyn/'+type+'/json';

		$.ajax({
			type: "GET",
			url: searchUrl,
			error: error,
			dataType: 'json'
		}).then(function(data) {
			//map.render();
			parseDyn(type,source,data,map);
		});
	} catch(e) {
		console.error(e.lineNumber+' : '+e.message);
	}
}

//--------------------------------------//
// parseDyn
//--------------------------------------//
function parseDyn(type,source,data,map) {
	var features = source.getFeatures();
	for (var code in data) {
		var d = data[code][data[code].length-1];
		var id;
		if(type == 'omms')
			id = type + '_' + code.toUpperCase();
		else if(type != 'trr' && type != 'ligne' && type != 'omms' && type != 'PME')
			id = type.toUpperCase() + '_' + code.toUpperCase();
		else
			id = code;
		var f = source.getFeatureById(id);
		if (f && d) {
			if (f.get('CODE') == code) {
				var date = new Date(d.time);
				f.set('DATE',date);
				f.set('recordTime',date);
				if (typeof(d.dispo)!='undefined') f.set('dispo',d.dispo);
				if (typeof(d.messages)!='undefined') f.set('messages',d.messages);
				if (f.get('nsv') != d.nsv_id) {
					f.set('nsv',parseInt(d.nsv_id));
					f.getGeometry().changed();
				}
				//HaMo
				if (typeof(d.comsAvailable)!='undefined') f.set('comsAvailable',d.comsAvailable);
				if (typeof(d.iRoadAvailable)!='undefined') f.set('iRoadAvailable',d.iRoadAvailable);
				if (typeof(d.parking_space_free)!='undefined') f.set('parking_space_free',d.parking_space_free);
				if (typeof(d.available_car)!='undefined') f.set('available_car',d.available_car);
			}
		}
	}
	if (!urlParams.debug) {
		for (var j=0;j<features.length;j++) {
			var obj = features[j];
			if(type==obj.get('type')) {
				//si c'est trop vieux
				dateFeature = obj.get('DATE');
				if (!dateFeature || Math.abs(urlParams.heure.getTime() - dateFeature.getTime()) > 24*60*1000) {
					obj.set('nsv',0);
					obj.getGeometry().changed();
				}
			}
		}
	}
	$( document ).trigger( "evtMajDyn", type );
	if(type =='PAR' || type =='PMV' || type =='CAM' || type =='omms') $( document ).trigger( "evtMajDynPopup", {type:type, map:map} );
}

//--------------------------------------//
// getStylesTrr
//--------------------------------------//
function getStylesTrr(feature,resolution) {
	if  ((feature.get('NIVEAU')!=-1) && ((feature.get('NIVEAU')==1 && resolution >= 10 )|| (feature.get('NIVEAU')==0 && resolution < 10 ))) return null;

	var nsv = feature.get('nsv');
	if (typeof(nsv) == "undefined") {
		nsv=0;
		feature.set('nsv',nsv);
	}
	var color;
	if (nsv==0) return;
	if (nsv==1) color= VERT;
	else if (nsv==2) color= ORANGE;
	else if (nsv==3) color= ROUGE;
	else if (nsv==4) color= '#000000';
	else {
		console.log('nsv incorrect : '+ nsv);
		return [];
	}
	
	if(!styleCache['trrFond_'+nsv]) {
		styleCache['trrFond_'+nsv] = new ol.style.Style({
			stroke:new ol.style.Stroke({
			color: '#000000',
			width: 5,
			opacity: 1
			}),
			zIndex: 1+nsv
		});
	}
	if(!styleCache['trrCouleur_'+color+'_'+nsv]) {
		styleCache['trrCouleur_'+color+'_'+nsv] = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: color,
				width: 3,
				opacity: 1
			}),
			zIndex: 2+nsv
		});
	}
	
	return styles = [
		styleCache['trrFond_'+nsv],
		styleCache['trrCouleur_'+color+'_'+nsv]
	];	
}


//--------------------------------------//
// chargeTrr
//--------------------------------------//
function chargeTrr(idcarte,source,niveau) {
	var map = maps[idcarte];
	var searchUrl =(url.saisieChoisie=='local'?url.hostnameLocal+url.portWSTest:url.hostnameData);
		searchUrl += '/api/troncons/poly?';
		if (niveau == 0 || niveau == 1) {
			searchUrl += 'niveau='+niveau;
			if (niveau == 0) {
				var idEvt = map.getView().on('change:resolution',function(e){
					if(e.oldValue < 20) {
						map.getView().unByKey(idEvt);
						chargeTrr(idcarte,source,1);
					}
				});
			}
		}

	$.ajax({
		type: "GET",
		url: searchUrl,
		error:error,
		dataType: 'json'
	}).then(function(response) {
		
		var format = new ol.format.Polyline({});
		response.features.forEach(function (feature){
			var coord = format.readGeometry(feature.properties.shape,{dataProjection:gg,featureProjection:sm}).getCoordinates();
			var geom = new ol.geom.LineString(coord);
			var id = feature.properties.CODE;
			var opt = feature.properties;
			opt.geometry = geom;
			var f = new ol.Feature(opt);
			f.setId(id);
			source.addFeature(f);
			});
		
		$( document ).trigger( 'evtSourceChargee', 'trr' );
	});
}

//--------------------------------------//
// chargeTrrC38
//--------------------------------------//
function chargeTrrC38(idcarte,source) {
	var map = maps[idcarte];
	var searchUrl =(url.saisieChoisie=='local'?url.hostnameLocal+url.portWSTest:url.hostnameData);
		searchUrl += '/api/dyn/trrC38/json?';

	$.ajax({
		type: "GET",
		url: searchUrl,
		error:error,
		dataType: 'json'
	}).then(function(response) {
		var format = new ol.format.Polyline({});
		Object.keys(response).forEach(function (l){
			var feature = response[l][0];
			var coordTab = [];
			feature.shape.forEach(function (s){
				var coord = format.readGeometry(s,{dataProjection:gg,featureProjection:sm}).getCoordinates();
				coordTab.push(coord);
			});
			var g = new ol.geom.MultiLineString(coordTab);
			var f = new ol.Feature({geometry:g});
			var id = feature.CODE;
			f.set('nsv',feature.nsv_id);
			f.set('time',feature.time);
			f.set('CODE',id);
			f.set('type','troncon');
			f.set('NIVEAU','-1');
			f.setId(id);
			source.addFeature(f);
		});
		
		$( document ).trigger( 'evtSourceChargee', 'trrC38' );
	});
}

//--------------------------------------//
// getStylesIti
//--------------------------------------//
function getStylesIti(feature,resolution,c) {
	var styles;
	var i = feature.get('iti');
	var j = feature.get('leg');
	var k = feature.get('stop');
	//var type = feature.get('type');
	if (!isLegAffiche(i,j)) {
		return false;
	}
	var leg=getLeg(i,j);
	var maxRes = 5;
	var image;
	var text='';
	var color='#FFFFFF';
	text=(leg.from.name?leg.from.name.capitalize():'');
	if (leg.mode=='BUS' ||leg.mode=='TRAM' || leg.mode=='RAIL') {
		color='#'+leg.routeColor;
		image= iconebus;
		maxRes=35;
		if (feature.get('type')=='intermediate') {
			text = getShortStopName(leg.intermediateStops[k].name.capitalize());
			maxRes = 5;
		}	
	} else if (leg.mode=='CABLE_CAR'){
		color='#80ffff';
		image= iconebulle;
	} else if (leg.mode=='BICYCLE'){
		color='#50AE2F';
		image= iconevelo;
	} else if (leg.mode=='WALK'){
		color='#0000FF';
		image= iconepieton;
	} else if (leg.mode=='CUSTOM_MOTOR_VEHICLE'){
		color='#009CD3';
		image= iconeiroad;
		maxRes=35;
	} else if (leg.mode=='CAR'){
		color='#FF0000';
		image=iconevoiture;
	}
	if (feature.getGeometry().getType() == 'MultiLineString' || feature.getGeometry().getType() == 'LineString') {
		if (!styleCache['styleLigne_'+color]) {
			styleCache['styleLigne_'+color] = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: color,
					width: 5,
					opacity: 1,
					zIndex: 200
				}),
				zIndex: 200
			});
		}
		
		styles = [styleCache['styleLigne_'+color]] ;
		
			
	} else if (feature.getGeometry().getType() == 'Point') {
		if (!styleCache['stylePoint_'+leg.mode+text]) {
				styleCache['stylePoint_'+leg.mode+text] = new ol.style.Style({
					zIndex: 300,
					image: image,
					text: new ol.style.Text({
						font: '12px Arial,Calibri,sans-serif',
						text: text,
						textAlign:'start',
						textBaseline:'middle',
						offsetX:16,
						offsetY:20,
						//scale:1,
						fill: new ol.style.Fill({
							color: 'rgba(0, 0, 0, 1)'
						}),
						stroke: new ol.style.Stroke({
							color: '#ffffff',
							width: 3
						})
					})			
				});
			}
			styles = resolution < maxRes ? [styleCache['stylePoint_'+leg.mode+text]] : [];
		}
	return styles ;

}

//--------------------------------------//
// $( document ).on( "evtPopupOuverte", {}, function( event, map )
//--------------------------------------//
$( document ).on( "evtPopupOuverte", {}, function( event, map ) {
	if (majPopupInterval) window.clearInterval(majPopupInterval);
	majPopup(map);
	majPopupInterval = window.setInterval(function() {majPopup(map);}, 60000);
});

//--------------------------------------//
// $( document ).on( "evtPopupFermee", {}, function( event, map )
//--------------------------------------//
$( document ).on( "evtPopupFermee", {}, function( event, map ) {
	window.clearInterval(majPopupInterval);
	majPopupInterval = null;
});

//--------------------------------------//
// majPopup
//--------------------------------------//
$( document ).on( "evtMajDynPopup", {}, function( event, data ) {
	
	var popupSelector = data.map.popupSelector;
	var typePopup = $(popupSelector + ' .PopupDetails-detailsCallback .dyn').attr('data-type');
	if( typePopup != data.type && typePopup != data.type.substr(0,4)) return;
	
	var upToDate = true;
	
	var id = $(popupSelector + ' .PopupDetails-detailsCallback').attr('data-id');
	
	if(data.type.substr(0,4)=='omms') {
		//var f = sourceOmms.getFeatureById(id);
		var f = sourcePoints.getFeatureById(id);
		if (f && f.get('recordTime')) {
			upToDate = (Math.abs(urlParams.heure.getTime() - f.get('recordTime').getTime()) <= 1000*60*24) || urlParams.debug;
			if (upToDate) {
				$(popupSelector + ' .bs-picto-car').html(f.get('available_car'));
				$(popupSelector + ' .bs-picto-park').html(f.get('parking_space_free'));
				var bDispo = f.get('iRoadAvailable')!=2;
				var dispo = (bDispo?lang.carteMobile.etatDisponible:lang.carteMobile.etatNonDisponible);
				$(popupSelector + ' .bs-picto-iroad').html(dispo);
				if(bDispo && $(popupSelector + ' .background-iroad-pas-dispo').length > 0) {
					$(popupSelector + ' .background-iroad-pas-dispo').addClass('background-iroad-dispo').removeClass('background-iroad-pas-dispo');
				}
				if(!bDispo && $(popupSelector + ' .background-iroad-dispo').length > 0) {
					$(popupSelector + ' .background-iroad-dispo').addClass('background-iroad-pas-dispo').removeClass('background-iroad-dispo');
				}
				var bDispo = f.get('comsAvailable')!=2;
				var dispo = (bDispo?lang.carteMobile.etatDisponible:lang.carteMobile.etatNonDisponible);
				$(popupSelector + ' .bs-picto-comms').html(dispo);
				if(bDispo && $(popupSelector + ' .background-comms-pas-dispo').length > 0) {
					$(popupSelector + ' .background-comms-pas-dispo').addClass('background-comms-dispo').removeClass('background-comms-pas-dispo');
				}
				if(!bDispo && $(popupSelector + ' .background-comms-dispo').length > 0) {
					$(popupSelector + ' .background-comms-dispo').addClass('background-comms-pas-dispo').removeClass('background-comms-dispo');
				}
			}
		}
	}
	if(data.type == 'PKG' || data.type == 'PAR') {
		var f = sourcePoints.getFeatureById(id);
		if (f && f.get('recordTime')) {
			upToDate = (Math.abs(urlParams.heure.getTime() - f.get('recordTime').getTime()) <= 1000*60*24) || urlParams.debug;
			upToDate = (upToDate && f.get('dispo') != -1) || urlParams.debug;
			var dispo = (upToDate?f.get('dispo'):''); 
			$(popupSelector + ' .dyn .dispo').html(dispo);
		} else {
			upToDate = false;
		}
	}
	if(data.type == 'PMV') {
		var f = sourcePoints.getFeatureById(id);
		if (f && f.get('recordTime')) {
			upToDate = (Math.abs(urlParams.heure.getTime() - f.get('recordTime').getTime()) <= 1000*60*24) || urlParams.debug;
			upToDate = (upToDate && f.get('messages') != lang.carteMobile.messagePMV) || urlParams.debug;
			var details = '';
			if (upToDate) {
				var messages = f.get('messages').replace(/\|/gi,'');
				messages = messages.split('$');
				for (var j=0;j<messages.length;j++) {
					details+='<p>'+messages[j]+'</p>';
				}
			}
			$(popupSelector + ' .dyn').html(details);
		}
	}
	
	$(popupSelector + ' .PopupDetails-detailsCallback .dyn').toggleClass('dynVide',!upToDate);
	
	if(data.type == 'CAM') {
		var f = sourcePoints.getFeatureById(id);
		if (f) {
			upToDate = (f.get('nsv') == 1);
			var searchUrl;
			var details = '';
			if (upToDate) {
				
				searchUrl = (url.saisieChoisie=='local'?url.hostnameLocal+url.portWSTest:url.hostnameData);
				searchUrl += '/api/cam/time?';
				searchUrl += 'name=' + f.get('CODE') + '.mp4&key='+ Math.random();
				
				$.ajax({
					type: "GET",
					url: searchUrl,
					error:error,
					dataType: 'json'
				}).then(function(response) {
					upToDate = (Math.abs(urlParams.heure.getTime() - response*1000) <= 1000*60*24) || urlParams.debug;
					
					if (upToDate) {
						searchUrl = (url.saisieChoisie=='local'?url.hostnameLocal+url.portWSTest:url.hostnameData);
						searchUrl += '/api/cam/video?name=' + f.get('CODE') + '.mp4&key='+ Math.random();
						details = '<video width="320" height="240" controls loop><source src="' + searchUrl + '" type="video/mp4">' + lang.carteMobile.messageCAM + '</video>';
					} else {
						details='<p>'+lang.carteMobile.messageCAM+'</p>';
					}
					$(popupSelector + ' .dyn').html(details);
				});
			}
			
			}
			$(popupSelector + ' .PopupDetails-detailsCallback .dyn').toggleClass('dynVide',false);
		}
});

//--------------------------------------//
// majPopup
//--------------------------------------//
function majPopup(map) {
	urlParams.heure = new Date;
	var typePopup = $(map.popupSelector + ' .PopupDetails-detailsCallback .dyn').attr('data-type');
	if(typePopup == 'PKG') updateDynPkg('map',sourcePoints);
	if(typePopup == 'PMV') updateDynPmv('map',sourcePoints);
	if(typePopup == 'CAM') $( document ).trigger( "evtMajDynPopup", {type:'CAM', map:map} );
	if(typePopup == 'PAR') $( document ).trigger( "evtMajDynPopup", {type:'PAR', map:map} );
	if(typePopup == 'omms') $( document ).trigger( "evtMajDynPopup", {type:'omms', map:map} );
}

//--------------------------------------//
// modififieIconMaxres
//--------------------------------------//
function modififieIconMaxres() { //fonction surchargée pour les appli mobile
	for (var e in stylesTypes) {
		if (stylesTypes[e].iconMaxres < 20)stylesTypes[e].iconMaxres = 20;
	};
}

//--------------------------------------//
// placePosition
//--------------------------------------//
function placePosition(pos,idcarte,layerName,typeDep) {
	var layer = getLayer(idcarte,layerName);
	var source =layer.getSource();
	var f = source.getFeatureById(typeDep);
	var geom = new ol.geom.Point(ol.proj.transform([pos.coords.longitude,pos.coords.latitude], gg, sm));
	if (!f) {
		var fe = new ol.Feature({
			'geometry': geom,
			'typeDep':typeDep,
			'type':typeDep
		});
		fe.setId(typeDep);
		source.addFeature(fe);
		source[typeDep]=fe;
	} else {
		f.setGeometry(geom);
		source[typeDep]=f;
	}
}

//--------------------------------------//
// posSucces
//--------------------------------------//
function posSucces(position,mapName,layerName){
	fct_attente_horaires(false);
	if (estDansRectangle(position.coords.longitude, position.coords.latitude)) {
		var map=getMap(mapName);
		placePosition(position,mapName,layerName,'search')
		map.getView().setCenter(ol.proj.transform([position.coords.longitude,position.coords.latitude], gg, sm));
		map.getView().setZoom(15);
	} else {
		alert(lang.alerteHorsRectangle);
	}
}

//--------------------------------------//
// posErreur
//--------------------------------------//
function posErreur(error){
	fct_attente_horaires(false);
	var info = lang.erreurPosition[0];
	switch(error.code) {
		case error.TIMEOUT:
			info += lang.erreurPosition[1];
		break;
		case error.PERMISSION_DENIED:
		info += lang.erreurPosition[2];
		break;
		case error.POSITION_UNAVAILABLE:
			info += lang.erreurPosition[3];
		break;
		default:
			info += lang.erreurPosition[4];
		break;
	}
	alert(info);
}

//--------------------------------------//
// onLocalize
//--------------------------------------//
function onLocalize(options){
	navigator.geolocation.getCurrentPosition(function(pos) {posSucces(pos,options.mapName,options.layerName);} ,posErreur,{ maximumAge: 10000, timeout: 10000, enableHighAccuracy:true });
	fct_attente_horaires(true);
}
