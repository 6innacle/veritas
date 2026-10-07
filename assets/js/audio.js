// Price Check — audio playback + volume persistence.
// Exposes window.GameAudio = { init, playSfx, setMusicVolume, setSfxVolume, getMusicVolume, getSfxVolume }
window.GameAudio = (function () {
  const AUDIO_KEY = 'priceCheckAudioSettings';
  const cfg = window.GAME_AUDIO || { bgm: '', sfx: {}, default_music_volume: 0.5, default_sfx_volume: 0.7 };

  let bgmEl = null;
  let musicVolume = cfg.default_music_volume;
  let sfxVolume = cfg.default_sfx_volume;
  let bgmStarted = false;

  function loadSettings() {
    try {
      const raw = localStorage.getItem(AUDIO_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (typeof saved.music === 'number') musicVolume = saved.music;
      if (typeof saved.sfx === 'number') sfxVolume = saved.sfx;
    } catch (e) { /* ignore, defaults stand */ }
  }

  function saveSettings() {
    try {
      localStorage.setItem(AUDIO_KEY, JSON.stringify({ music: musicVolume, sfx: sfxVolume }));
    } catch (e) { /* ignore */ }
  }

  function init(bgmElement) {
    bgmEl = bgmElement;
    loadSettings();
    if (bgmEl && cfg.bgm) {
      bgmEl.src = cfg.bgm;
      bgmEl.volume = musicVolume;
    }
  }

  // Browsers block autoplay until a user gesture — call this from the
  // first click handler you have (e.g. the Start button).
  function startBgmOnGesture() {
    if (bgmStarted || !bgmEl || !cfg.bgm) return;
    bgmStarted = true;
    bgmEl.play().catch(() => { /* file missing or still blocked — fine, stay silent */ });
  }

  function playSfx(key) {
    if (sfxVolume <= 0) return;
    const src = (cfg.sfx && cfg.sfx[key]) || (cfg.sfx && cfg.sfx.click);
    if (!src) return;
    const a = new Audio(src);
    a.volume = sfxVolume;
    a.play().catch(() => { /* file missing — fine, stay silent */ });
  }

  function setMusicVolume(v) {
    musicVolume = Math.min(1, Math.max(0, v));
    if (bgmEl) bgmEl.volume = musicVolume;
    saveSettings();
  }

  function setSfxVolume(v) {
    sfxVolume = Math.min(1, Math.max(0, v));
    saveSettings();
  }

  function getMusicVolume() { return musicVolume; }
  function getSfxVolume() { return sfxVolume; }

  return { init, startBgmOnGesture, playSfx, setMusicVolume, setSfxVolume, getMusicVolume, getSfxVolume };
})();
