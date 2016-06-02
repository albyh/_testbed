/*jslint indent: 2 */
/*global markerList, $, google, _, m*/
/*jslint nomen:true */

var Map = function () {
  'use strict';

  this.mapOptions = {
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    center: new google.maps.LatLng(45.522405, -122.676086),
    zoom: 14
  };

  this.pinSymbol = function (color) {

    //traditional marker
    //path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#000',
      strokeWeight: 3,
      scale: 12.5
    };
  };

  this.getMarkerId = function (){
    var i = -1 ; 
    return { 
      get : function() {
        return (i>=0) ? markerList[i].id : undefined } ,
      reset : function() { i = -1; },
      isCurrent : function( facilityId ) {
        return (i<0) ? false : facilityId === markerList[i].id },
      set : function(facilityId) {
        i = 0 //i<0 ? 0 : i;
        for (var x = markerList.length; i < x ; i++){
            if (markerList[i].id === facilityId ){
              return i
            };
        };
        console.error("markerList out of range error... i="+i);
      }
    };
  }();

  this.setMapBounds = function (map, markerList) {
    var bounds = new google.maps.LatLngBounds();

    _(markerList).forEach(function (el) {
      bounds.extend(el.position); //increase the bounds to include the new point
    });

    if (bounds.H.j === bounds.H.H) {
      bounds.H.j -= 0.01;
      bounds.H.H += 0.01;
    }

    map.fitBounds(bounds);

  };

  this.attachInfowindow = function (map, marker, infoText) {

    var infowindow = new google.maps.InfoWindow({
      content: infoText
    });

    google.maps.event.addListener( infowindow, 'closeclick', function() { facilityDb.clearActive() } );

    marker.addListener('click', function () {

      m.closeOpenInfoWindow(map);

      m.prev_infowindow = infowindow;
      infowindow.open(map, marker);

      facilityDb.clearActive();
      //console.log( "Clicked marker "+ marker.id );
      facilityDb.setActive( marker.id )
      var activate = document.getElementById(marker.id)
      activate.scrollIntoView(); //this will scroll to the top of the list even if selected from the list
      
    });
  };

  this.hideMapMarkers = function () {
    _(markerList).forEach(function (el) {
      el.setMap(null);
    });
  };

  this.closeOpenInfoWindow = function (map) {
    if (m.prev_infowindow) {
      m.prev_infowindow.close();
    }
  };

  this.addMarkerToMap = function (map, markerData) {

    facilityDb.clearFacilities();

    markerList = [];
    var marker = {},
      that = this;

    _(markerData).forEach(function (location) {

      marker = new google.maps.Marker(location.returnMarker(map));
      marker.set('id', location.id ); //set an id to bind to facilityList
      markerList.push(marker);
      that.attachInfowindow(map, marker, location.returnInfo()); //add infowindow & event listener

    });

    this.setMapBounds(map, markerList);

    facilityDb.listFacilities( markerData )

    return markerList;
  };
};

var m = new Map();
