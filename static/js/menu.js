var $body = $('body')
var $nav = $("#mySidenav");

function openNav() {
    $nav.width(250);
    $body.css("background-color", "rgba(0,0,0,0.4)");
}

function closeNav() {
    $nav.width(0);
    $body.css("background-color", "white");
} 

var $toggle = $('.menu-toggle, .closebtn');

function addMenuListener() {
    $toggle.click(function() {
        $body.toggleClass('noscroll');
    });
}
addMenuListener();