export default function decorate() {

    function initGA() {
      // Load GA4 library
      const gaScript = document.createElement("script");
      gaScript.async = true;
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-4DVHQ0LHTV";
      document.head.appendChild(gaScript);
  
      // Setup dataLayer + gtag when the script finishes loading
      gaScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        window.gtag = gtag;
  
        gtag("js", new Date());
  
        // Important for EDS soft navigation
        gtag("config", "G-4DVHQ0LHTV", {
          send_page_view: false
        });
  
        console.log("GA4 loaded successfully");
      };
    }
  
    // Make sure <head> exists before injecting the script
    if (document.head) {
      initGA();
    } else {
      document.addEventListener("DOMContentLoaded", initGA);
    }
  }
  