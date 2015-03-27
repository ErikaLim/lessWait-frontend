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
      $("#search-results").append("Hello")
    })
    .fail(function () {
      throw "Search AJAX Failed";
    });
}
