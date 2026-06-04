# Passerelle Environnement - Structure du projet

## 📋 État du projet (Sous-étape 5.1)

Structure complète et première sauvegarde GitHub ✅

---

## 📁 Architecture des fichiers

```
passerelle-environnement/
│
├── index.html                          # Page d'accueil
├── accompagnement.html                 # Page accompagnement (stub)
├── apropos.html                        # Page à propos (stub)
├── questionnaire.html                  # Page questionnaire (à intégrer étape 5.5)
├── blog.html                           # Page ressources/blog (stub)
├── contact.html                        # Page contact (stub)
├── merci.html                          # Page merci (post-paiement)
├── mentions-legales.html               # Mentions légales (à finaliser étape 7)
├── politique-confidentialite.html      # Politique de confidentialité (à finaliser étape 7)
│
├── css/
│   └── styles.css                      # Styles complets (charte graphique)
│
├── js/
│   ├── scripts.js                      # Scripts de base (navigation, animations)
│   ├── tarteaucitron-init.js           # RGPD / cookies (stub, à finaliser étape 7)
│   ├── questionnaire.js                # À créer (étape 5.5)
│   └── stripe.js                       # À créer (étape 8)
│
├── assets/
│   ├── fonts/
│   │   ├── Nunito/                     # Polices Nunito (auto-hébergées)
│   │   │   ├── Nunito-Regular.woff2
│   │   │   ├── Nunito-SemiBold.woff2
│   │   │   └── Nunito-Bold.woff2
│   │   └── AtkinsonHyperlegible/       # Polices Atkinson (auto-hébergées)
│   │       ├── AtkinsonHyperlegible-Regular.woff2
│   │       └── AtkinsonHyperlegible-Bold.woff2
│   │
│   └── images/
│       ├── hero-panoramique.jpg        # À ajouter (3 personnes, rivière)
│       ├── floriane-portrait.jpg       # À ajouter (portrait Floriane)
│       └── illustrations/
│           ├── eau.svg                 # À ajouter
│           ├── biodiversite.svg        # À ajouter
│           ├── urbanisme.svg           # À ajouter
│           ├── agriculture.svg         # À ajouter
│           ├── climat.svg              # À ajouter
│           └── eedd.svg                # À ajouter
│
├── netlify.toml                        # Configuration Netlify
├── .gitignore                          # Fichiers à ignorer sur GitHub
└── README.md                           # Ce fichier

```

---

## 🎨 Charte graphique

### Couleurs
- **Bleu canard** : #2D7D8A (primaire)
- **Vert sauge** : #7D9B76 (secondaire)
- **Terracotta** : #C4785A (CTA)
- **Gris clair** : #E8EBE4 (backgrounds)
- **Blanc cassé** : #F7F5F0 (fond général)

### Polices
- **Nunito** (titres, navigation) — auto-hébergée
- **Atkinson Hyperlegible** (corps) — auto-hébergée

---

## ✅ Checklist technique

### Images à ajouter
- [ ] Photo panoramique hero (3 personnes, rivière)
- [ ] Portrait Floriane (lumière dorée, fond végétal, blazer, épaules)
- [ ] 6 illustrations SVG (eau, biodiversité, urbanisme, agriculture, climat, EEDD)

### Fichiers JavaScript à créer
- [ ] `js/questionnaire.js` (étape 5.5)
  - Intégration questionnaire_qualification_v3.html
  - Génération code profil
  - Redirection Stripe + page résultat
  
- [ ] `js/stripe.js` (étape 8)
  - Liens de paiement Stripe
  - Passage du code profil

### Pages articles à créer (étape 5.6)
- [ ] article-secteur-public.html
- [ ] article-association-etudes-collectivite.html
- [ ] article-biodiversite.html
- [ ] article-technicien-riviere.html
- [ ] article-master-environnement.html
- [ ] article-metiers-biodiversite.html

### À finaliser (étape 7 - RGPD)
- [ ] Mentions légales (remplir les blancs)
- [ ] Politique de confidentialité (remplir les blancs)
- [ ] `js/tarteaucitron-init.js` (configurer services réels)
- [ ] Registre des traitements CNIL

### Intégrations (étape 8)
- [ ] Stripe (liens de paiement par profil)
- [ ] Cal.com (champ code profil)
- [ ] Brevo (2 emails : post-paiement + post-séance)

---

## 🔧 Configuration

### Polices auto-hébergées
Les polices sont déclarées dans `css/styles.css` et pointent vers `assets/fonts/`.
Aucune dépendance à Google Fonts (RGPD ✅)

### Tarteaucitron (RGPD)
Chargé depuis CDN (https://cdn.jsdelivr.net/gh/AmauriC/tarteaucitron.js/tarteaucitron.js)
Configuration dans `js/tarteaucitron-init.js`

### Netlify
Fichier `netlify.toml` configure :
- Redirects
- Headers de sécurité
- Cache long terme (polices, images)

---

## 📱 Responsive

- Desktop (> 768px) : layout complet
- Tablet (≤ 768px) : colonnes adaptées
- Mobile (≤ 480px) : single column, nav réduite

---

## 🚀 Prochaines étapes

**Étape 5.2** : Finaliser page d'accueil (contenu)
**Étape 5.3** : Page accompagnement (contenu)
**Étape 5.4** : Page à propos (contenu)
**Étape 5.5** : Intégrer questionnaire + page résultat
**Étape 5.6** : Articles blog (6 pages)
**Étape 5.7** : Formulaire contact
**Étape 5.8-5.11** : Pages légales, CSS finaux, Tarteaucitron
**Étape 6** : Copywriting
**Étape 7** : Sécurité & RGPD
**Étape 8** : Intégrations (Stripe, Cal.com, Brevo)

---

## 📞 Support

Pour toute question technique, consulter :
- `netlify.toml` pour le déploiement
- `css/styles.css` pour la charte graphique
- `js/scripts.js` pour les interactions

---

**Dernière mise à jour** : Juin 2025
**Responsable** : Floriane Dybul
**Stack** : HTML/CSS/JS + Netlify + Tarteaucitron
