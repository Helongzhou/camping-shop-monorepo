/** Slugs used for static export (generateStaticParams). Mirrors packages/db/prisma/seed.mjs */
export const STATIC_CATEGORY_SLUGS = [
  'tents',
  'sleeping-bags',
  'backpacks',
  'camp-kitchen',
] as const;

export const STATIC_PRODUCT_SLUGS = [
  'trailnest-ultralight-2p',
  'summit-dome-3p',
  'aurora-15-down-bag',
  'pine-synthetic-30-bag',
  'ridge-explorer-45l',
  'thru-trail-65l',
  'ember-canister-stove',
  'trail-brew-coffee-set',
] as const;
