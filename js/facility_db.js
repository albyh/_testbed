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
      that.data = that.parseMarkerData(facilityJson);
      markerList = m.addMarkerToMap(map, that.data); //addMarkerToMap() returns marker array used to set bounds
      populateCitySearchDropdown(map, that.data);
    }).fail(function () {
      console.warn('getJSON reports \'FAIL\'!');
      that.data = that.parseMarkerData();
      markerList = m.addMarkerToMap(map, that.data); 
      populateCitySearchDropdown(map, that.data);
    });
  };

  this.Facility = function (facility, cached) {
    this.name = facility[ cached ? 9 : 8];
    this.lat = parseFloat(facility[ cached ? 19 : 19]);
    this.lng = parseFloat(facility[ cached ? 18 : 18]);
    this.totBeds = Math.floor(facility[ cached ? 23 : 23]);
    this.availBeds = Math.floor(Math.random() * 11);
    this.type = facility[ cached ? 22 : 22];
    this.address = {
      street: facility[ cached ? 10 : 10],
      city: facility[ cached ? 12 : 12],
      state: facility[ cached ? 13 : 13],
      zip: facility[ cached ? 14 : 14],
      county:  facility[ cached ? 16 : 16],
      phone:  facility[ cached ? 9 : 9]
    };
    this.website = facility[ cached ? 20 : 20];
    this.medicareId = facility[ cached ? 25 : 25];
  };

  this.parseMarkerData = function (facilityJson) {
    //gather facility data ( getJSON() ) and
    //prepare data to pass to addMarker
    var markerData;

    console.groupCollapsed('Parse Marker Data Debugging');

    if (facilityJson) {

      console.log('JSON received');
      markerData = _.reduce(facilityJson.data, function (facilityObj, facility) {
        facilityObj[facility[1]] = new facilityDb.Facility(facility);
        return facilityObj;
      }, {});

    } else {

      console.warn('no JSON received. Loading cached facility data.');
      markerData = _.reduce(cachedFacilityData(), function (facilityObj, facility) {
        facilityObj[facility[1]] = new facilityDb.Facility(facility, true);
        return facilityObj;
      }, {});
    }

    console.dir(markerData);
    console.groupEnd('Parse Marker Data Debugging');

    return markerData;
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

