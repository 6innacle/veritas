// Price Check — game tuning config.
// Edit these values to rebalance the game. Nothing else needs to change.
window.GAME_CONFIG = {
  // Round timer
  round_start_seconds: 20,      // timer on round 1
  round_decrement_seconds: 0.5, // shaved off the timer every round
  min_round_seconds: 5,         // timer never drops below this

  // The crossed-out "original price" is always a genuine markup over
  // whatever the current sale price is, somewhere in this range.
  markup_min_percent: 8,
  markup_max_percent: 20,

  // If the sale price jumps mid-round, it jumps by a percentage in this range.
  price_jump_min_percent: 20,
  price_jump_max_percent: 45,

  // Chance (0-1) that any given round includes a price jump at all.
  twist_probability: 0.6,

  // Once the price jumps, you have this many seconds to hit Discard.
  reaction_window_seconds: 5,

  // Rounds 1 through this number are the "early" phase: a jump, if it
  // happens, lands while 30-50% of the round timer is still left.
  early_phase_rounds: 10,
  early_twist_window: [0.30, 0.50],

  // After the early phase, jumps land later in the round (less time left
  // when it happens = less runway to react = harder).
  late_twist_window: [0.15, 0.35],

  starting_lives: 3,
  currency_symbol: '₱',
};
