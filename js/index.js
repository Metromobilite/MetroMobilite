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

if (typeof(calculateurpresent) == 'undefined') calculateurpresent = false;
if (urlParams.iFrame){
	$("body").attr('style','padding-top:0px;');
	$(".main").attr('style','top:0px');
	$.support.cors = true;
	initIndex();
} else {
	if(typeof(pageStatique)=='undefined') {
		$('#head').load('head.html',initIndex);
	}
}

//----------------------------------------------------------------------------
// Methode        : $('.item-*').click()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//----------------------------------------------------------------------------
function initIndex(){
	var nomPage = "";
	if(!urlParams.page && !(isTaille('xs') || isTaille('xxs'))) 
		$('#panel-actu').load('pages/actus.html');

	if (urlParams.page) {
		$('.rownav, .rowActualite, .actu, .rowIti, .main-fluid, .actu-fluid').hide();

		if (urlParams.page == 'Evts') $('#rowPage').load('pageEvts.html',function() { $('.rowEvts').show();});
		if (urlParams.page == 'Actu') $('#rowPage').load('pages/pageActu.html',function() { $('.rowActu').show();});
		if (urlParams.page == 'DecouvrirM') $('#rowPage').load('pages/pageDecouvrirM.html',function() { $('.rowActu').show();});
		if (urlParams.page == 'Velo') $('#rowPage').load('pages/pageVelo.html',function() { $('.rowVelo').show();});
		if (urlParams.page == 'TC') $('#rowPage').load('pages/pageTC.html',function() { $('.rowTC').show();});
		if (urlParams.page == 'Voiture') $('#rowPage').load('pages/pageVoiture.html',function() { $('.rowVoiture').show();});
		if (urlParams.page == 'Pied') $('#rowPage').load('pages/pagePied.html',function() { $('.rowPied').show();});
		if (urlParams.page == 'Pmr') $('#rowPage').load('pages/pagePMR.html',function() { $('.rowPmr').show();});
		if (urlParams.page == 'Pollution') $('#rowPage').load('pages/pagePollution.html',function() { $('.rowPollution').show();});
		if (urlParams.page == 'EmissionCO2') $('#rowPage').load('pages/pageEmissionCO2.html',function() { $('.rowEmissionCO2').show();});
		if (urlParams.page == 'Conditions') $('#rowPage').load('Conditions.html',function() { $('.rowConditions').show();});
		if (urlParams.page == 'OpenData') $('#rowPage').load('pages/OpenData.html',function() { $('.rowOpenData').show();});

		nomPage = urlParams.page;
		addBackToTop();
	} else {
		testCalculateurPresent(false);
	}
	if (nomPage == "")
		trackPiwik("MetroMobilité : index.html");
	else
		trackPiwik("MetroMobilité : " + nomPage + ".html");

}

//----------------------------------------------------------------------------
// Methode        : $(document).ready
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
$(document).ready(function() {
	var anchor = window.location.hash;
	window.location.hash = anchor;
})
//----------------------------------------------------------------------------
// Methode        : $('.item-*').click()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
$('.item-plan').click(function(){window.location='planTC.html';});
$('.item-voiture').click(function(){window.location='trafic.html';});
$('.item-velo').click(function(){window.location='velo.html';});
$('.item-horaires').click(function(){window.location='horaires.html';});
$('.item-passages').click(function(){window.location='prochainsPassages.html';});
$('.item-conseils').click(function(){window.location='planTitresTag.html?agenceM=true';});


//----------------------------------------------------------------------------
// Methode        : addBackToTop()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
function addBackToTop() {
	var appended = false;
	onscroll = function() {
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	if (scrollTop > 250) {
		if (!appended) {
			$('#btn_up').show();
			appended = true;
		}
	} else if (appended) {
			$('#btn_up').hide();
			appended = false;
		}
	};
}

//----------------------------------------------------------------------------
// Methode        : $('.containerIti')
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//----------------------------------------------------------------------------

$('.containerIti').click(function(){
	$('#calculer').click();
});

$('#div-Iti .input-group').click(function(){ //Empeche la remontÃ©e du click sur la carte et l'envoi vers le calculateur.
	return false;
}
	);

