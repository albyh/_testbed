#Care-Compass _Testbed
###Version History

###Date: 2016-05-31

#####mapping.js
  - Implemented activate.scrollIntoView() to bring facility selected from map into focus on list.
  - Implemented getMarkerId() with a closure to track/coordinate markerList, infobox, and selected facility.

#####care_compass.js
  - Added setFacilityListClickEvent() 
  - Added m.getMarkerId.reset() to city and name search.

#####facility_db.js
  - Added listFacilities to provide core list facility functionality. 
  - Added clearActive and SetActive for setting active facility in list. 

###Date: 2016-05-28

#####mapping.js
  - Made mapOptions a property of Map so that it is accessible via m.mapOptions.

#####facility_db.js
  - Updated getFacilityJson to load "cached" data on AJAX fail. 
  - Updated Facility constructor to allow use of cached facility data. 
  - Added timer to functions in AJAX success.
  - Added facility id property to Facility constructor. 
  - Updated Facility.prototype.returnInfo to further implement MVC separation of infoMarker HTML data. 

#####care_compass.js
  - Added new Config object instance. 
  - Added timers to initialize()
  - Removed m.prev_infowindow declaration as this can be handled in attachInfowindow and closeOpenInfoWindow.

#####Created config.js
  - Config constructor
    - Added oregonFacilityUrl & facilityInfoMarker()

#####Created cached.js
  - Stores "cached" facility data used if JSON request fails. 
