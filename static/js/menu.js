function openNav($nav, $body) {
    $nav.width(250);
    $body.css("background-color", "rgba(0,0,0,0.4)");
}

function closeNav($nav, $body) {
    $nav.width(0);
    $body.css("background-color", "white");
} 

function toggleNav() {
    var $nav = $("#mySidenav");
    var $body = $("body")
    if ($nav.width()) {
        closeNav($nav, $body);
    } else {
        openNav($nav, $body);
    }
}

var $toggle = $('.menu-toggle, .closebtn');
var $body = $('body')

function addMenuListener() {
    $toggle.click(function() {
        $body.toggleClass('noscroll');
    });
}
addMenuListener();