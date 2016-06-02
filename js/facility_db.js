/*jslint indent: 2 */
/*global markerList, $, console, _*/

var FacilityDb = function () {
  'use strict';

  this.getFacilityJson = function (map) {
    var dataURL = c.oregonFacilityUrl,  //'https://data.oregon.gov/api/views/37wb-r4eb/rows.json',
      that = this;

    $.ajax({
      url: dataURL,
      async: true,
      dataType: 'json'
    }).success(function (facilityJson) {
      console.time( "Success" )
      that.data = that.parseMarkerData(facilityJson);
      markerList = m.addMarkerToMap(map, that.data); //addMarkerToMap() returns marker array used to set bounds
      populateCitySearchDropdown(map, that.data);
      console.timeEnd( "Success" )
    }).fail(function () {
      console.warn('getJSON reports \'FAIL\'!');
      that.data = that.parseMarkerData();
      markerList = m.addMarkerToMap(map, that.data); 
      populateCitySearchDropdown(map, that.data);
    });
  };

  this.parseMarkerData = function (facilityJson) {
    //gather facility data ( getJSON() ) and
    //prepare data to pass to addMarker
    var markerData;

    console.groupCollapsed('Parse Marker Data Debugging');

      console.log('JSON received');
      markerData = _.reduce(facilityJson ? facilityJson.data : cachedFacilityData(), function (facilityObj, facility) {
        facilityObj[facility[1]] = new facilityDb.Facility(facility);
        return facilityObj;
      }, {});

    console.dir(markerData);
    console.groupEnd('Parse Marker Data Debugging');

    return markerData;
  };

  this.clearActive = function(){
    $('.facility-list').removeClass('active');
  }

  this.setActive = function( facilityId ){
    $( '#'+facilityId ).addClass('active');
  }

  this.listFacilities = function ( list ){
    var rowColor = 1 ; 
    _(list).forEach(function(facility){
      $('<li />' ,  {   'id'  : facility.id,
                'text'  : facility.name,
                'class' : (rowColor++ % 2 === 0) ? "facility-list list-group-item list-group-item-success" : "facility-list list-group-item list-group-item-info" 
              }).appendTo( '#search-results' ) 
    
    if( facility.availBeds == 0){
      $('#'+facility.id).prepend('<span class="label label-danger pull-left label-as-badge">'+facility.availBeds+'</span>');
    } else if (facility.availBeds > 0 && facility.availBeds < 3){
      $('#'+facility.id).prepend('<span class="label label-warning pull-left label-as-badge">'+facility.availBeds+'</span>');
    } else
    {
      $('#'+facility.id).prepend('<span class="label label-success pull-left label-as-badge">'+facility.availBeds+'</span>');
    }

    });
  }

  this.clearFacilities = function( ){
    $('.facility-list').remove();
  }

  this.search = function ( map, type, criteria ){
    var searchList = {}, noMatch = true, summaryHead = '';
    m.getMarkerId.reset();
    _(facilityDb.data).forEach( function( location , key ){
      if ( type === 'city' ){
        if( location.address.city.toUpperCase() === criteria.toUpperCase() ){
          summaryHead = 'City';
          noMatch = false;
          searchList[key] = location ;
        }
      } else if ( type === 'name' ) {
        if( location.name.indexOf( criteria.toUpperCase() ) >= 0 ){
          summaryHead = 'Facility Name Includes'; 
          noMatch = false;
          searchList[key] =  location ;
        }
      }
    } );
    
    if (noMatch){
      errorMsg( "No Matches found for "+ criteria )
    } else {
      resetSearch( type === 'city' ? 'name' : 'city' ); //clear any opposite search indicators
      m.hideMapMarkers( );
      markerList = m.addMarkerToMap( map, searchList ) 
      facilityDb.searchSummary( summaryHead , criteria.toUpperCase() );
    }
    $('#search-by-name').val('');  // Reset search field
    m.closeOpenInfoWindow( map )
  }

  this.searchSummary = function( heading , searchStr ){
    $('#search-criteria').text( heading + ': ' + searchStr );
    $('#search-clear').show(); //display 'clear search/display all' button once there's a search filter
  }

  this.Facility = function (facility, cached) {
    this.id = facility[ cached ? 2 : 1 ]
    this.name = facility[ cached ? 9 : 8 ]; //array position is different for cached data but only for facility name
    this.lat = parseFloat(facility[19]);
    this.lng = parseFloat(facility[18]);
    this.totBeds = Math.floor(facility[23]);
    this.availBeds = Math.floor(Math.random() * 11);
    this.type = facility[22];
    this.address = {
      street: facility[10],
      city:   facility[12],
      state:  facility[13],
      zip:    facility[14],
      county: facility[16],
      phone:  facility[9]
    };
    this.website = facility[20];
    this.medicareId = facility[25];
  };

  this.Facility.prototype.returnMarker = function (map) {
    return {
      position: {
        lat: this.lat,
        lng: this.lng
      },
      map: map,
      label: this.availBeds < 10 ? this.availBeds.toString() : '+',
      icon: this.availBeds < 1 ? m.pinSymbol('#ff3300') : this.availBeds < 3 ? m.pinSymbol('#ffff4d') : m.pinSymbol('#00ff00'),
      title: this.name
    };
  };

  this.Facility.prototype.returnInfo = function () {
    return c.facilityInfoMarker(this); 
  };
}; 

var facilityDb = new FacilityDb();

