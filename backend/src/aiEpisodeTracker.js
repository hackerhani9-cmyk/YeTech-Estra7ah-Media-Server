const fs = require('fs');
const path = require('path');
const db = require('./db');

function safeTitle(title) {
  return String(title || 'series')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function runAiTracker() {
  const watchlists = db.prepare('SELECT * FROM auto_watchlists WHERE status = ? ORDER BY id ASC').all('active');
  const log = [];

  watchlists.forEach((watchlist) => {
    const nextEpisode = Number(watchlist.latest_downloaded_episode || 0) + 1;
    const targetFolder = path.join(__dirname, '..', 'downloads', safeTitle(watchlist.series_title), `Season 1`);
    fs.mkdirSync(targetFolder, { recursive: true });

    const fileName = `EP${nextEpisode}.mp4`;
    const filePath = path.join(targetFolder, fileName);
    fs.writeFileSync(filePath, `Mock AI Download - ${watchlist.series_title} - ${fileName}\n`);

    db.prepare(`
      INSERT OR IGNORE INTO media_items (title, type, file_path, file_size, duration, category, poster_url, description, updated_at)
      VALUES (?, 'series', ?, 1200000, 1600, 'Series', '', 'AI synced episode download', datetime('now'))
    `).run(`${watchlist.series_title} - Season 1`, filePath);

    db.prepare(`
      INSERT INTO episodes (media_id, season_number, episode_number, title, file_path, duration)
      SELECT id, 1, ?, ?, ?, 1600 FROM media_items WHERE title = ? AND type = 'series'
      ON CONFLICT DO NOTHING
    `).run(nextEpisode, `Episode ${nextEpisode}`, filePath, `${watchlist.series_title} - Season 1`);

    db.prepare('UPDATE auto_watchlists SET latest_downloaded_episode = ? WHERE id = ?').run(nextEpisode, watchlist.id);

    log.push({
      series_title: watchlist.series_title,
      episode_number: nextEpisode,
      file_path: filePath,
      schedule: watchlist.expected_schedule
    });
  });

  return log;
}

function getWatchlists() {
  const rows = db.prepare('SELECT * FROM auto_watchlists ORDER BY id ASC').all();
  return rows;
}

module.exports = { runAiTracker, getWatchlists };
