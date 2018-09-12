var $body = $('body');
var $nav = $("#mySidenav");
var $overlay = $('#overlay')

function openNav() {
    $nav.width(250);
    $overlay.toggle();
}

function closeNav() {
    $nav.width(0);
    $overlay.toggle();
} 

var openBtn = '.menu-toggle';
var $toggle = $(openBtn + ', .closebtn');

function addMenuListener() {
    $toggle.click(() => {
        $body.toggleClass('noscroll');
    });
}
addMenuListener();

function closeMenuOnBodyClick() {
    $overlay.click(() => {
        closeNav()
    });
      
    $nav.click(e => {
        e.stopPropagation();
    });
    
    $(openBtn).click(e => {
        e.stopPropagation();
    });
}
closeMenuOnBodyClick();