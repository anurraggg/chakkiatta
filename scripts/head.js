export default function decorate() {
    /* ------------------------------
       Load GA4 library
    --------------------------------*/
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-4DVHQ0LHTV";
    document.head.appendChild(gaScript);
  
    /* ------------------------------
       Setup dataLayer + gtag()
    --------------------------------*/
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
  
    gtag('js', new Date());
  
    /* ----------------------------------
       IMPORTANT FOR EDS:
       Disable auto page_view tracking
       because navigation is soft-SPA
    -----------------------------------*/
    gtag('config', 'G-4DVHQ0LHTV', {
      send_page_view: false
    });
  }
  