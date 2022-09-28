// Client facing scripts here

$(function() {
  $('#add-question').on('click', function( e ) {
    console.log("click");
      e.preventDefault();
      $('<div/>').addClass( 'new-text-div' )
      .html( $('<input type="textbox"/>').addClass( 'someclass' ) )
      .append( $('<button/>').addClass( 'remove' ).text( 'Remove' ) )
      .insertBefore( this );
  });
  $(document).on('click', 'button.remove', function( e ) {
      e.preventDefault();
      $(this).closest( 'div.new-text-div' ).remove();
  });

});
