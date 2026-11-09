const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const db = require('./src/db');
const { initializeDatabase } = require('./src/initDb');
const { runAiTracker, getWatchlists } = require('./src/aiEpisodeTracker');
const { syncMediaIndex } = require('./src/mediaScanner');

initializeDatabase();
syncMediaIndex();
runAiTracker();

const app = express();
const PORT = 4000;
const brandingDir = path.join(__dirname, 'storage', 'branding');
const mediaRoot = path.join(__dirname, 'media');

fs.mkdirSync(brandingDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, brandingDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/branding', express.static(brandingDir));

function getSettings() {
  const rows = db.prepare('SELECT setting_key, setting_value FROM network_settings').all();
  const settings = {};
  rows.forEach((row) => {
    settings[row.setting_key] = row.setting_value;
  });

  return {
    network_name: settings.network_name || 'إستراحة - YeTech',
    primary_color: settings.primary_color || '#8b5cf6',
    logo_url: settings.logo_url || '',
    banner_url: settings.banner_url || ''
  };
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'healthy', name: 'YeTech Estra7ah Media Server' });
});

app.get('/api/settings', (req, res) => {
  res.json(getSettings());
});

app.post('/api/settings', (req, res) => {
  const { network_name, primary_color, logo_url, banner_url } = req.body || {};
  const upsert = db.prepare(`
    INSERT INTO network_settings (setting_key, setting_value)
    VALUES (?, ?)
    ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value
  `);

  if (network_name) upsert.run('network_name', network_name);
  if (primary_color) upsert.run('primary_color', primary_color);
  if (logo_url) upsert.run('logo_url', logo_url);
  if (banner_url) upsert.run('banner_url', banner_url);

  res.json({ ok: true, settings: getSettings() });
});

app.post('/api/admin/branding-upload', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), (req, res) => {
  const files = req.files || {};
  const result = {};

  if (files.logo) {
    result.logo_url = `/branding/${files.logo[0].filename}`;
    db.prepare(`INSERT INTO network_settings (setting_key, setting_value)
      VALUES ('logo_url', ?)
      ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value`).run(result.logo_url);
  }

  if (files.banner) {
    result.banner_url = `/branding/${files.banner[0].filename}`;
    db.prepare(`INSERT INTO network_settings (setting_key, setting_value)
      VALUES ('banner_url', ?)
      ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value`).run(result.banner_url);
  }

  res.json({ ok: true, ...result, settings: getSettings() });
});

app.get('/api/media', (req, res) => {
  const { type } = req.query;
  let query = 'SELECT * FROM media_items';
  const params = [];

  if (type) {
    query += ' WHERE type = ?';
    params.push(type);
  }

  query += ' ORDER BY updated_at DESC';
  const rows = db.prepare(query).all(...params);
  res.json(rows);
});

app.get('/api/series/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM media_items WHERE id = ?').get(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Series not found' });

  const episodes = db.prepare('SELECT * FROM episodes WHERE media_id = ? ORDER BY episode_number ASC').all(item.id);
  res.json({ item, episodes });
});

app.get('/api/live', (req, res) => {
  res.json([
    { id: 'cam-1', title: 'الكاميرا الرئيسية', url: 'https://example.com/stream/cam1.m3u8', kind: 'hls' },
    { id: 'cam-2', title: 'البث المحلي', url: 'rtsp://192.168.1.50:554/stream1', kind: 'rtsp' }
  ]);
});

app.get('/api/watchlists', (req, res) => {
  res.json(getWatchlists());
});

app.post('/api/watchlists', (req, res) => {
  const { series_title, target_feed_url, expected_schedule, latest_downloaded_episode = 0 } = req.body || {};
  if (!series_title) return res.status(400).json({ error: 'series_title is required' });

  const result = db.prepare(`
    INSERT INTO auto_watchlists (series_title, target_feed_url, expected_schedule, latest_downloaded_episode, status)
    VALUES (?, ?, ?, ?, 'active')
  `).run(series_title, target_feed_url || '', expected_schedule || 'every_thursday', latest_downloaded_episode);

  res.json({ ok: true, id: result.lastInsertRowid });
});

app.post('/api/ai/scan', (req, res) => {
  const results = runAiTracker();
  res.json({ ok: true, results });
});

app.get('/api/stream/:id', (req, res) => {
  const fileName = req.params.id;
  const filePath = path.join(mediaRoot, `${fileName}.mp4`);
  const fallbackPath = path.join(mediaRoot, 'demo-stream.txt');
  const target = fs.existsSync(filePath) ? filePath : fallbackPath;

  if (!fs.existsSync(target)) {
    return res.status(404).json({ error: 'Media file not found' });
  }

  const stat = fs.statSync(target);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 1024 * 1024, fileSize - 1);
    const chunkSize = end - start + 1;
    const stream = fs.createReadStream(target, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4'
    });

    stream.pipe(res);
    return;
  }

  res.writeHead(200, {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes'
  });

  fs.createReadStream(target).pipe(res);
});

app.get('/api/download/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM media_items WHERE id = ?').get(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Download not found' });

  const filename = path.basename(item.file_path || 'download-file.bin');
  const target = path.join(__dirname, item.file_path || 'downloads/default.bin');

  if (!fs.existsSync(target)) {
    const fallback = path.join(__dirname, 'downloads', 'demo-download.bin');
    fs.writeFileSync(fallback, 'Mock downloadable asset for LAN network demo.');
    return res.download(fallback, filename);
  }

  res.download(target, filename);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`YeTech Estra7ah backend running on http://0.0.0.0:${PORT}`);
});
