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

  // When a round turns bad mid-round, the crossed-out ORIGINAL price goes UP
  // by a percentage in this range...
  twist_orig_increase_min_percent: 35,
  twist_orig_increase_max_percent: 70,

  // ...and the SALE price goes DOWN by a percentage in this range.
  twist_sale_decrease_min_percent: 15,
  twist_sale_decrease_max_percent: 35,

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