$(".hasclear").keyup(function () {
    var t = $(this);
    t.nextAll('.saisie_clear').toggle(Boolean(t.val()));
});
$(".saisie_clear").hide($(this).prevAll('input').val());
$(".saisie_clear").click(function () {
    $(this).prevAll('input').val('').focus();
    $(this).hide();
});
//----------------------------------------------------------------------------
// Methode        : $('#calculer').click()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//----------------------------------------------------------------------------
$('#calculer').click(function(){
	
	if (($('#dep').attr('data-lonlat') == $('#arr').attr('data-lonlat')) && ($('#dep').attr('data-lonlat') != "0,0")) {
		alert(lang.alert[1]);
		return;
	}

	var loc='iti.html';
	loc+='?dep='+$('#dep').val();
	loc+='&arr='+$('#arr').val();
	loc+='&lonlatDep='+$('#dep').attr('data-lonlat');
	loc+='&lonlatArr='+$('#arr').attr('data-lonlat');
	loc+='&communeDep='+$('#dep').attr('data-commune');
	loc+='&communeArr='+$('#arr').attr('data-commune');
	
	if (urlParams.otp!='prod') loc+="&otp="+urlParams.otp;
	if(urlParams.debug) loc+="&debug=true";

	window.location=loc;
	return false;
});

