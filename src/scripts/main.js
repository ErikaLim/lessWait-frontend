var source   = $("#search-results-template").html();
var searchResultsTemplate = Handlebars.compile(source);
var featureLayers = [];

L.mapbox.accessToken = 'pk.eyJ1IjoiZXJpa2FsaW0iLCJhIjoiSlNWby0ySSJ9.EIx_Hy7Z4poH6igFQqfCZQ';
map = L.mapbox.map('map', 'erikalim.ljld06gn').setView([37.759, -122.445], 13);

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

$("#search-results").on("submit", "div.content.active form", function (e) {
  e.preventDefault();
  var waitTime = $(".content.active .wait-time-form input").val();
  var id = $(this).data("id");
  reportWaitTimeAction(waitTime, id);
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
      // append to list
      setSearchResultsTemplate({restaurants:res});
    })
    .fail(function () {
      throw "Search AJAX Failed";
    });
}

function setSearchResultsTemplate(context) {
  var html = searchResultsTemplate(context);
  $("#search-results").html(html);
  $('.ui.accordion').accordion("close others");
  featureLayers.forEach(function (featureLayer) {
    map.removeLayer(featureLayer);
  });
  featureLayers = [];
}

function addMarker(restaurant) {
  var featureLayer = L.mapbox.featureLayer({
    type: 'Feature',
    geometry: {
        type: 'Point',
        coordinates: restaurant.coords
    },
    properties: {
        title: restaurant.name,
        description: "<div>"+ restaurant.address +"</div>" + "<div>"+ restaurant.phone +"</div>"
        // one can customize markers by adding simplestyle properties
        // https://www.mapbox.com/guides/an-open-platform/#simplestyle
        // 'marker-size': 'large',
        // 'marker-color': '#BE9A6B',
        // 'marker-symbol': 'cafe'

    }
  });
  featureLayer.addTo(map);
  featureLayers.push(featureLayer);
}

function reportWaitTimeAction(waitTime,id) {
  var payload = {
    wait_time:waitTime,
    restaurant_id:id
  };

  var url = "http://localhost:3000/wait_times";
  var req = {
    url: url,
    method: "post",
    data:payload
  };


  $.ajax(req)
    .done(function (res) {
      console.log(res);
    })
    .fail(function () {
      throw "Search AJAX Failed";
    });
}
