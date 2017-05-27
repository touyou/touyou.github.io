$(function() {
  $('#panel > dd').hide();
  $('#panel > dt').click(function(e){
    $('+dd', this).slideToggle(500);
    if ($('.panel-btn', this).text() == "↓") {
      $('.panel-btn', this).text("↑");
    } else {
      $('.panel-btn', this).text("↓");
    }
  });
});
