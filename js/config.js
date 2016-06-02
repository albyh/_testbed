var Config = function () {

	this.oregonFacilityUrl = 'https://data.oregon.gov/api/views/37wb-r4eb/rows.json';  

	this.facilityInfoMarker =  function (that) {
		return  `<h3 class='info-head'>${that.name}</h3>
		<p>Address: ${that.address.street} ${that.address.city} ${that.address.state}, ${that.address.zip}</p>
		<p>Phone: ${that.address.phone}</p>
		<p>Available Beds. ${'<span class="label label-danger pull-left label-as-badge">'+that.availBeds+'</span>'}
		Total Beds: ${that.totBeds}</p>
		Website: ${that.website ? '<a target="_blank" href="'+that.website+'">'+that.name+'</a>' : 'No website.'}`  
	}
};