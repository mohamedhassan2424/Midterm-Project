// Client facing scripts here

$(function() {
  $('.add-question').on('click', function( e ) {
    console.log("click");
      e.preventDefault();
      //const continerElement = $(".container").closest(".correctAnswer")
      console.log($(this))
      //attr("name")
       //console.log( continerElement)
      $('<li/>').addClass( 'new-text-div' )
      .html( $(`<textarea style ="background-color:#FFCCCB" class="textArea" placeholder="Possible Answer" name="possibleOtherAnswer">`).addClass( 'someclass' ) )
      .append( $('<button/>').addClass( 'remove' ).text( 'Remove' ) )
      .insertBefore( this );
  });
  $(document).on('click', 'button.remove', function( e ) {
      e.preventDefault();
      $(this).closest( 'li.new-text-div' ).remove();
  });

});

// creating the jquery for the dynamic changes but was able to refernce it back to the database
