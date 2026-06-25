// Meta Conversions API (CAPI) — evento Lead server-side.
// Se ejecuta como Serverless Function de Vercel (ruta: /api/capi-lead).
// No usa dependencias externas: solo 'crypto' nativo + fetch global (Node 18+).
//
// Variables de entorno requeridas en Vercel (Project Settings → Environment Variables):
//   META_CAPI_TOKEN  -> token de acceso de la Conversions API (SECRETO, nunca en el repo)
//   META_PIXEL_ID    -> opcional; por defecto usa el pixel del sitio
//
// El navegador dispara el mismo evento Lead con el mismo event_id, y Meta
// deduplica ambos (browser + servidor) para no contar doble.

var crypto = require('crypto');

var PIXEL_ID = process.env.META_PIXEL_ID || '997300713288599';
var GRAPH_VERSION = 'v21.0';

// Hash SHA-256 en minúsculas, requerido por Meta para los datos personales.
function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// Normaliza y hashea un email: minúsculas + sin espacios.
function hashEmail(email) {
  if (!email) return null;
  return sha256(String(email).trim().toLowerCase());
}

// Normaliza y hashea un teléfono: solo dígitos (con código de país, sin '+').
function hashPhone(phone) {
  if (!phone) return null;
  var digits = String(phone).replace(/[^0-9]/g, '');
  if (!digits) return null;
  return sha256(digits);
}

// Normaliza y hashea un nombre o apellido: minúsculas + sin espacios extremos.
function hashName(name) {
  if (!name) return null;
  return sha256(String(name).trim().toLowerCase());
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  var token = process.env.META_CAPI_TOKEN;
  if (!token) {
    // Sin token configurado no podemos enviar; respondemos sin romper el flujo del cliente.
    res.status(200).json({ ok: false, reason: 'META_CAPI_TOKEN no configurado' });
    return;
  }

  var body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  // Nombre completo -> primer nombre / apellido para mejorar el match.
  var firstName = null;
  var lastName = null;
  if (body.name) {
    var parts = String(body.name).trim().split(/\s+/);
    firstName = parts.shift() || null;
    lastName = parts.length ? parts.join(' ') : null;
  }

  // IP y user agent reales del visitante (claves fuertes de emparejamiento).
  var forwarded = req.headers['x-forwarded-for'];
  var clientIp = forwarded ? String(forwarded).split(',')[0].trim() : (req.socket && req.socket.remoteAddress) || undefined;
  var userAgent = req.headers['user-agent'] || undefined;

  var userData = {};
  var em = hashEmail(body.email); if (em) userData.em = [em];
  var ph = hashPhone(body.phone); if (ph) userData.ph = [ph];
  var fn = hashName(firstName); if (fn) userData.fn = [fn];
  var ln = hashName(lastName); if (ln) userData.ln = [ln];
  if (body.fbp) userData.fbp = body.fbp;   // cookie _fbp del navegador
  if (body.fbc) userData.fbc = body.fbc;   // click-id de Meta (de fbclid)
  if (clientIp) userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;

  var eventData = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: body.event_source_url || undefined,
    event_id: body.event_id || undefined, // dedup con el evento del navegador
    user_data: userData
  };

  var payload = { data: [eventData] };
  if (body.test_event_code) {
    payload.test_event_code = body.test_event_code; // solo para "Probar eventos"
  }

  var url = 'https://graph.facebook.com/' + GRAPH_VERSION + '/' + PIXEL_ID +
    '/events?access_token=' + encodeURIComponent(token);

  try {
    var fbRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    var result = await fbRes.json();

    if (!fbRes.ok) {
      res.status(200).json({ ok: false, reason: 'meta_error', detail: result });
      return;
    }
    res.status(200).json({ ok: true, result: result });
  } catch (err) {
    res.status(200).json({ ok: false, reason: 'fetch_failed', detail: String(err) });
  }
};
