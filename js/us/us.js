// *
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
var lang = {
	pointCarte:"Seized map",
	maPosition:"My position",
	rafraichir:"Refresh",
	rechercheEnCours:"Please wait...",
	numeroNonTrouve:"Address number not found",
	OTPlocale:"en_US",
	modifChoix: "Modify your choice...",
	calculEnCours: "Processing...",
	trafficFluide: "fluid",
	trafficPerturbe: "disrupted",
	perturbations: "Disruptions",
	aucunePerturbation: "None",
	aucunePerturbation_full: "No current disruption",
	aucunFavoris: "Find here your NEXT favourite PASSAGES",
	aucuneNotif: "No notification",
	libelleAddresseNonTrouvee: "Address not found",
	localisationEvenement: "Localize on the map",
	station: "Stop",
	affichageDesCartographie: "Data to display",
	messagesEmissionCO2 : { // Message affiché pour l'émission de CO2
		// Pour les trajets à vélo
		'Velo' : "CO2 emission for this route is practicaly zero.\nCongratulations, by using bike, you contribute to a better air quality.",
		// Pour les trajets piétons
		'Pieton' : "CO2 emission for this route is zero.\nCongratulations, you contribute to a better air quality.",
		// Pour les trajets en voiture
		'Voiture' : "By using an individual car for this $4km route (not electric) : \n- you produce around $1g of CO2.\nThis emission would be almost zero by bicycle and $2g by public transport.\nUsing these modes would allow you to contribute to a better air quality.",
		// morceau rajouté dans le message pour les trajets en voiture dans la variable $2 si le trajet est inférieur à 3km -->
		'SiTrajetInferieurA3Km' : "zero CO2 produced for this route on foot, ",
		// Pour les trajets TC
		'TC' : "By using public transport for this $3km route, you produce around :\n	- $2g of CO2,\n	- but save $1g of CO2 compare of using an individual car.\nBy bicycle this emission would be almost zero.",
		// Pour les trajets TC + Voiture
		'VoitureTC' : "With this combined route, you emit about $1g of CO2.\nUsing public transport allows you to reduce the emission $2g of C02 compared with a route by car only.",
		// Pour les trajets ne correspondant à aucun des cas précédents. Ce message n'apparait éventuellement que pour un cas oublié théoriquement
		'Mixte' : "The realized mixed route emits about $1g of CO2.",
		// Pour les trajets en iRoad
		'Voiture partagée' : "By using an electric car for this route, the emission of CO2 is almost zero.<br/>Congratulations, by using this means of transport, you contribute to a better air quality."
	},
	bogusName : "Nameless road",
	
	horaires :
	{
		direction : "to:",
		Direction : "To:",
		choixArret : "Select your stop",
		arret : "Stop:",
		
		//Specifique pour la traduction de js
		horaires : "Schedules ",
		prochainArret : "Next stop ",
		selectPanel : "Select line into the left panel",
		toutDeselctionner : "Unselect all",
		clickOnTag : "Click on the TAG or Transisère line you want, then select the stop you want to take your bus or tram. Métromobilité delivers, in real time, the waiting time before the next passage in both directions.",
		fromTram : "From 4h30 to 1h, from 4 to 10 min frequency  (peak hour)",
		fromChrono : "From 5h to 1h, from 4 to 10 min frequency (peak hour)",
		fromProximo : "From 5H to 21h, from 7 à 15 min frequency (peak hour)",
		fromFlexo : "From 6h30 to 20h, regular offer and service on reservation",
		descReseauNav : "In function during major works on the lines of tram",
		update : "Update current time"
	},
	
	iti : {
		Autopartage : "Car sharing",
		Parking : "Car Park",
		Metrovelo : "Métrovélo",
		Autres : "Others",
		plusDeDetails: "more details...",
		moinsDeDetails: "less details...",
		Distance : "Distance",
		DenivNeg : "D- ",
		DenivPos : "D+ ",
		tempsStationnement : "Time for parking",
		minutes : "minutes",
		covoiturage : "Car polling",
		reservation : "On-demand trip only. To know more :",
		reservationSemaine : "On-demand trip only during the week. To know more :",
		lienTag : "Timetable",
		flexo : "TAG website",
		plusDOption : " More options",
		moinsDOption : " Fewer options",
		
		//Specifique pour la traduction de js
		itineraire :  "Itinerary",
		stopDepart : "Stop or address of departure",
		stopArrivee : "Stop or address of arrival",
		retour : "Return route",
		plusOptions : 'More options',
		apres : 'After',
		avant : 'Before',
		calculer : 'Calculate',
		resultatsPrecedent : "Previous results",
		resultats : "Results",
		departPrecedent : "Previous departure",
		trajetDetail : "Route details",
		trafic : "traffic :",
		pieton : "Walk",
		velo : "Bike",
		transportCommun : "Public transport",
		teleferique : "Cable railway",
		voiture : "Car",
		pmr : "Wheelchair access",
		recheercheEnCours : "Current search",
		prochainsResultats : "Next results",
		prochainsDeparts : "Next departure",
		retourResultats : "Back to results",
		detail : "Details",
		voirCarte : "See all on map",
		imprimerCarte : "Print the road map",
		gps : "GPS track"
	},
	
	carteMobile : {
		nbTotVehicule : "Total number of available vehicles",
		nbTotPlace : "Total number of available parking spaces",
		photoStation : "Picture of the station",
		dispoiRoad : "iRoad availability",
		dispoComms : "Coms Availability",
		lignesProches : "Nearby ligne :",
		inscriptionOmms : "Registration to Cité Lib by Ha:mo",
		reservationOmms : "Book a vehicle",
		messageCAM : "Coming soon",
		messageCAMError : "Your browser does not support the video tag.",
		messagePMV : "No data",
		disponibles : " available : ",
		places : "park place(s)",
		velos : "bike(s)",
		velosdisponibles : "available bikes",
		placesdisponibles : "available parking places",
		etatDisponible : "Available",
		etatNonDisponible : "Not available"
	},
		
	// note: keep these lower case (and uppercase via template / code if needed)
	directions : {
			depart : 		"Departure",
			southeast:      "southeast",
			southwest:      "southwest",
			northeast:      "northeast",
			northwest:      "northwest",
			north:          "north",
			west:           "west",
			south:          "south",
			east:           "east",
			bound:          "bound",
			left:           "left",
			right:          "right",
			slightly_left:  "slight left",
			slightly_right: "slight right",
			hard_left:      "hard left",
			hard_right:     "hard right",
			'continue':     	"continue on",
			to_continue:    "to continue on",
			becomes:        "becomes",
			at:             "at",
			on:             "on",
			to:             "to",
			via:            "via",
			circle_counterclockwise: "take roundabout counterclockwise",
			circle_clockwise:        "take roundabout clockwise",
			// rather than just being a direction, this should be
			// full-fledged to take just the exit name at the end
			elevator: "take elevator to",
			stops : "stops"
	},
	// see otp.planner.Templates for use ... these are used on the trip
	// itinerary as well as forms and other places
	instructions : {
		
			walk         : "Walk",
			walk_toward  : "Walk",
			walk_verb    : "Walk",
			bike         : "Bike",
			bike_toward  : "Bike",
			bike_verb    : "Bike",
			drive        : "Drive",
			drive_toward : "Drive",
			drive_verb   : "Drive",
			move         : "Proceed",
			move_toward  : "Proceed",
			transfer     : "transfer",
			transfers    : "transfers",
			transit_toward : "transit toward",
			transit_towards : "transit towardS",
			step_out 	 : "step out",
			continue_as  : "Continues as",
			stay_aboard  : "stay on board",
			depart       : "Departure",
			arrive       : "Arrival",
			start_at     : "Start at",
			end_at       : "End at",
			exit 		 : "Exit"
	},
	// see otp.planner.Templates for use -- one output are the itinerary leg
	// headers
	modes : {
			WALK:           "Walk",
			BICYCLE:        "Bicycle",
			CAR:            "Car",
			TRAM:           "Tram",
			SUBWAY:         "Subway",
			RAIL:           "Rail",
			BUS:            "Bus",
			FERRY:          "Ferry",
			CABLE_CAR:      "Cable Car",
			GONDOLA:        "Gondola",
			FUNICULAR:      "Funicular"
	},

	ordinal_exit : {
			1:  "to first exit",
			2:  "to second exit",
			3:  "to third exit",
			4:  "to fourth exit",
			5:  "to fifth exit",
			6:  "to sixth exit",
			7:  "to seventh exit",
			8:  "to eighth exit",
			9:  "to ninth exit",
			10: "to tenth exit"
	},
	detail : {
			detailTrajet : "Detailed route",
			fermerDetailTrajet : "Close the detailed route",
			voieSansNom : "Nameless route",
			rondPoint : "at roundabout"
	},

	resultatsASupprimer : {
			1 : " on <strong>Nameless road</strong>"
	},
	resultatsARemplacer : {
		1 : ""
	},
	alert: [ 	"WARNING! Please specify your address of departure and arrival!",
				"WARNING! Please seize an arrival address different from departure!",
				"WARNING! Address not found...\n Please select another one..."
	],
	libelleAffiche_1 : "Display the ",
	libelleHorairePrec_2 : "  previous schedules",
	libelleHoraireSuivant_2 : "  next schedules",
	libelleHorairePrec : "&lt;&lt; Previous schedules",
	libelleHoraireSuiv : "Next schedules &gt;&gt;",
	libelleFicheTag : "&nbsp Timetable in PDF format",
	libelleMessageFlexo : "This is an on-demand bus line during off-peak hours. It is necessary to book this trip 2 hours before travelling, on the TAG website (tag.fr) or by calling 04-38-70-38-70",
	libelleMessageFlexoWe : "This is an on-demand bus line only the during week, and regularly on Saturday. During the week, it is necessary to book this trip 2 hours before travelling, on the TAG website (tag.fr) or by calling 04-38-70-38-70",
	libelleMessageErreurHoraires : "Further to a dysfunction we are not capable of supplying you the schedules of this line. We advise you to consult the following schedules, PDF format.",
	indiceAtmo : [
		"Unknown",
		"Very good",
		"Very good",
		"Good",
		"Good",
		"Average",
		"Poor",
		"Poor",
		"Bad",
		"Very bad",
		"Very bad"],
	indiceTrafic : [
		"Unknow",
		"Fluid",
		"Slow",
		"Blocked",
		"Closed"],
	indiceTC : [
		"Unknown",
		"Normal service",
		"Disrupted service",
		"Very disrupted service",
		"Service out of schedule"],
	alertHoraire : [ 
			"Impossible to load json data, please refresh your page.",
			"This direction is no more used until the end of service"],
	aucunHoraireTR : "No schedule for the moment.",
	donneesManquantes : "Data unavailable. Refer to <a href='http://www.metromobilite.fr/horaires.html' target='_blank'>theorical schedules</a>.",
	horairesTheoriques : " : realtime schedules",
	velo : {
			nom_commune : "Town",
			type_amenagement : "Chap of arrangement"},
	itineraire : {
			depart : "departure",
			arrivee : "arrival",
			departAvant : "depart before",
			arriveeApres : "arrive after",
			duree : "duration",
			trafic : "traffic",
			emission : "CO2 Emission"},
	erreurPosition : [
		"Error during the geo-localization : ",
		"Timeout!",
		"You did not give the permission",
		"Undefined location",
		"Unknown error"
	],
	questionLocaliser : "Activate the localization ?",
	alerteHorsRectangle : "It seems that you are too far away from Grenoble, there is no data in this area",
	pub : {
			text : "Service propelled by Métromobilité",
			alt : "Click to go to metrobilite.fr"
	},
	opendata: {
		horairesTheoriquesTAG : {
			desc :"Theorical schedules of TAG network in GTFS format.."
		},
		format : {
			GTFS : "The specifications of the GTFS format are available <a href='https://developers.google.com/transit/gtfs/reference' title='Specifications of GTFS format - New window' target='_blank'>here</a>."
		}
	},
	popup: {
		arret: "Stop"
	}
};
