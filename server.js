import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const SITE_URL = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: true, legacyHeaders: false }));

app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

function isThreadsUrl(value) {
  try {
    const u = new URL(value);
    const host = u.hostname.toLowerCase();
    return (host === 'threads.net' || host.endsWith('.threads.net') || host === 'threads.com' || host.endsWith('.threads.com')) && /\/(@[^/]+\/post|t)\//.test(u.pathname);
  } catch { return false; }
}

app.post('/api/resolve', async (req, res) => {
  const { url, rightsConfirmed } = req.body || {};
  if (!rightsConfirmed) return res.status(400).json({ error: '다운로드 권한 확인이 필요합니다.' });
  if (!isThreadsUrl(url)) return res.status(400).json({ error: '올바른 Threads 게시물 링크를 입력해 주세요.' });

  const resolver = process.env.THREADS_RESOLVER_URL;
  const apiKey = process.env.THREADS_RESOLVER_API_KEY;
  if (!resolver) {
    return res.status(503).json({
      error: '영상 리졸버가 아직 연결되지 않았습니다.',
      setupRequired: true,
      message: '승인된 Threads 미디어 API 또는 사용 권한이 있는 리졸버를 THREADS_RESOLVER_URL 환경변수로 연결하세요.'
    });
  }

  try {
    const response = await fetch(resolver, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}) },
      body: JSON.stringify({ url })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(502).json({ error: data.error || '영상 정보를 가져오지 못했습니다.' });
    const items = Array.isArray(data.items) ? data.items : [];
    const safeItems = items.filter(i => typeof i?.url === 'string' && /^https:\/\//.test(i.url)).map(i => ({
      url: i.url,
      quality: String(i.quality || '원본'),
      format: String(i.format || 'MP4'),
      thumbnail: typeof i.thumbnail === 'string' ? i.thumbnail : null
    }));
    if (!safeItems.length) return res.status(404).json({ error: '다운로드 가능한 공개 영상을 찾지 못했습니다.' });
    res.json({ items: safeItems });
  } catch (e) {
    res.status(502).json({ error: '외부 영상 서비스 연결에 실패했습니다.' });
  }
});

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
});
app.get('/sitemap.xml', (_req, res) => {
  const pages = ['', '/guide.html', '/terms.html', '/privacy.html', '/copyright.html'];
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p => `<url><loc>${SITE_URL}${p || '/'}</loc></url>`).join('')}</urlset>`);
});

app.listen(PORT, () => console.log(`Running on ${SITE_URL}`));
