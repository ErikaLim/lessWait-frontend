var source   = $("#search-results-template").html();
var searchResultsTemplate = Handlebars.compile(source);



// Provide your access token
L.mapbox.accessToken = 'pk.eyJ1IjoiZXJpa2FsaW0iLCJhIjoiSlNWby0ySSJ9.EIx_Hy7Z4poH6igFQqfCZQ';
// Create a map in the div #map
map = L.mapbox.map('map', 'erikalim.liomn8ke').setView([37.767, -122.436], 13);

$("#search-results").on("click", ".restaurant", function() {
  var divCoords = $(this).data("coordinates").split(',');
  var name = $(this).data("name");
  var address = $(this).data("address");
  var phone = $(this).data("phone");

  var restaurant = {
    coords: [parseFloat(divCoords[0]), parseFloat(divCoords[1])],
    name: name,
    address: address,
    phone: phone
  };

  addMarker(restaurant);
});

$("#search-form").on("submit", function (e) {
  e.preventDefault();
  searchAction($("#search-form input").val());
});

function searchAction(searchTerm) {
  var query = searchTerm.replace(/\s/g, "+");
  var url = "http://localhost:3000/search_yelp";
  var req = {
    url: url,
    method: "post",
    data:{
      "s":query // params[:s]
    }
  };

  $.ajax(req)
    .done(function (res) {
      console.log(res);
      // append to list
      setSearchResultsTemplate({restaurants:res});
    })
    .fail(function () {
      throw "Search AJAX Failed";
    });
}

function setSearchResultsTemplate(context) {
  var html = searchResultsTemplate(context);
  $("#search-results").append(html);
  $('.ui.accordion').accordion("close others");
}



function addMarker(restaurant) {
  L.mapbox.featureLayer({
    // this feature is in the GeoJSON format: see geojson.org
    // for the full specification
    type: 'Feature',
    geometry: {
        type: 'Point',
        // coordinates here are in longitude, latitude order because
        // x, y is the standard for GeoJSON and many formats
        coordinates: restaurant.coords
    },
    properties: {
        title: restaurant.name,
        description: "<div>"+ restaurant.address +"</div>" + "<div>"+ restaurant.phone +"</div>"


        // description: restaurant.address,
        // one can customize markers by adding simplestyle properties
        // https://www.mapbox.com/guides/an-open-platform/#simplestyle
        // 'marker-size': 'large',
        // 'marker-color': '#BE9A6B',
        // 'marker-symbol': 'cafe'
    }
  }).addTo(map);
}
