/*
jQuery('a').click(function(){
   jQuery(this).toggleClass('active');
});

jQuery('li').click(function(){
   jQuery(this).toggleClass('active');
});
*/
$(document).ready(function () {
    $('.nav li a').click(function(e) {
        $('.nav li').removeClass('active');
        var $parent = $(this).parent();
        if (!$parent.hasClass('active')) {
            $parent.addClass('active');
        }
        e.preventDefault();
    });
});

$(document).on("click", ".updateQuestionButton", function () {
  var content = $(this).data('content');
  var optionList = $(this).data('optionList');
  var answer = $(this).data('answer');
  var answerContent = $(this).data('answerContent');
  // $(".modal-body #currDeleteId").val( userDeleteId );
});
