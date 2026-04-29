export const config = { api: { bodyParser: { sizeLimit: '8mb' } } };

const SECTIONS = ['jcazt-style', 'minis-fineline', 'conceptual', 'nuevo'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const pwd = req.headers['x-admin-password'];
  if (!pwd || pwd !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { section, filename, data, mimetype } = req.body || {};

  if (!section || !SECTIONS.includes(section)) {
    return res.status(400).json({ error: 'Sección inválida' });
  }
  if (!filename || !data) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const base64 = data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${section}/${Date.now()}_${safeName}`;

  const r = await fetch(
    `${process.env.SUPABASE_URL}/storage/v1/object/tattoos/${path}`,
    {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': mimetype || 'image/jpeg',
        'x-upsert': 'false',
      },
      body: buffer,
    }
  );

  if (!r.ok) {
    const err = await r.text();
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Error al subir imagen' });
  }

  const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/tattoos/${path}`;
  return res.status(200).json({ ok: true, url, path });
}
