# Intégration cal.eu → Brevo — guide de mise en route

Ce document couvre la tuyauterie ajoutée pour automatiser les 2 emails prévus au README
(post-paiement, post-séance), sur la base d'un paiement déjà collecté nativement par cal.eu
(app Stripe intégrée à cal.eu, déjà connectée et configurée par Floriane).

Fichiers concernés :
- `netlify/functions/cal-webhook.js` — reçoit les webhooks cal.eu, envoie les emails via Brevo.
- `netlify.toml` — déclare le dossier de fonctions (`[functions]`).
- `questionnaire.html` — ajoute le code profil en paramètre d'URL sur les liens de réservation.

## 1. Variables d'environnement Netlify

Dans Netlify : **Site configuration → Environment variables**. Ne jamais commiter ces valeurs
dans le code ou les coller dans un chat.

| Variable | Valeur |
|---|---|
| `CAL_WEBHOOK_SECRET` | Un secret que tu choisis (chaîne aléatoire longue), à reporter tel quel dans cal.eu à l'étape 2. |
| `BREVO_API_KEY` | Brevo → Settings → SMTP & API → API Keys → Generate a new API key. |
| `BREVO_SENDER_EMAIL` | `contact@passerelle-environnement.fr` une fois authentifié (étape 3). |
| `BREVO_SENDER_NAME` | Ex. `Floriane Dybul - Passerelle Environnement`. |

## 2. Webhook cal.eu

Dans cal.eu : **Settings → Developer → Webhooks → Add**.

- URL d'abonnement : `https://passerelle-environnement.fr/.netlify/functions/cal-webhook`
- Déclencheurs à cocher : **Booking Paid** et **Meeting Ended** (les deux seuls utilisés actuellement)
- Secret : la même valeur que `CAL_WEBHOOK_SECRET`
- Portée : applique-le à tous les types d'événements payants (découverte, diagnostic, clarification, ciblé, stratégique)

## 3. Authentifier `contact@passerelle-environnement.fr` dans Brevo

Tu m'as dit avoir actuellement un autre expéditeur vérifié et vouloir passer à
`contact@passerelle-environnement.fr`. Étapes côté Brevo (Senders, Domains & Dedicated IPs →
Domains → Add a domain) :

1. Ajoute le domaine `passerelle-environnement.fr`.
2. Brevo te fournit des enregistrements DNS (TXT pour SPF/vérification, CNAME pour DKIM) à
   ajouter chez ton registrar (là où tu as acheté le nom de domaine).
3. Ajoute un enregistrement DMARC en TXT sur `_dmarc.passerelle-environnement.fr` (commence en
   `p=none` pour observer, tu pourras durcir vers `quarantine`/`reject` plus tard).
4. Retourne dans Brevo et clique sur « Authenticate this email domain » : chaque ligne doit
   passer au vert (la propagation DNS peut prendre de quelques minutes à 24-48h selon le TTL).
5. Une fois authentifié, ajoute `contact@passerelle-environnement.fr` comme expéditeur et
   utilise-la comme valeur de `BREVO_SENDER_EMAIL`.

Je peux te guider pas à pas en direct si tu partages ton navigateur (extension Claude in
Chrome) pendant que tu es connectée à Brevo et à ton registrar — dis-le-moi si tu veux
procéder comme ça plutôt qu'en autonome.

## 4. Point à vérifier après déploiement (non garanti à 100% sans test réel)

- Le code profil est ajouté en paramètre `title` (identifiant de la question personnalisée
  cal.eu) **et** en `notes` (filet de sécurité) sur les liens de réservation. Fais une vraie
  réservation test pour confirmer qu'il apparaît bien pré-rempli dans le formulaire cal.eu.
- Le contenu exact du payload `BOOKING_PAID` / `MEETING_ENDED` (où se trouve la valeur du code
  profil) est basé sur la documentation Cal.com ; à confirmer avec un vrai webhook reçu (les
  logs de la fonction Netlify affichent un avertissement si le code profil n'est pas trouvé).
- L'email post-séance est volontairement générique car `MEETING_ENDED` se déclenche après
  **chaque** séance d'un forfait à plusieurs séances, pas seulement la dernière.

## 5. Ce qui n'est pas couvert ici

- Aucune donnée bancaire ne transite par le site ou par cette fonction : le paiement reste
  entièrement géré par cal.eu/Stripe.
- Pas de suivi du nombre de séances déjà effectuées par client (nécessaire si tu veux un email
  différent à la dernière séance d'un forfait) — à construire séparément si besoin.
