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

	$('#titreHoraires').text(lang.horaires.horaires);
	$('#titrePPassage').text(lang.horaires.prochainArret);
	$('#horairesText').text(lang.horaires.selectPanel);
	$('#unselect').text(lang.horaires.toutDeselctionner);
	$('#listeLignesDesc').text(lang.horaires.clickOnTag);
	
	$('#descReseauTram').text(lang.horaires.fromTram);
	$('#descReseauChrono').text(lang.horaires.fromChrono);
	$('#descReseauProximo').text(lang.horaires.fromProximo);
	$('#descReseauFlexo').text(lang.horaires.fromFlexo);
	$('#descReseauNav').text(lang.horaires.descReseauNav);
	$("#timesync button").prop({  alt: lang.horaires.update,  title: lang.horaires.update});
}