//----------------------------------------------------------------------------
// Methode        : testCalculateurPresent
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
function testCalculateurPresent(asyncOrSync) {
	try {
		var searchUrl = url.otp()+'/serverinfo';

		$.ajax({
			async : asyncOrSync,
			//type: 'GET',
			url : searchUrl,
			dataType : 'jsonp',
			contentType: "application/json; charset=utf-8",
			statusCode: {
				404: function(xhr, ajaxOptions, thrownError) {
					console.info('4) xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + 'thrownError : '+thrownError);
					calculateurpresent = false;
					return rep;}
			},
			error : function (xhr, ajaxOptions, thrownError) {
					console.info('5) xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + 'thrownError : '+thrownError);
					calculateurpresent = false;
			},
			success : function (data) {
				$("#div-Iti").show();
				calculateurpresent = true;
			}
		}).error(function (xhr, ajaxOptions, thrownError) {
			console.info('6) xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + 'thrownError : '+thrownError);
		});
	} catch (e) {
		//alert(e);
	}
}

//----------------------------------------------------------------------------
// Methode        : fctSaisieReussie(idInput,item)
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
function fctSaisieReussie(idInput,item) {
	$(idInput).attr('data-lonlat',item.lat+','+item.lon);
	$(idInput).attr('data-commune',item.commune);
	$(idInput).attr('data-type',item.type);
	$(idInput).val(item.label);
	$(idInput).parents('.input-group').toggleClass('has-error',false);
	if(item.numeroNonTrouve) {
		$(idInput).parent().after('<span class="help-block help-'+idInput.substr(1)+'">'+lang.numeroNonTrouve+'</span>');
	} else {
		$('.help-'+idInput.substr(1)).remove();
	}
	
	setTimeout(function () {$(idInput).blur();}, 0); //cache le clavier sur mobile
	//setTimeout(function () {$("#calculer").focus();}, 0); //cache le clavier sur mobile
	
	return true;
}

//----------------------------------------------------------------------------
// Methode        : ajouteAutocomplete('#dep')
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
ajouteAutocomplete('#dep',{
	arrets:true,
	lieux:true,
	rues:true,
	fnSaisieReussie:function(item){ return fctSaisieReussie('#dep',item);},
	fnSaisieRatee:function(item){ 
		urlParams.lonlatDep='0,0'; 
		$('#dep').attr('data-lonlat','0,0');
	}
});

//----------------------------------------------------------------------------
// Methode        : ajouteAutocomplete('#arr')
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
ajouteAutocomplete('#arr',{
	arrets:true,
	lieux:true,
	rues:true,
	fnSaisieReussie:function(item){ return fctSaisieReussie('#arr',item);},
	fnSaisieRatee:function(item){ 
		urlParams.lonlatArr='0,0'; 
		$('#arr').attr('data-lonlat','0,0');
	}
});

//----------------------------------------------------------------------------
// Methode        : $('#contact-resize-full').click()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//----------------------------------------------------------------------------
$('#contact-resize-full').click(function(){

	$('#contact-resize-full').hide();
	$('#contact-resize-small').show();
	$('#div-entete-contact').show();
});

//----------------------------------------------------------------------------
// Methode        : $('#contact-resize-small').click()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//----------------------------------------------------------------------------
$('#contact-resize-small').click(function(){
	$('#contact-resize-full').show();
	$('#contact-resize-small').hide();
	$('#div-entete-contact').hide();	
});

//----------------------------------------------------------------------------
// Methode        : $('#submitBouton').click()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//--------------------------- -------------------------------------------------
$('#footer').on('click','#submitBouton',function(){
	if (($('#inputNom').val()=='') || ($('#inputMail').val()=='') || ($('#inputObjet').val()=='') || ($('#inputMessage').val()==" "))
	{
		if ($('#inputNom').val()=='') $('#inputNom').addClass("inputWarning");
		if ($('#inputMail').val()=='') $('#inputMail').addClass("inputWarning");
		if ($('#inputObjet').val()=='') $('#inputObjet').addClass("inputWarning");
		if ($('#inputMessage').val()=='') $('#inputMessage').addClass("inputWarning");
		alert('Merci de bien vouloir completer les informations.');
	}
	else
	{
		$('#inputNom').val();
		$('#inputMail').val();
		$('#inputObjet').val();
		$('#inputMessage').val();		
		var body ={mail: $('#inputMail').val(), name :$('#inputNom').val() , subject: $('#inputObjet').val(), text: $('#inputMessage').val() };
		//envoi des mails contact via le serveur /// au lieu de mailto existant
		/*var formattedBody = $('#inputMessage').val() + '\n\nNom: ' + $('#inputNom').val() + '\nMail: ' + $('#inputMail').val();
		var mail = "mailto:contact@metromobilite.fr?subject=" + $('#inputObjet').val() + "&body=" + encodeURIComponent(formattedBody);
		location.href = mail;
		//return false;*/
		
		var urlContact = url.ws();
		urlContact += '/api/contact/mail';
		$.ajax({
			  type: "POST",
			  url: urlContact,
			  data: JSON.stringify(body),
			  success:  function(response){
				console.log('response.status succes : => ', response.status);
				if ( response.status == '200' ) {
					$('#submitBouton').prop('disabled', true); 		
					$('#inputNom').val("");	
					$('#inputMail').val("");
					$('#inputObjet').val("");					 
					$('#successendmessage').css("color" ,"green");
					$('#successendmessage').show();
				}
			  },
			   error: function (request, error) {
				   console.log('response.status erreur : => ', response.status);
					if ( response.status == '500' ) {
						$('#erreursendmessage').css("color" ,"red"); 
						$('#erreursendmessage').show();
					}
				},
			  dataType:'json',
			  contentType:'application/json'
		}); 	 
	}	
//$('#submitBouton').prop('disabled', true);
});

	$('#inputNom').bind("input",function(){
		$('#submitBouton').attr('disabled', false); 	
		$('#successendmessage').hide();	  
		$('#erreursendmessage').hide();
    });

	$('#inputMail').bind('input', function() {
		$('#submitBouton').attr('disabled', false); 
		$('#successendmessage').hide();
		$('#erreursendmessage').hide();
	});
	
	$('#inputObjet').bind('input', function() {
      $('#submitBouton').attr('disabled', false); 
	  $('#successendmessage').hide();	 
	  $('#erreursendmessage').hide();
	});
	
	$('#inputMessage').bind('input', function() {
      $('#submitBouton').attr('disabled', false); 
	  $('#successendmessage').hide();	 
	  $('#erreursendmessage').hide();
	});
	
//----------------------------------------------------------------------------
// Methode        : $('#image-plan-contact').click()
// Description    : 
// Paramètres     : 
// Valeur retour  : 
//----------------------------------------------------------------------------
$('#footer').on('click','#image-plan-contact',function(){

	var loc='iti.html?arr=AGENCE M STATIONMOBILE&lonlatArr=45.180159,5.713812&communeArr=GRENOBLE';

	if (urlParams.otp!='prod') loc+="&otp="+urlParams.otp;
	if(urlParams.debug) loc+="&debug=true";

	window.location=loc;
});