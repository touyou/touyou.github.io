$(function() {
  $("#modal-open").click(function() {
    $("main").append('<div id="modal-bg"></div>');
    modalResize();
    $("#modal-bg,#modal-fg").fadeIn(1000);
  });

  $("#modal-close").click(function() {
    $("#modal-bg,#modal-fg").fadeOut(1000, function() {
      $("#modal-bg").remove();
    });
  });

  // $(window).resize(modalResize);

  function modalResize() {

    var w = $(window).width();
    var h = $(window).height();

    var cw = $("#modal-fg").outerWidth();
    var ch = $("#modal-fg").outerHeight();

    //取得した値をcssに追加する
    $("#modal-fg").css({
      "left": ((w - cw) / 2) + "px",
      "top": ((h - ch) / 2) + "px"
    });
  }
});
