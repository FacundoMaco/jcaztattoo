const SECTIONS = ['jcazt-style', 'minis-fineline', 'conceptual', 'nuevo'];

function auth(req) {
  const pwd = req.headers['x-admin-password'] || req.query.p;
  return pwd && pwd === process.env.ADMIN_PASSWORD;
}

async function supabase(path, opts = {}) {
  return fetch(`${process.env.SUPABASE_URL}/storage/v1${path}`, {
    ...opts,
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — list images (public, no auth needed)
  if (req.method === 'GET') {
    const section = req.query.section;
    const targets = section && SECTIONS.includes(section) ? [section] : SECTIONS;

    const results = {};
    for (const sec of targets) {
      const r = await supabase(`/object/list/tattoos`, {
        method: 'POST',
        body: JSON.stringify({ prefix: `${sec}/`, limit: 200, sortBy: { column: 'created_at', order: 'desc' } }),
      });
      const files = await r.json();
      results[sec] = Array.isArray(files)
        ? files
            .filter(f => f.name && /\.(jpe?g|png|webp)$/i.test(f.name))
            .map(f => ({
              name: f.name,
              path: `${sec}/${f.name}`,
              url: `${process.env.SUPABASE_URL}/storage/v1/object/public/tattoos/${sec}/${f.name}`,
              created_at: f.created_at,
              size: f.metadata?.size,
            }))
        : [];
    }

    return res.status(200).json({ images: results });
  }

  // DELETE — requires auth
  if (req.method === 'DELETE') {
    if (!auth(req)) return res.status(401).json({ error: 'No autorizado' });

    const { path } = req.body || {};
    if (!path) return res.status(400).json({ error: 'Falta el path' });

    const r = await supabase(`/object/tattoos`, {
      method: 'DELETE',
      body: JSON.stringify({ prefixes: [path] }),
    });

    if (!r.ok) return res.status(500).json({ error: 'Error al eliminar' });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
