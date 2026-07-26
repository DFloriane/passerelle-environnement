// netlify/functions/cal-webhook.js
//
// Reçoit les webhooks cal.eu (Booking Paid, Meeting Ended) et envoie les emails
// transactionnels correspondants via l'API Brevo.
//
// ── Variables d'environnement requises (Netlify > Site configuration > Environment variables,
//    JAMAIS commitées dans le code) ──
//   CAL_WEBHOOK_SECRET   — le secret défini en créant le webhook dans cal.eu
//   BREVO_API_KEY        — clé API Brevo (Brevo > Settings > SMTP & API > API Keys)
//   BREVO_SENDER_EMAIL   — adresse expéditrice vérifiée dans Brevo (ex: contact@passerelle-environnement.fr)
//   BREVO_SENDER_NAME    — nom affiché de l'expéditeur (ex: Floriane Dybul - Passerelle Environnement)
//
// ── Configuration côté cal.eu (Settings > Developer > Webhooks > Add) ──
//   URL d'abonnement : https://passerelle-environnement.fr/.netlify/functions/cal-webhook
//   Déclencheurs à cocher : Booking Paid, Meeting Ended
//   Secret : la même valeur que CAL_WEBHOOK_SECRET ci-dessus
//
// ── Note sur le code profil ──
// La question personnalisée "code profil" réutilise le champ système "title" (identifiant
// technique conservé même si son libellé affiché a été renommé côté cal.eu). Sa valeur
// apparaît dans payload.responses.title.value (BOOKING_PAID, structure imbriquée) ou
// responses.title.value (MEETING_ENDED, structure plate). Le site ajoute aussi le code en
// double dans le champ "notes" au moment de la réservation (voir questionnaire.html), en
// filet de sécurité si le pré-remplissage de "title" ne fonctionnait pas comme attendu —
// à vérifier avec une vraie réservation test avant mise en production.

const crypto = require('crypto');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const secret = process.env.CAL_WEBHOOK_SECRET;
  const rawBody = event.body || '';
  const signatureHeader =
    (event.headers && (event.headers['x-cal-signature-256'] || event.headers['X-Cal-Signature-256'])) || '';

  if (!secret) {
    console.error('CAL_WEBHOOK_SECRET manquant côté Netlify : webhook rejeté par sécurité.');
    return { statusCode: 500, body: 'Configuration manquante' };
  }

  const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  if (!signatureHeader || !safeEqual(signatureHeader, expectedSignature)) {
    console.warn('Signature cal.eu invalide ou absente, requête rejetée.');
    return { statusCode: 401, body: 'Signature invalide' };
  }

  let data;
  try {
    data = JSON.parse(rawBody);
  } catch (err) {
    return { statusCode: 400, body: 'JSON invalide' };
  }

  const triggerEvent = data.triggerEvent;

  try {
    if (triggerEvent === 'BOOKING_PAID') {
      await handleBookingPaid(data.payload || {});
    } else if (triggerEvent === 'MEETING_ENDED') {
      // MEETING_ENDED utilise une structure plate : pas de wrapper "payload".
      await handleMeetingEnded(data);
    } else {
      console.log(`cal-webhook : événement ignoré (${triggerEvent}).`);
    }
  } catch (err) {
    // On loggue mais on répond quand même 200 : cal.eu réessaie sinon indéfiniment un
    // événement dont l'échec (ex: Brevo indisponible) ne se résoudra pas tout seul.
    // Surveiller les logs Netlify Functions pour détecter ces échecs silencieux.
    console.error('cal-webhook : erreur de traitement :', err);
  }

  return { statusCode: 200, body: 'ok' };
};

function safeEqual(a, b) {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function extractCodeProfil(payloadLike) {
  const responses = (payloadLike && payloadLike.responses) || (payloadLike && payloadLike.userFieldsResponses) || {};
  if (responses.title && responses.title.value) return responses.title.value;
  return null;
}

function formatDateHeureParis(isoString) {
  try {
    return new Date(isoString).toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      dateStyle: 'full',
      timeStyle: 'short'
    });
  } catch (err) {
    return isoString;
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

async function handleBookingPaid(payload) {
  const attendee = (payload.attendees && payload.attendees[0]) || {};
  const email = attendee.email;
  if (!email) {
    console.warn('BOOKING_PAID sans email de participant, email non envoyé.');
    return;
  }
  const prenom = (attendee.name || '').split(' ')[0] || '';
  const codeProfil = extractCodeProfil(payload);
  const dateHeure = payload.startTime ? formatDateHeureParis(payload.startTime) : null;
  const forfait = payload.eventTitle || payload.title || 'votre accompagnement';
  const montant =
    payload.price != null
      ? `${(payload.price / 100).toFixed(0)} ${(payload.currency || 'EUR').toUpperCase()}`
      : null;

  const html = `
    <p>Bonjour ${escapeHtml(prenom)},</p>
    <p>Merci pour votre confiance ! Votre paiement a bien été reçu et votre rendez-vous est confirmé :</p>
    <ul>
      <li><strong>Formule :</strong> ${escapeHtml(forfait)}</li>
      ${dateHeure ? `<li><strong>Date et heure :</strong> ${escapeHtml(dateHeure)} (heure de Paris)</li>` : ''}
      ${montant ? `<li><strong>Montant réglé :</strong> ${escapeHtml(montant)}</li>` : ''}
      ${codeProfil ? `<li><strong>Votre code profil :</strong> ${escapeHtml(codeProfil)}</li>` : ''}
    </ul>
    <p>Vous recevrez par ailleurs, directement de la part de cal.eu, la confirmation de rendez-vous
    avec le lien de visioconférence.</p>
    <p>À très vite,<br>Floriane</p>
  `;

  await sendBrevoEmail({
    to: email,
    toName: attendee.name,
    subject: 'Votre rendez-vous est confirmé · Passerelle Environnement',
    html
  });
}

async function handleMeetingEnded(payload) {
  const attendee = (payload.attendees && payload.attendees[0]) || {};
  const email = attendee.email;
  if (!email) {
    console.warn('MEETING_ENDED sans email de participant, email non envoyé.');
    return;
  }
  const prenom = (attendee.name || '').split(' ')[0] || '';

  // NOTE : ce webhook se déclenche après CHAQUE séance d'un forfait à plusieurs séances
  // (Clarification : 4 séances, Ciblé : 3, Stratégique : 2), pas seulement à la dernière.
  // Le texte reste donc volontairement générique — à affiner si Floriane veut un message
  // différent pour la dernière séance d'un forfait (nécessiterait de suivre le nombre de
  // séances déjà eues, non fait ici).
  const html = `
    <p>Bonjour ${escapeHtml(prenom)},</p>
    <p>Merci pour notre échange. J'espère qu'il vous a apporté des pistes concrètes.</p>
    <p>N'hésitez pas à me recontacter si une question vous revient d'ici notre prochain rendez-vous.</p>
    <p>À bientôt,<br>Floriane</p>
  `;

  await sendBrevoEmail({
    to: email,
    toName: attendee.name,
    subject: 'Merci pour notre échange · Passerelle Environnement',
    html
  });
}

async function sendBrevoEmail({ to, toName, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'Passerelle Environnement';

  if (!apiKey || !senderEmail) {
    console.error('BREVO_API_KEY ou BREVO_SENDER_EMAIL manquant côté Netlify, email non envoyé.');
    return;
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email: to, name: toName || undefined }],
      subject,
      htmlContent: html
    })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Échec envoi Brevo (${res.status}) : ${text}`);
  }
}
