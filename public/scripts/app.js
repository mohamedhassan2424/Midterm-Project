// Client facing scripts here
let count = 0;
$(function() {
  $('#add-question').on('click', function( e ) {
    count++;
    console.log("COUNT", count)
    if(count > 4){
      return false;
    }
    let countValue = 0
    countValue.innerHTML= count
    console.log("countValue.innerHTML",countValue.innerHTML)
    console.log("click");
      e.preventDefault();
      $('<li/>').addClass( 'new-text-div' )
     
      .html( $(`<textarea style ="background-color:#FFCCCB" placeholder="Possible Wrong Answer" type="textbox" name =${} />`).addClass( 'someclass' ) )
      .append( $('<button/>').addClass( 'remove' ).text( 'Remove' ) )
      .insertBefore( this );
  });
  $(document).on('click', 'button.remove', function( e ) {
      e.preventDefault();
      $(this).closest( 'div.new-text-div' ).remove();
  });

});
