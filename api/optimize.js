// M0: answers a POST with whether the key is configured. Never reads the key's value into a response.
const ALLOWED_ORIGINS = [
  'https://lumen-theta-ten.vercel.app',
  'https://lumen-oncore1.vercel.app',
];

function originAllowed(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return /^http:\/\/localhost(:\d+)?$/.test(origin);
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return Response.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
    }
    if (!originAllowed(request.headers.get('origin'))) {
      return Response.json({ ok: false, error: 'bad_origin' }, { status: 403 });
    }
    return Response.json({ ok: true, keyConfigured: Boolean(process.env.ANTHROPIC_API_KEY) });
  },
};
