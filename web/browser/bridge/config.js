/** @typedef {'list_loop' | 'single_loop' | 'shuffle' | 'sequential'} PlayMode */
/** @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8} QualityTier */

/** Maps qmtui play modes to the QQ Music play-mode enum the bundle understands. */
/** @type {Record<PlayMode, number>} */
export const modeToQq = {
  list_loop: 4,
  single_loop: 3,
  shuffle: 1,
  sequential: 2,
};

/** Maps qmtui quality tiers to the `/api/quality` keys the C# layer exposes. */
/** @type {Record<QualityTier, string>} */
export const qualityTierToKey = {
  0: 'hires',
  1: 'flac',
  2: '320k',
  3: '128k',
  4: 'master',
  5: 'deluxe',
  6: 'atmos51',
  7: 'atmos71',
  8: 'dolby',
};

/** Inverse of {@link qualityTierToKey}: key -> tier. */
/** @type {Record<string, QualityTier>} */
export const qualityKeyToTier = {};
for (const [tier, key] of Object.entries(qualityTierToKey)) {
  qualityKeyToTier[key] = /** @type {QualityTier} */ (Number(tier));
}
