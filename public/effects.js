// When the user scrolls the page, execute myFunction
window.onscroll = function () {
  scrollFunction();
};
var navbar = document.getElementById("navbar");
var wigarLogo = document.getElementsByClassName("wigar-logo")[0];
var sticky = navbar.offsetTop;
var scrollButton = document.getElementsByClassName("scroll-btn")[0];
if (sticky === 0) {
  sticky = navbar.parentElement.offsetTop;
}

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    scrollButton.classList.add("active");
  } else {
    scrollButton.classList.remove("active");
  }

  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
    wigarLogo.classList.remove("wigar-logo");
    wigarLogo.classList.add("wigar-logo-small");
    scrollButton.classList.add("active");
  } else {
    navbar.classList.remove("sticky");
    wigarLogo.classList.remove("wigar-logo-small");
    wigarLogo.classList.add("wigar-logo");
    scrollButton.classList.remove("active");
  }
}

// When the user clicks on the button, scroll to the top of the document
function scrollToTop() {
  //document.body.scrollTop = 0; // For Safari
  //document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  const c = document.documentElement.scrollTop || document.body.scrollTop;

  // If that number is greater than 0, we'll scroll back to 0, or the top of the document.
  // We'll also animate that scroll with requestAnimationFrame:
  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    // ScrollTo takes an x and a y coordinate.
    // Increase the '10' value to get a smoother/slower scroll!
    window.scrollTo(0, c - c / 10);
  }
}
