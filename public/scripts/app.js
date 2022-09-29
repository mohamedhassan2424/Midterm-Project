// Client facing scripts here

$(function() {
  $('.add-question').on('click', function( e ) 
    console.log("click");
      e.preventDefault();
      $('<li/>').addClass( 'new-text-div' )
      .html( $(`<textarea style ="background-color:#FFCCCB" placeholder="Possible Wrong Answer" type="textbox" name ="possiblefirstAnswer" />`).addClass( 'someclass' ) )
      .append( $('<button/>').addClass( 'remove' ).text( 'Remove' ) )
      .insertBefore( this );
  });
  $(document).on('click', 'button.remove', function( e ) {
      e.preventDefault();
      $(this).closest( 'div.new-text-div' ).remove();
  });

});
