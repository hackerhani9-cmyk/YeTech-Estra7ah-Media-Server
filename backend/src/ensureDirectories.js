const fs = require('fs');
const path = require('path');
const db = require('./db');
const { defaultSettings, defaultMediaItems, defaultWatchlists } = require('./mockData');

function ensureDirectories() {
  const dirs = [
    path.join(__dirname, '..', 'data'),
    path.join(__dirname, '..', 'storage', 'branding'),
    path.join(__dirname, '..', 'media'),
    path.join(__dirname, '..', 'downloads')
  ];

  dirs.forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

  const placeholderPath = path.join(__dirname, '..', 'media', 'demo-stream.txt');
  if (!fs.existsSync(placeholderPath)) {
    fs.writeFileSync(placeholderPath, 'Local sample placeholder for streaming and demo content.');
  }
}

function initializeDatabase() {
  ensureDirectories();

  db.exec(`
    CREATE TABLE IF NOT EXISTS network_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('movie', 'series', 'book', 'audio', 'app', 'live')),
      file_path TEXT,
      file_size INTEGER DEFAULT 0,
      duration INTEGER DEFAULT 0,
      category TEXT,
      poster_url TEXT,
      description TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS episodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      media_id INTEGER NOT NULL,
      season_number INTEGER DEFAULT 1,
      episode_number INTEGER DEFAULT 1,
      title TEXT NOT NULL,
      file_path TEXT,
      duration INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS auto_watchlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      series_title TEXT NOT NULL,
      target_feed_url TEXT,
      expected_schedule TEXT,
      latest_downloaded_episode INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active'
    );
  `);

  const upsertSetting = db.prepare(
    `INSERT INTO network_settings (setting_key, setting_value)
     VALUES (?, ?)
     ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value`
  );

  Object.entries(defaultSettings).forEach(([key, value]) => {
    upsertSetting.run(key, String(value));
  });

  const mediaCount = db.prepare('SELECT COUNT(*) AS count FROM media_items').get().count;
  if (mediaCount === 0) {
    const insertMedia = db.prepare(`
      INSERT INTO media_items (title, type, file_path, file_size, duration, category, poster_url, description, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    defaultMediaItems.forEach((item) => {
      insertMedia.run(
        item.title,
        item.type,
        item.file_path,
        item.file_size,
        item.duration,
        item.category,
        item.poster_url,
        item.description
      );
    });
  }

  const watchlistCount = db.prepare('SELECT COUNT(*) AS count FROM auto_watchlists').get().count;
  if (watchlistCount === 0) {
    const insertWatchlist = db.prepare(`
      INSERT INTO auto_watchlists (series_title, target_feed_url, expected_schedule, latest_downloaded_episode, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    defaultWatchlists.forEach((item) => {
      insertWatchlist.run(
        item.series_title,
        item.target_feed_url,
        item.expected_schedule,
        item.latest_downloaded_episode,
        item.status
      );
    });
  }

  const sampleSeries = db.prepare(`SELECT * FROM media_items WHERE type = 'series' LIMIT 1`).get();
  if (sampleSeries) {
    const episodeCount = db.prepare('SELECT COUNT(*) AS count FROM episodes WHERE media_id = ?').get(sampleSeries.id).count;
    if (episodeCount === 0) {
      const insertEpisode = db.prepare(`
        INSERT INTO episodes (media_id, season_number, episode_number, title, file_path, duration)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      ['Episode 1', 'Episode 2', 'Episode 3', 'Episode 4'].forEach((title, index) => {
        insertEpisode.run(
          sampleSeries.id,
          1,
          index + 1,
          title,
          `media/series/${sampleSeries.title.replace(/\s+/g, '_')}/Season 1/${index + 1}.mp4`,
          1480
        );
      });
    }
  }
}

module.exports = { initializeDatabase, ensureDirectories };
