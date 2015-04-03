HandlebarsIntl.registerWith(Handlebars);
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
  var waitTime = $('.active.title .wait-time-indicator').text();

  var restaurant = {
    coords: [parseFloat(divCoords[0]), parseFloat(divCoords[1])],
    name: name,
    address: address,
    phone: phone,
    wait_time: waitTime
  };

   addMarker(restaurant);
});

$("#search-results").on("click", ".category", function () {
  var category = $(this).text().trim();
  $("#search-form input").val(category);
  searchAction(category);
});


$("#search-form").on("submit", function (e) {
  e.preventDefault();
  searchAction($("#search-form input").val());
});

$("#search-results").on("submit", "div.content.active form", function (e) {
  e.preventDefault();
  var waitTime = $(".content.active .wait-time-form input").val();
  if (waitTime === "") {
    return;
  }
  var id = $(this).data("id");
  reportWaitTimeAction(waitTime, id);
  removeWaitTimeForm($(this));
});

function searchAction(searchTerm) {
  var query = searchTerm.replace(/\s/g, "+");
  // var url = "http://localhost:3000/search_yelp";
  var url = "https://less-wait.herokuapp.com/search_yelp";
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
      res.forEach(function(restaurant) {
        addMarker(restaurant);
      });
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
        coordinates: [restaurant.geocoords[0], restaurant.geocoords[1]]
    },
    properties: {
        title: restaurant.name,
        description: "<div>"+ restaurant.address +"</div>" + "<div>"+ restaurant.phone +"</div>" + "<div>" + "Last reported:" + restaurant.wait_time + "</div>",
        'marker-size': 'medium',
        'marker-color': '#FA6400',
        'marker-symbol': 'restaurant'
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

  // var url = "http://localhost:3000/wait_times";
  var url = "https://less-wait.herokuapp.com/wait_times";

  var req = {
    url: url,
    method: "post",
    data:payload
  };

  $.ajax(req)
    .done(function (res) {
      setActiveRestaurant(waitTime);
    })
    .fail(function () {
      throw "Search AJAX Failed";
    });
}

function removeWaitTimeForm($form) {
  $form.fadeOut("fast", function () {
    $form.remove();
  });
}

function setActiveRestaurant(waitTime) {
  $('.active.title .wait-time-indicator').html(waitTime + '<i class="wait icon"></i>');
}

// map.featureLayer.on('ready', function(e) {
// });

function clickButton() {
  console.log('hi ericka');
}
