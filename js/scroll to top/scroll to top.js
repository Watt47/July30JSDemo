var scrollToTop = {
    mybutton: null,
    init: function(){
    //Get the button:
        document.body.createChildElement("button", "id=scrollToTopBtn,title=Go to top,text=Top").onclick = function(){
            scrollToTop.topFunction();
        };
// When the user scrolls down 20px from the top of the document, show the button
        scrollToTop.mybutton = document.getElementById("scrollToTopBtn");
        window.onscroll = function() {scrollToTop.scrollFunction()};
    },
    scrollFunction: function(){
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTop.mybutton.style.display = "block";
      } else {
        scrollToTop.mybutton.style.display = "none";
      }
    },
// When the user clicks on the button, scroll to the top of the document
    topFunction: function () {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    } 
};