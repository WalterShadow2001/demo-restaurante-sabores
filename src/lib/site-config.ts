/**
 * Static site-wide assets that don't belong in the database.
 *
 * The hero background photo is fetched once via the z-ai image-search CLI
 * (see commit history) and re-hosted on the project's OSS CDN, so the URL
 * is stable and embeddable.
 */
export const HERO_IMAGE_URL =
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/da917823b4c2.jpg";

/**
 * Optional fallback image used when a platillo's `imagen` field is empty
 * or the URL fails to load. Currently a neutral plate emoji rendered by
 * DishThumb, but kept here so it can be swapped for a CDN URL later.
 */
export const FALLBACK_DISH_EMOJI = "🍽️";
