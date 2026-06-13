/* ============================================
   TARTEAUCITRON — Configuration Passerelle Environnement
   Mise à jour : janvier 2025
   ============================================ */

tarteaucitron.init({
    /* Textes */
    "privacyUrl":         "politique-confidentialite.html",
    "bodyPosition":       "bottom",

    /* Boutons */
    "hashtag":            "#tarteaucitron",
    "cookieName":         "tarteaucitron",

    /* Durées */
    "cookieslist":        false,   /* Afficher la liste des cookies */
    "showAlertSmall":     false,   /* Petit bouton flottant */
    "closePopup":         false,   /* Bouton fermer sans choisir */
    "showIcon":           true,    /* Icône flottante après choix */
    "iconPosition":       "BottomRight",
    "iconSrc":            "",

    /* Comportement */
    "adblocker":          false,
    "highPrivacy":        true,    /* Pas de consentement implicite */
    "handleBrowserDNTRequest": false,

    /* Délais */
    "removeCredit":       false,
    "moreInfoLink":       true,
    "useExternalCss":     false,
    "useExternalJs":      false,

    /* Affichage */
    "mandatory":          true,    /* Cookies nécessaires toujours actifs */
    "mandatoryCta":       true
});

/* ── Services déclarés ── */

/* Netlify Forms (fonctionnel, pas de cookie tiers) */
/* Pas de Google Analytics pour l'instant */
/* Pas de pixel publicitaire */

/* Quand vous ajouterez des services (ex: Google Analytics),
   décommentez et adaptez :

tarteaucitron.user.analyticsUa = 'UA-XXXXXXXX-X';
tarteaucitron.user.analyticsMore = function () {};
(tarteaucitron.job = tarteaucitron.job || []).push('analytics');

*/
