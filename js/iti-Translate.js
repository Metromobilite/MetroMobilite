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

function translate() {

	$('#panel-heading-itineraire > h6').text(lang.iti.itineraire);
	$("#dep").prop({placeholder: lang.iti.stopDepart});
	$("#arr").prop({placeholder: lang.iti.stopArrivee});
	$("#iti-params-inverse").prop({title: lang.iti.retour, alt: lang.iti.retour});
	$('#rowOptions h5').empty().append("<span class='glyphicon glyphicon-chevron-down'></span>" + lang.iti.plusOptions);
	$('#ap_av option[value="D"]').text(lang.iti.apres);
	$('#ap_av option[value="A"]').text(lang.iti.avant);
	$('#calculer').empty().append('<span class="glyphicon glyphicon-search"></span>' + lang.iti.calculer);
	$("#panel-heading-resultats-precedent").prop({title: lang.iti.resultatsPrecedent, alt: lang.iti.resultatsPrecedent});
	$('#iti-resultat').text(lang.iti.resultats);
	$('#iti-dep-prec').text(lang.iti.departPrecedent);
	$("#resultat-detail").prop({title: lang.iti.trajetDetail, alt: lang.iti.trajetDetail});
	$('#resultat-trafic').empty().append(lang.iti.trafic + '<a href="#"></a>');
	$('.WALK  >figure img').prop({title: lang.iti.pieton, alt: lang.iti.pieton});
	$('.BICYCLE  >figure img').prop({title: lang.iti.velo, alt: lang.iti.velo});
	$('.BUS .TRAM .RAIL >figure img').prop({title: lang.iti.transportCommun, alt: lang.iti.transportCommun});
	$('.CABLE_CAR  >figure img').prop({title: lang.iti.teleferique, alt: lang.iti.teleferique});
	$('.CAR  >figure img').prop({title: lang.iti.voiture, alt: lang.iti.voiture});

	$('#imgPieton').prop({title: lang.iti.pieton, alt: lang.iti.pieton});
	$('#imgPmr').prop({title: lang.iti.pmr, alt: lang.iti.pmr});

	$('#transit > img').prop({title: lang.iti.transportCommun, alt: lang.iti.transportCommun});
	$('#transit_pmr > img').prop({title: lang.iti.transportCommun, alt: lang.iti.transportCommun});
	$('#logoModeTC').prop({title: lang.iti.transportCommun, alt: lang.iti.transportCommun});
	$('#bike > img').prop({title: lang.iti.velo, alt: lang.iti.velo});
	$('#logoModeVelo').prop({title: lang.iti.velo, alt: lang.iti.velo});
	$('#walk > img').prop({title: lang.iti.pieton, alt: lang.iti.pieton});
	$('#logoModePieton').prop({title: lang.iti.pieton, alt: lang.iti.pieton});
	$('#pmr > img').prop({title: lang.iti.pmr, alt: lang.iti.pmr});
	$('#car > img').prop({title: lang.iti.voiture, alt: lang.iti.voiture});
	$('#logoModeVoiture').prop({title: lang.iti.voiture, alt: lang.iti.voiture});
	$('#wait').prop({title: lang.iti.recheercheEnCours, alt: lang.iti.recheercheEnCours});

	$("#panel-footer-resultats-suivant").prop({title: lang.iti.prochainsResultats, alt: lang.iti.prochainsResultats});
	$('#iti-dep-suiv').text(lang.iti.prochainsDeparts);
	$('#itiDetails-ret').text(lang.iti.retourResultats);
	$('#panel-heading-details > h6').text(lang.iti.detail);
	$('#detailFooter > a:nth-child(1)').text(lang.iti.voirCarte);
	$('#detailFooter > a:nth-child(2)').text(lang.iti.imprimerCarte);
	$('#detailFooter > a:nth-child(3)').text(lang.iti.gps);
}