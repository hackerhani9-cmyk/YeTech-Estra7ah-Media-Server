* {
  box-sizing: border-box;
}

:root {
  --bg: #070b17;
  --panel: rgba(15, 23, 42, 0.88);
  --panel-strong: rgba(17, 24, 39, 0.96);
  --soft: rgba(148, 163, 184, 0.14);
  --text: #ebf3ff;
  --muted: #a6b4cf;
  --brand-color: #8b5cf6;
  --border: rgba(148, 163, 184, 0.2);
  --shadow: 0 20px 60px rgba(15, 23, 42, 0.45);
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background:
    radial-gradient(circle at top, rgba(91, 33, 182, 0.2), transparent 36%),
    linear-gradient(180deg, #020817, #0b1120 30%, #101827 100%);
  color: var(--text);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

button,
input {
  font: inherit;
}

img {
  max-width: 100%;
  display: block;
}

.app-shell {
  min-height: 100vh;
  width: min(1600px, calc(100vw - 24px));
  margin: 0 auto;
  padding-bottom: 48px;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  margin-top: 12px;
  border: 1px solid var(--border);
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--brand-color), #4f46e5);
  color: white;
  font-weight: 800;
  font-size: 1.4rem;
  overflow: hidden;
}

.brand-mark img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.eyebrow {
  margin: 0 0 6px;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.eyebrow.muted {
  color: rgba(255, 255, 255, 0.8);
}

.topbar h1,
.hero-copy h3,
.section-head h4,
.banner h2,
.modal-head h3 {
  margin: 0;
}

.top-links {
  display: flex;
  align-items: center;
  gap: 18px;
}

.top-links a {
  text-decoration: none;
  color: var(--muted);
}

.primary-btn,
.ghost-btn,
.mini-btn {
  border: none;
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.primary-btn {
  background: linear-gradient(135deg, var(--brand-color), #4f46e5);
  color: white;
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.45);
}

.primary-btn:hover,
.ghost-btn:hover,
.mini-btn:hover {
  transform: translateY(-1px);
}

.ghost-btn {
  background: rgba(148, 163, 184, 0.08);
  border: 1px solid var(--border);
  color: var(--text);
}

.primary-btn.small,
.ghost-btn.small,
.mini-btn {
  padding: 0.5rem 0.9rem;
  font-size: 0.85rem;
}

.banner {
  margin-top: 18px;
  min-height: 220px;
  border-radius: 26px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 22px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.placeholder-banner {
  background: linear-gradient(135deg, rgba(91, 33, 182, 0.9), rgba(17, 24, 39, 0.8));
}

.banner h2 {
  font-size: clamp(1.6rem, 2vw, 2.5rem);
}

.banner span {
  display: inline-block;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.8);
}

.dashboard {
  margin-top: 20px;
  display: grid;
  gap: 20px;
}

.hero {
  display: grid;
  grid-template-columns: 2fr 1.2fr;
  gap: 20px;
  padding: 22px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--border);
  border-radius: 24px;
  box-shadow: var(--shadow);
}

.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-copy h3 {
  font-size: clamp(1.9rem, 2.6vw, 3rem);
  margin-bottom: 12px;
}

.hero-copy p {
  color: var(--muted);
  line-height: 1.8;
  margin: 0;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.live-player {
  display: grid;
  gap: 12px;
  align-content: center;
}

.video-shell {
  position: relative;
  min-height: 240px;
  border-radius: 22px;
  border: 1px solid var(--border);
  background:
    linear-gradient(rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.72)),
    radial-gradient(circle at center, rgba(91, 33, 182, 0.6), rgba(30, 41, 59, 0.95));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
}

.play-indicator {
  width: 74px;
  height: 74px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: white;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 50px rgba(99, 102, 241, 0.5);
}

.live-list {
  display: grid;
  gap: 10px;
}

.stream-row,
.watch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  background: rgba(148, 163, 184, 0.06);
  border: 1px solid var(--border);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.stat-card {
  display: grid;
  gap: 8px;
  padding: 22px 18px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid var(--border);
}

.stat-card span {
  color: var(--muted);
}

.stat-card strong {
  font-size: clamp(1.2rem, 2vw, 2rem);
}

.media-section,
.watchlist-panel {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 22px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.media-card {
  overflow: hidden;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--border);
}

.poster {
  display: grid;
  place-items: center;
  height: 220px;
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  background: linear-gradient(140deg, rgba(91, 33, 182, 0.86), rgba(30, 41, 59, 0.8));
}

.media-info {
  padding: 14px;
}

.media-info h5,
.media-info p {
  margin: 0 0 10px;
}

.media-info p {
  color: var(--muted);
}

.tag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.tag-row span,
.episode-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.15);
  color: #dfe7ff;
  padding: 0.25rem 0.7rem;
  font-size: 0.75rem;
}

.tag-row button {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.4rem 0.8rem;
}

.watchlist-list {
  display: grid;
  gap: 12px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.72);
  display: grid;
  place-items: center;
  z-index: 50;
  padding: 24px;
}

.admin-modal {
  width: min(640px, 100%);
  background: rgba(15, 23, 42, 0.96);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 24px;
  box-shadow: var(--shadow);
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.admin-form {
  display: grid;
  gap: 16px;
}

.admin-form label {
  display: grid;
  gap: 8px;
  color: var(--muted);
}

.admin-form input {
  width: 100%;
  border: 1px solid var(--border);
  background: rgba(15, 23, 42, 0.9);
  color: var(--text);
  border-radius: 12px;
  padding: 0.85rem 1rem;
}

.upload-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 900px) {
  .topbar,
  .hero,
  .stats-grid,
  .upload-row {
    grid-template-columns: 1fr;
  }

  .topbar {
    display: grid;
    justify-content: stretch;
  }

  .top-links {
    flex-wrap: wrap;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .app-shell {
    width: min(100vw - 16px, 100%);
  }

  .topbar,
  .media-section,
  .watchlist-panel,
  .hero,
  .stat-card {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .top-links {
    justify-content: flex-start;
    gap: 10px;
  }

  .brand-block {
    width: 100%;
  }

  .primary-btn,
  .ghost-btn {
    width: 100%;
  }
}

@media (min-width: 1600px) {
  .media-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (min-width: 1920px) {
  .media-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}
