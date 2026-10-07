(function () {
  const CFG = window.GAME_CONFIG;
  const ITEMS = window.GAME_ITEMS;
  const TXT = window.GAME_TEXT;
  const CUR = CFG.currency_symbol || '₱';
  const LB_KEY = 'priceCheckLeaderboard';

  const els = {
    photo: document.getElementById('itemPhoto'),
    img: document.getElementById('itemImg'),
    name: document.getElementById('itemName'),
    orig: document.getElementById('origPrice'),
    sale: document.getElementById('salePrice'),
    fill: document.getElementById('timerFill'),
    accept: document.getElementById('acceptBtn'),
    discard: document.getElementById('discardBtn'),
    feedback: document.getElementById('feedback'),
    round: document.getElementById('roundNum'),
    score: document.getElementById('scoreNum'),
    lives: document.getElementById('lives'),
    start: document.getElementById('startScreen'),
    over: document.getElementById('gameOverScreen'),
    settings: document.getElementById('settingsScreen'),
    finalScore: document.getElementById('finalScore'),
    finalRound: document.getElementById('finalRound'),
    playBtn: document.getElementById('playBtn'),
    retryBtn: document.getElementById('retryBtn'),
    saveBtn: document.getElementById('saveBtn'),
    nameInput: document.getElementById('nameInput'),
    leaderboard: document.getElementById('leaderboard'),
    settingsBtn: document.getElementById('settingsBtn'),
    exitBtn: document.getElementById('exitBtn'),
    closeSettingsBtn: document.getElementById('closeSettingsBtn'),
    musicSlider: document.getElementById('musicVolume'),
    sfxSlider: document.getElementById('sfxVolume'),
    bgmAudio: document.getElementById('bgmAudio'),
  };

  // ---- Text: pull every label from text.js so it's all editable in one place ----
  function applyText() {
    const map = {
      txtBrand: TXT.brand,
      txtRoundLabel: TXT.roundLabel,
      txtScoreLabel: TXT.scoreLabel,
      txtStartTitle: TXT.startTitle,
      txtStartP1: TXT.startParagraph1,
      txtStartP2: TXT.startParagraph2,
      txtStartP3: TXT.startParagraph3,
      playBtn: TXT.startButton,
      acceptBtn: TXT.acceptButton,
      discardBtn: TXT.discardButton,
      exitBtn: TXT.exitButton,
      settingsBtn: TXT.settingsButton,
      txtGameOverTitle: TXT.gameOverTitle,
      txtReachedRound: TXT.reachedRoundText,
      saveBtn: TXT.saveButton,
      retryBtn: TXT.retryButton,
      txtSettingsTitle: TXT.settingsTitle,
      txtMusicVolumeLabel: TXT.musicVolumeLabel,
      txtSfxVolumeLabel: TXT.sfxVolumeLabel,
      closeSettingsBtn: TXT.closeSettingsButton,
    };
    Object.keys(map).forEach(id => {
      const el = document.getElementById(id);
      if (el && map[id] !== undefined) el.textContent = map[id];
    });
    if (els.nameInput) els.nameInput.placeholder = TXT.namePlaceholder;
  }

  let state;
  function resetState() {
    state = { round: 1, score: 0, lives: CFG.starting_lives, roundActive: false, timers: [], saved: false };
  }

  function clearTimers() { state.timers.forEach(t => clearTimeout(t)); state.timers = []; }

  function fmt(p) { return CUR + Math.round(p).toLocaleString(); }
  function randBetween(min, max) { return min + Math.random() * (max - min); }

  function roundSeconds(round) {
    const t = CFG.round_start_seconds - (round - 1) * CFG.round_decrement_seconds;
    return Math.max(CFG.min_round_seconds, t);
  }

  function markupPrice(base) {
    const pct = randBetween(CFG.markup_min_percent, CFG.markup_max_percent) / 100;
    return Math.round(base * (1 + pct));
  }

  function inflatedOrigPrice(orig) {
    const pct = randBetween(CFG.twist_orig_increase_min_percent, CFG.twist_orig_increase_max_percent) / 100;
    return Math.round(orig * (1 + pct));
  }

  function slashedSalePrice(sale) {
    const pct = randBetween(CFG.twist_sale_decrease_min_percent, CFG.twist_sale_decrease_max_percent) / 100;
    return Math.round(sale * (1 - pct));
  }

  function updateHUD() {
    els.round.textContent = state.round;
    els.score.textContent = state.score;
    let html = '';
    for (let i = 0; i < CFG.starting_lives; i++) {
      html += `<span class="${i < state.lives ? 'full' : 'empty'}"></span>`;
    }
    els.lives.innerHTML = html;
  }

  function startRound() {
    if (state.lives <= 0) return endGame();
    state.roundActive = true;
    els.accept.disabled = false; els.discard.disabled = false;
    els.feedback.textContent = '';
    clearTimers();

    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    let salePrice = item.price;
    let origPrice = markupPrice(salePrice);

    // Decided right now, for the whole round: is this secretly a bad deal?
    // Clicks are judged against THIS, not against whether the price text
    // has visibly jumped yet — otherwise spam-clicking "Deal's Good" the
    // instant a round starts would always win, since nothing has jumped
    // yet at that instant even on a round fated to jump later.
    const isBadDeal = Math.random() < CFG.twist_probability;
    let revealed = false; // true once the price has visibly jumped — required for a Discard to count

    els.img.style.display = '';
    els.photo.classList.remove('no-image');
    els.img.src = item.image ? `assets/img/items/${item.image}` : '';
    els.img.alt = item.name;
    els.name.textContent = item.name;
    els.orig.textContent = fmt(origPrice);
    els.sale.textContent = fmt(salePrice);

    const rt = roundSeconds(state.round); // seconds
    els.fill.style.transition = 'none';
    els.fill.style.width = '100%';
    void els.fill.offsetWidth;
    els.fill.style.transition = `width ${rt}s linear`;
    els.fill.style.width = '0%';

    if (isBadDeal) {
      const window_ = state.round <= CFG.early_phase_rounds ? CFG.early_twist_window : CFG.late_twist_window;
      const remainFrac = randBetween(window_[0], window_[1]);
      const remainingAtJump = remainFrac * rt;
      const elapsedAtJump = Math.max(0.3, rt - remainingAtJump);

      const t1 = setTimeout(() => {
        origPrice = inflatedOrigPrice(origPrice);
        salePrice = slashedSalePrice(salePrice);
        revealed = true;
        els.sale.textContent = fmt(salePrice);
        els.orig.textContent = fmt(origPrice);
        els.sale.classList.remove('flip'); void els.sale.offsetWidth; els.sale.classList.add('flip');
        els.orig.classList.remove('flip'); void els.orig.offsetWidth; els.orig.classList.add('flip');
      }, elapsedAtJump * 1000);
      state.timers.push(t1);

      // Hard deadline: miss the reaction window after the reveal and the
      // round auto-fails right then, instead of letting the rest of the
      // round's own clock quietly cover for stalling.
      const deadlineSeconds = Math.min(rt, elapsedAtJump + CFG.reaction_window_seconds);
      const t2 = setTimeout(() => { if (state.roundActive) resolveRound(null, isBadDeal, revealed); }, deadlineSeconds * 1000);
      state.timers.push(t2);
    }

    const timeoutT = setTimeout(() => { if (state.roundActive) resolveRound(null, isBadDeal, revealed); }, rt * 1000);
    state.timers.push(timeoutT);

    state.isBadDeal = () => isBadDeal;
    state.wasRevealed = () => revealed;
  }

  // playerSaysDiscard: true if they hit Discard, false if Deal's Good, null on timeout
  function resolveRound(playerSaysDiscard, isBadDeal, revealed) {
    if (!state.roundActive) return;
    state.roundActive = false;
    els.accept.disabled = true; els.discard.disabled = true;
    clearTimers();

    let correct;
    if (playerSaysDiscard === null) {
      correct = false; // ran out the clock (or missed the reaction deadline) either way
    } else if (playerSaysDiscard === true) {
      // Discard only counts if the price has actually revealed itself as
      // bad — no credit for guessing blind on something that still looks fine.
      correct = isBadDeal && revealed;
    } else {
      // Accept is judged purely on fate: a deal that was never going to
      // turn bad is safe to accept any time, since it never reveals anything.
      correct = !isBadDeal;
    }

    if (playerSaysDiscard === null) {
      window.GameAudio.playSfx('timeout');
    } else {
      window.GameAudio.playSfx(correct ? 'correct' : 'wrong');
    }

    if (correct) {
      state.score += 10 + state.round * 2;
      els.feedback.textContent = playerSaysDiscard === null ? '' : (isBadDeal ? TXT.feedbackCaughtIt : TXT.feedbackGoodEye);
      els.feedback.style.color = 'var(--right)';
    } else {
      state.lives--;
      els.feedback.textContent = playerSaysDiscard === null ? TXT.feedbackTooSlow : TXT.feedbackWrongCall;
      els.feedback.style.color = 'var(--wrong)';
    }
    updateHUD();

    if (state.lives <= 0) {
      setTimeout(endGame, 500);
    } else {
      state.round++;
      setTimeout(startRound, 650);
    }
  }

  els.accept.addEventListener('click', () => {
    window.GameAudio.playSfx('buy');
    resolveRound(false, state.isBadDeal(), state.wasRevealed());
  });
  els.discard.addEventListener('click', () => {
    window.GameAudio.playSfx('discard');
    resolveRound(true, state.isBadDeal(), state.wasRevealed());
  });

  function endGame() {
    clearTimers();
    els.finalScore.textContent = state.score;
    els.finalRound.textContent = state.round;
    els.saveBtn.disabled = false;
    els.nameInput.value = '';
    els.leaderboard.innerHTML = '';
    els.over.classList.remove('hidden');
    renderLeaderboard();
  }

  function beginGame() {
    resetState();
    updateHUD();
    els.start.classList.add('hidden');
    els.over.classList.add('hidden');
    startRound();
  }

  els.playBtn.addEventListener('click', () => {
    window.GameAudio.playSfx('click');
    window.GameAudio.startBgmOnGesture();
    beginGame();
  });
  els.retryBtn.addEventListener('click', () => {
    window.GameAudio.playSfx('click');
    beginGame();
  });

  els.saveBtn.addEventListener('click', () => {
    if (state.saved) return;
    window.GameAudio.playSfx('click');
    state.saved = true;
    els.saveBtn.disabled = true;
    const list = loadLeaderboard();
    list.push({
      name: els.nameInput.value.trim() || 'Anonymous',
      score: state.score,
      round: state.round,
    });
    list.sort((a, b) => b.score - a.score);
    localStorage.setItem(LB_KEY, JSON.stringify(list.slice(0, 10)));
    renderLeaderboard();
  });

  function loadLeaderboard() {
    try {
      const raw = localStorage.getItem(LB_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function renderLeaderboard() {
    const list = loadLeaderboard();
    if (!list.length) { els.leaderboard.innerHTML = ''; return; }
    els.leaderboard.innerHTML = list.map(e =>
      `<div><span>${escapeHtml(e.name)}</span><span>${e.score}</span></div>`
    ).join('');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---- Exit: quit to the start screen, resetting the run ----
  els.exitBtn.addEventListener('click', () => {
    window.GameAudio.playSfx('exit');
    clearTimers();
    resetState();
    updateHUD();
    els.over.classList.add('hidden');
    els.settings.classList.add('hidden');
    els.start.classList.remove('hidden');
  });

  // ---- Settings panel ----
  els.settingsBtn.addEventListener('click', () => {
    window.GameAudio.playSfx('click');
    els.accept.disabled = true; els.discard.disabled = true;
    els.settings.classList.remove('hidden');
  });
  els.closeSettingsBtn.addEventListener('click', () => {
    window.GameAudio.playSfx('click');
    els.settings.classList.add('hidden');
    if (state.roundActive) { els.accept.disabled = false; els.discard.disabled = false; }
  });
  els.musicSlider.addEventListener('input', () => {
    window.GameAudio.setMusicVolume(els.musicSlider.value / 100);
  });
  els.sfxSlider.addEventListener('input', () => {
    window.GameAudio.setSfxVolume(els.sfxSlider.value / 100);
  });

  // ---- Init ----
  applyText();
  window.GameAudio.init(els.bgmAudio);
  els.musicSlider.value = Math.round(window.GameAudio.getMusicVolume() * 100);
  els.sfxSlider.value = Math.round(window.GameAudio.getSfxVolume() * 100);
  resetState();
  updateHUD();
})();
