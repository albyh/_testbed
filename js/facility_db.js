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

