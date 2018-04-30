$(document).ready(function () {
  $('.collapsible').collapsible();
});
// More information click to see notes....
$(document).on("click", ".noteTrigger", function () {
  // $(".collapsible-header").empty();
  // $(".collapsible-body").empty();
  var articleId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + articleId
  })
    .then(function (data) {
      console.log(data);
    }
    );
});

// When you click the 'Add a Note' Button
$(document).on("click", ".add-note", function () {
  var articleId = $(this).attr("data-id");
  console.log(articleId);
  $.ajax({
    method: "POST",
    url: "/articles/" + articleId,
    data: {
      title: $("#titleInput").val(),
      // Value taken from note textarea
      body: $("#bodyInput").val()
    }
  })
    .then(function (data) {
      console.log(data);
    });

  $("#titleInput").val("");
  $("#bodyInput").val("");
});
