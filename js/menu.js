/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav($nav, $body) {
    $nav.width(250);
    $body.css("background-color", "rgba(0,0,0,0.4)");
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
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
// document.getElementById("mySidenav").style.width = "0";
// console.log( document.getElementById("mySidenav").style.width);