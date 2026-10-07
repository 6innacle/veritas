// Price Check — audio config.
// Point these at your own files. Any file that's missing just stays silent
// — the game won't break or throw errors, it just plays no sound for it.
window.GAME_AUDIO = {
  bgm: "assets/audio/bgm.mp3",

  sfx: {
    click:   "assets/audio/sfx/click.mp3",   // generic: Start, Play Again, Save score, Settings open/close
    buy:     "assets/audio/sfx/buy.mp3",     // hitting "Deal's Good" (plays immediately, any outcome)
    discard: "assets/audio/sfx/discard.mp3", // hitting "Discard" (plays immediately, any outcome)
    exit:    "assets/audio/sfx/exit.mp3",    // hitting "Exit"

    correct: "assets/audio/sfx/correct.mp3", // the call you made (accept or discard) turned out right
    wrong:   "assets/audio/sfx/wrong.mp3",   // the call you made turned out wrong
    timeout: "assets/audio/sfx/timeout.mp3", // ran out the clock without answering (or missed the reaction deadline)
  },

  default_music_volume: 0.5, // 0.0 - 1.0
  default_sfx_volume: 0.7,   // 0.0 - 1.0
};
