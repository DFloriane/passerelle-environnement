/* ============================================
   PASSERELLE ENVIRONNEMENT - TARTEAUCITRON
   Gestion des cookies et consentement RGPD
   À finaliser à l'étape 7
   ============================================ */

// Configuration de Tarteaucitron
tarteaucitron.init({
    "privacyUrl": "/politique-confidentialite.html",
    "bodyPosition": "bottom",
    "cookieslist": false,
    "highPrivacy": false,
    "orientation": "bottom",
    "showAlertSmall": true,
    "cookieName": "tarteaucitron",
    "handleBrowserDNTRequest": false,
    "removeCredit": false,
    "moreInfoLink": true,
    "mandatory": true,
    "mandatoryCookies": [],
    "secondLine": false,
    "useExternalCss": false,
    "useLocalJs": false,
    "googleAnalyticsUa": "",
    "googleAnalyticsMore": function() { return false; },
    "facebookPixelId": "",
    "customIdentifier": "",
    "customIdentifierOnLabel": false,
    "customIdentifierOnClick": false,
    "customIdentifierSizeSup": 0
});

// SERVICES À ACTIVER (à implémenter selon les besoins)

// Google Analytics (si utilisation future)
// tarteaucitron.services.googleAnalytics = {
//     "key": "analytics",
//     "type": "analytic",
//     "name": "Google Analytics",
//     "uri": "https://marketingplatform.google.com/about/analytics/terms/us/",
//     "cookies": ["_gid", "_ga", "_gat"],
//     "js": function() {
//         // Code GA à ajouter
//     },
//     "fallback": function() { return false; }
// };

// Stripe (paiement - intégration étape 8)
// À ajouter quand on intègre Stripe

// Cal.com (réservation - intégration étape 8)
// À ajouter quand on intègre Cal.com

// Brevo (emails - intégration étape 8)
// À ajouter quand on intègre Brevo

// ============================================
// REDRAW (à appeler si modifs de la bannière)
// ============================================

tarteaucitron.load();

console.log('✅ Tarteaucitron initialisé - RGPD actif');
