var $body = $('body');
var $nav = $("#mySidenav");
var $overlay = $('#overlay')

function openNav() {
    $nav.width(250);
    $overlay.toggle();
    toggleScroll()
}

function closeNav() {
    $nav.width(0);
    $overlay.toggle();
    toggleScroll();
} 

function toggleScroll() {
    $body.toggleClass('noscroll');
}

function closeMenuOnBodyClick() {
    $overlay.click(() => {
        closeNav()
    });
      
    $nav.click(e => {
        e.stopPropagation();
    });
    
    $('.menu-toggle').click(e => {
        e.stopPropagation();
    });
}
closeMenuOnBodyClick();