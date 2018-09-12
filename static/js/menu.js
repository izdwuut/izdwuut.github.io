var $body = $('body');
var $nav = $("#mySidenav");

function openNav() {
    $nav.width(250);
    $body.css("background-color", "rgba(0,0,0,0.4)");
}

function closeNav() {
    $nav.width(0);
    $body.css("background-color", "white");
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
    $(document).click(() => {
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