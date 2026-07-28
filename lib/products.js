const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_SEARCH_URL = "https://api.unsplash.com/search/photos";
const UNSPLASH_PHOTOS_URL = "https://api.unsplash.com/photos";

export const CATEGORIES = [
  { id: "lips", label: "Lips", emoji: "💋" },
  { id: "eyes", label: "Eyes", emoji: "👁️" },
  { id: "face", label: "Face", emoji: "✨" },
  { id: "skin", label: "Skin Care", emoji: "🌿" },
  { id: "fragrance", label: "Fragrance", emoji: "🌸" },
];

const CATEGORY_BG = {
  lips: "#F5D5C8",
  eyes: "#E8D8D0",
  face: "#F8E8DC",
  skin: "#FDE8E0",
  fragrance: "#F0D8DF",
};

// Curated product line — paired with an Unsplash search query tuned to surface
// a clean, professional product shot for that item.
export const CATALOG = [
  { id: 1, brand: "Lumière Beauty", name: "Velvet Rouge Lipstick", category: "lips", price: 24, query: "red lipstick product photography" },
  { id: 2, brand: "Bloom & Co.", name: "Nude Silk Lip Gloss", category: "lips", price: 18, query: "nude lip gloss cosmetic product" },
  // photoId pinned: the top query match showed a visible real-brand (Gucci) logo, unusable for a fictional store.
  { id: 3, brand: "Aurora Cosmetics", name: "Matte Rose Lip Tint", category: "lips", price: 16, query: "pink lipstick tube product", photoId: "9P3d5rEN45U" },
  // photoId pinned: the live query kept returning the same black pencil photo as the Kohl Pencil (id 9).
  { id: 4, brand: "Lumière Beauty", name: "Berry Crush Lip Liner", category: "lips", price: 14, query: "lip liner pencil makeup product", photoId: "vfwtxQ7l0-o" },
  { id: 5, brand: "Bloom & Co.", name: "Coral Glow Lip Oil", category: "lips", price: 20, query: "lip oil gloss beauty product" },

  { id: 6, brand: "Aurora Cosmetics", name: "Golden Hour Eyeshadow Palette", category: "eyes", price: 42, query: "eyeshadow palette flatlay" },
  { id: 7, brand: "Lumière Beauty", name: "Sky High Volume Mascara", category: "eyes", price: 22, query: "mascara tube black cosmetic product" },
  // photoId pinned: the top query match was a mismatched B&W hands photo, not a clean product shot.
  { id: 8, brand: "Bloom & Co.", name: "Precision Liquid Eyeliner", category: "eyes", price: 16, query: "eyeliner makeup product", photoId: "jC_TqS-ULzk" },
  { id: 9, brand: "Aurora Cosmetics", name: "Smoky Noir Kohl Pencil", category: "eyes", price: 15, query: "eye pencil makeup product" },
  // photoId pinned: the top query match was a nail-polish photo, not mascara — reusing id 7's clean, vetted shot instead.
  // photoId pinned: this used to reuse id 7's exact photo (a stopgap after an earlier nail-polish mismatch); swapped for a genuinely distinct application shot.
  { id: 10, brand: "Lumière Beauty", name: "Feather Lash Curl Mascara", category: "eyes", price: 19, query: "mascara brush beauty product", photoId: "TdZ3vInQuZE" },
  { id: 25, brand: "Aurora Cosmetics", name: "Sunset Ombré Eyeshadow Quad", category: "eyes", price: 34, query: "eyeshadow palette warm tones product photography" },
  // photoId pinned: the original query returned zero results with the squarish-orientation filter.
  { id: 26, brand: "Bloom & Co.", name: "Champagne Shimmer Eyeshadow Duo", category: "eyes", price: 26, query: "shimmer eyeshadow duo compact product", photoId: "X5BscEyL8ag" },

  { id: 11, brand: "Aurora Cosmetics", name: "Second Skin Foundation", category: "face", price: 38, query: "foundation bottle makeup product" },
  // photoId pinned: the live query kept returning the exact same photo already used for id 11.
  { id: 12, brand: "Bloom & Co.", name: "Terracotta Glow Blush", category: "face", price: 26, query: "blush compact powder makeup", photoId: "cWa1_mght10" },
  { id: 13, brand: "Lumière Beauty", name: "Radiant Bronzer Duo", category: "face", price: 30, query: "bronzer compact makeup product" },
  // photoId pinned: the live query kept returning the exact same photo already used for id 13.
  { id: 14, brand: "Aurora Cosmetics", name: "Dewy Setting Powder", category: "face", price: 28, query: "makeup powder compact product", photoId: "bCbkY6gkKSk" },
  { id: 15, brand: "Bloom & Co.", name: "Luminous Highlighter Stick", category: "face", price: 24, query: "highlighter makeup stick product" },

  { id: 16, brand: "Aurora Skin", name: "Hydra Glow Serum", category: "skin", price: 48, query: "skincare serum bottle product" },
  { id: 17, brand: "Bloom & Co.", name: "Rosewater Toning Mist", category: "skin", price: 22, query: "facial mist spray bottle skincare" },
  { id: 18, brand: "Aurora Skin", name: "Velvet Cream Moisturizer", category: "skin", price: 36, query: "moisturizer jar skincare product" },
  { id: 19, brand: "Lumière Beauty", name: "Clarifying Clay Mask", category: "skin", price: 28, query: "clay mask jar skincare product" },
  { id: 20, brand: "Aurora Skin", name: "Gentle Foaming Cleanser", category: "skin", price: 20, query: "facial cleanser bottle skincare" },

  { id: 21, brand: "Maison Lumière", name: "Velvet Oud Eau de Parfum", category: "fragrance", price: 89, query: "perfume bottle luxury product" },
  // photoId pinned: the live query kept returning the exact same bottle photo already used for id 21.
  { id: 22, brand: "Aurora Cosmetics", name: "Citrus Bloom Eau de Toilette", category: "fragrance", price: 65, query: "perfume bottle citrus product", photoId: "W7DW2lKCXX8" },
  { id: 23, brand: "Maison Lumière", name: "Midnight Rose Parfum", category: "fragrance", price: 95, query: "perfume bottle rose luxury" },
  { id: 24, brand: "Bloom & Co.", name: "Ocean Breeze Cologne", category: "fragrance", price: 58, query: "cologne bottle product" },
];

function seededRating(id) {
  return Math.round((4.1 + ((id * 37) % 60) / 100) * 10) / 10;
}

function seededReviews(id) {
  return 80 + ((id * 53) % 3000);
}

async function fetchUnsplashPhoto(query, { orientation = "squarish", size = "small" } = {}) {
  if (!UNSPLASH_ACCESS_KEY) return null;
  try {
    const res = await fetch(
      `${UNSPLASH_SEARCH_URL}?query=${encodeURIComponent(query)}&per_page=1&orientation=${orientation}&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
        // Revalidate weekly, not hourly — these are static stock photos that
        // never change, and revalidating hourly meant a single Unsplash rate
        // limit (shared across the whole site) could silently replace a
        // working image with a broken one until the next successful refetch.
        next: { revalidate: 604800 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data.results?.[0];
    if (!photo) return null;
    return {
      url: photo.urls[size],
      credit: photo.user.name,
      creditUrl: `${photo.user.links.html}?utm_source=glowcart&utm_medium=referral`,
    };
  } catch {
    return null;
  }
}

async function fetchUnsplashPhotoById(id, { size = "small" } = {}) {
  if (!UNSPLASH_ACCESS_KEY) return null;
  try {
    const res = await fetch(`${UNSPLASH_PHOTOS_URL}/${id}`, {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      next: { revalidate: 604800 },
    });
    if (!res.ok) return null;
    const photo = await res.json();
    return {
      url: photo.urls[size],
      credit: photo.user.name,
      creditUrl: `${photo.user.links.html}?utm_source=glowcart&utm_medium=referral`,
    };
  } catch {
    return null;
  }
}

export async function getHeroImages() {
  const [portrait, accent] = await Promise.all([
    fetchUnsplashPhoto("model glowing skin makeup portrait warm tone", { orientation: "portrait", size: "regular" }),
    // Pinned to a specific, clean single-product lipstick shot (no visible branding)
    // rather than a live search — keeps the hero card looking realistic and on-brand.
    fetchUnsplashPhotoById("phYKolpoQ9A", { size: "small" }),
  ]);
  return { portrait, accent };
}

// Shade Match result cards (component keyed by numeric product id). Pinned to
// specific clean, unbranded product shots — the quiz's static catalogue has no
// query field, and a live search kept surfacing real competitor logos.
const SHADE_MATCH_PHOTO_IDS = {
  1: "8JsIE0k0aLU",  // blush — NARS Orgasm Blush
  2: "djftKZT4jnE",  // lip_bold — Ruby Woo Lipstick
  3: "phYKolpoQ9A",  // lip_nude — Velvet Teddy Lipstick
  4: "phYKolpoQ9A",  // lip_rose — Pillow Talk Lipstick
  5: "gtxxkGEoaBM",  // foundation_dewy — Pro Filt'r Foundation
  6: "gtxxkGEoaBM",  // foundation_matte — Infallible Foundation
  8: "jC_TqS-ULzk",  // liner — Epic Ink Liner
  9: "nJexxVpHul0",  // mascara — Sky High Mascara
  10: "8JsIE0k0aLU", // studio_fix — Studio Fix Powder
  11: "NNcQPOxjJcE", // flawless_filter — Flawless Filter
  12: "NNcQPOxjJcE", // cant_stop — Can't Stop Won't Stop Foundation
};

export async function getShadeMatchImages() {
  const uniqueIds = [...new Set(Object.values(SHADE_MATCH_PHOTO_IDS))];
  const photos = await Promise.all(uniqueIds.map((id) => fetchUnsplashPhotoById(id)));
  const byPhotoId = Object.fromEntries(uniqueIds.map((id, i) => [id, photos[i]]));
  return Object.fromEntries(
    Object.entries(SHADE_MATCH_PHOTO_IDS).map(([productId, photoId]) => [productId, byPhotoId[photoId]])
  );
}

// Routine builder — 2 real photo variants per step, alternated across that
// step's 6 products. (An earlier version fetched one distinct photo per
// product — 36 live Unsplash calls just for this page — which routinely blew
// through the free-tier hourly rate limit shared with the rest of the site.
// Two variants per step cuts that to 12 while still avoiding "every product
// shows the exact same photo".)
const ROUTINE_STEP_PHOTO_QUERIES = {
  1: ["primer serum dropper bottle skincare product", "luxury skincare primer bottle product photography"],
  2: ["foundation bottle glass makeup product photography", "concealer tube makeup product photography"],
  3: ["blush compact powder makeup product photography", "highlighter powder compact makeup product"],
  4: ["eyeshadow palette rose gold makeup product photography", "mascara tube black makeup product photography"],
  5: ["matte lipstick bullet makeup product photography", "lip gloss tube makeup product photography"],
  6: ["setting spray bottle makeup product photography", "loose powder jar makeup product photography"],
};

const ROUTINE_LOOK_QUERIES = {
  1: "natural everyday makeup glowing skin woman",
  2: "glamorous smokey eye makeup night look",
  3: "no makeup natural skin glow beauty portrait",
};

// photoId pinned: the live query for look 3 kept surfacing the exact same
// photo as look 1's query, so both cards showed an identical image.
const ROUTINE_LOOK_PHOTO_IDS = {
  3: "7wmraOJCnyQ",
};

export async function getRoutinesImages() {
  const stepIds = Object.keys(ROUTINE_STEP_PHOTO_QUERIES);
  const lookIds = Object.keys(ROUTINE_LOOK_QUERIES);

  const [stepPhotoPairs, lookPhotos] = await Promise.all([
    Promise.all(
      stepIds.map((id) =>
        Promise.all(ROUTINE_STEP_PHOTO_QUERIES[id].map((q) => fetchUnsplashPhoto(q)))
      )
    ),
    Promise.all(
      lookIds.map((id) =>
        ROUTINE_LOOK_PHOTO_IDS[id]
          ? fetchUnsplashPhotoById(ROUTINE_LOOK_PHOTO_IDS[id], { size: "regular" })
          : fetchUnsplashPhoto(ROUTINE_LOOK_QUERIES[id], { orientation: "landscape", size: "regular" })
      )
    ),
  ]);

  return {
    stepVariants: Object.fromEntries(stepIds.map((id, i) => [id, stepPhotoPairs[i]])),
    looks: Object.fromEntries(lookIds.map((id, i) => [id, lookPhotos[i]])),
  };
}

async function buildProduct(entry, tag = null) {
  const photo = entry.photoId
    ? await fetchUnsplashPhotoById(entry.photoId)
    : await fetchUnsplashPhoto(entry.query);
  return {
    id: entry.id,
    brand: entry.brand,
    name: entry.name,
    category: entry.category,
    price: entry.price,
    rating: seededRating(entry.id),
    reviews: seededReviews(entry.id),
    tag,
    image: photo?.url || null,
    imageCredit: photo ? { name: photo.credit, url: photo.creditUrl } : null,
    bgColor: CATEGORY_BG[entry.category],
    description: `A cult-favourite from ${entry.brand}, loved for its rich pigment and easy, everyday wear.`,
  };
}

export async function getShopProducts() {
  return Promise.all(CATALOG.map((e) => buildProduct(e)));
}

export async function getProductsByIds(ids) {
  const entries = ids.map((id) => CATALOG.find((e) => e.id === id)).filter(Boolean);
  return Promise.all(entries.map((e) => buildProduct(e)));
}

// Full lips/eyes/face/skin catalog (fragrance excluded — no pill for it on
// the homepage). Previously sliced to the first 12 entries, which cut every
// category off partway through face and skipped skin entirely.
export async function getHomeCategoryProducts() {
  return Promise.all(CATALOG.filter((e) => e.category !== "fragrance").map((e) => buildProduct(e)));
}

export async function getBestSellers(count = 4) {
  const picks = [...CATALOG].sort((a, b) => seededRating(b.id) - seededRating(a.id)).slice(0, count);
  return Promise.all(picks.map((e) => buildProduct(e, "bestseller")));
}

export async function getNewArrivals(count = 5) {
  const picks = CATALOG.slice(-count);
  return Promise.all(picks.map((e) => buildProduct(e, "new")));
}

export async function getFeaturedThisWeek(count = 4) {
  const picks = CATALOG.slice(2, 2 + count);
  return Promise.all(picks.map((e) => buildProduct(e, "bestseller")));
}

// Looks lookbook — curated shoppable looks. Each hero photo is a live
// portrait-style search (generic mood queries, low branding risk); the
// product thumbnails reuse the already-vetted CATALOG photos.
const LOOKBOOK = [
  {
    id: 1,
    name: "Golden Hour Glow",
    mood: "Glam",
    tag: "Editorial",
    duration: "15 min",
    description: "Warm, luminous and effortless — sun-washed skin, a bronzed glow and a glazed lip. Built for evenings that start at golden hour and never quite end.",
    query: "golden hour glowing skin makeup portrait woman",
    detailQuery: "bronzer application face makeup closeup golden hour",
    steps: [
      "Warm up skin with a cream bronzer along the cheekbones and temples",
      "Sweep a golden highlighter across the high points of the face",
      "Finish with a glazed, balm-like terracotta lip",
    ],
    productIds: [11, 13, 15, 5],
  },
  {
    id: 2,
    name: "Classic Red Lip",
    mood: "Bold",
    tag: "Evening",
    duration: "10 min",
    description: "A timeless, confident statement. Clean skin, defined lashes and one perfect red — the look that never goes out of style.",
    query: "red lipstick classic elegant makeup portrait woman",
    detailQuery: "red lipstick application closeup mouth",
    steps: [
      "Prep lips with a hydrating balm, then line with a matching red liner",
      "Fill in with a long-wearing red lipstick, blotting between coats",
      "Keep the rest of the face clean — mascara and a groomed brow are enough",
    ],
    productIds: [11, 7, 1],
  },
  {
    id: 3,
    name: "Soft Everyday Nude",
    mood: "Natural",
    tag: "Everyday",
    duration: "5 min",
    description: "Your skin, only better. Featherlight coverage, a whisper of colour and a nude lip for effortless days on repeat.",
    query: "natural nude makeup everyday minimal woman portrait",
    // photoId pinned: the live query kept surfacing a desaturated black & white shot, which read as flat and lifeless.
    photoId: "6IGd3-F3Cao",
    detailQuery: "natural makeup application skincare closeup face",
    steps: [
      "Even out skin with a sheer, skin-like foundation",
      "Warm the cheeks with a cream blush blended in with fingertips",
      "Finish lips with a nude gloss for a your-lips-but-better effect",
    ],
    productIds: [18, 11, 2],
  },
  {
    id: 4,
    name: "Smoky Bronze Eyes",
    mood: "Glam",
    tag: "Night Out",
    duration: "20 min",
    description: "Warm bronze tones smudged and blended for a sultry, low-lit finish that carries from dinner straight through to last call.",
    query: "smoky bronze eyeshadow makeup woman portrait",
    detailQuery: "smoky eye makeup application closeup eyeshadow brush",
    steps: [
      "Blend a warm bronze shade across the lid and into the crease",
      "Smudge a dark brown along the lash line for depth",
      "Layer mascara generously for a sultry, lived-in finish",
    ],
    productIds: [6, 7, 13],
  },
  {
    id: 5,
    name: "Dewy Minimalist",
    mood: "Natural",
    tag: "Skin-First",
    duration: "5 min",
    description: "Skincare-led and barely-there. A hydrating base and a lit-from-within glow — proof that less really can be more.",
    query: "dewy glowing skin minimal makeup skincare woman portrait",
    detailQuery: "glowing skin serum application closeup hands face",
    steps: [
      "Layer a hydrating serum for a lit-from-within base",
      "Dot a cream highlighter on cheekbones and blend with fingers",
      "Skip powder everywhere except where you need extra hold",
    ],
    productIds: [16, 18, 15],
  },
  {
    id: 6,
    name: "Rose Gold Glam",
    mood: "Glam",
    tag: "Special Occasion",
    duration: "15 min",
    description: "Shimmering rose and gold tones swept across the lid, paired with a flushed rosy lip — polished enough for any celebration.",
    query: "rose gold glam makeup woman portrait elegant",
    detailQuery: "rose gold eyeshadow makeup application closeup shimmer",
    steps: [
      "Pat a rose gold shimmer onto the center of the lid",
      "Add a soft rosy blush high on the cheeks",
      "Finish with a glossy rose lip for a cohesive, monochrome glow",
    ],
    productIds: [6, 15, 3],
  },
  {
    id: 7,
    name: "Berry Stained Lips",
    mood: "Bold",
    tag: "Date Night",
    duration: "10 min",
    description: "Deep berry and wine tones pressed into the lips for a stained, just-drank-red-wine finish — moody, confident, unforgettable.",
    query: "berry wine lipstick makeup portrait woman elegant",
    // photoId pinned: the live query returned zero results.
    photoId: "TAGFNCnw7f4",
    detailQuery: "berry lipstick application closeup mouth",
    steps: [
      "Line lips with a berry-toned liner, slightly overlining the cupid's bow",
      "Press a matte berry lipstick into the centre and blend outward for a stained effect",
      "Blot with tissue for a soft, worn-in finish that lasts through dinner",
    ],
    productIds: [11, 4, 3],
  },
  {
    id: 8,
    name: "Graphic Winged Liner",
    mood: "Bold",
    tag: "Editorial",
    duration: "15 min",
    description: "A sharp, high-flicked wing that means business. Precise, graphic and endlessly photogenic — the ultimate statement eye.",
    query: "winged eyeliner cat eye makeup portrait woman",
    detailQuery: "eyeliner wing application closeup eye makeup",
    // detailPhotoId pinned: the live query surfaced a pencil-drawing illustration instead of a real photo.
    detailPhotoId: "Sk_883Go1LU",
    steps: [
      "Sketch a thin line along the upper lash line, flicking up at the outer corner",
      "Build the wing thicker and sharpen the edges with a steady hand",
      "Fill in with kohl pencil underneath for definition, then coat lashes in mascara",
    ],
    productIds: [8, 9, 7],
  },
  {
    id: 9,
    name: "Bare Skin Radiance",
    mood: "Natural",
    tag: "Skin-First",
    duration: "5 min",
    description: "Nothing but glow. A skincare-forward routine that lets your bare skin do the talking — soft, hydrated and lit from within.",
    query: "bare skin natural glow minimal makeup woman portrait",
    detailQuery: "skincare glow face closeup natural",
    steps: [
      "Massage in a hydrating serum until fully absorbed",
      "Follow with a rich moisturiser to lock in dewiness",
      "Dab a cream highlighter on cheekbones for a lit-from-within finish",
    ],
    productIds: [16, 18, 15],
  },
  {
    id: 10,
    name: "Sun-Kissed Freckles",
    mood: "Natural",
    tag: "Summer",
    duration: "10 min",
    description: "Warm, bronzed and freckle-forward — the low-effort summer look that makes it look like you spent the day in the sun.",
    query: "freckles sun kissed natural makeup woman portrait",
    // photoId pinned: the live query kept surfacing the exact same desaturated black & white shot as "Soft Everyday Nude".
    photoId: "9fH9gbMsRQQ",
    detailQuery: "bronzer sun kissed skin closeup face",
    steps: [
      "Moisturise well, then sweep a cream bronzer across cheeks, nose and forehead",
      "Add a few soft dots of brow pencil for natural-looking freckles",
      "Finish lips with a sheer, juicy gloss",
    ],
    productIds: [18, 13, 2],
  },
];

function buildLook(look, heroPhoto, detailPhoto, byId) {
  const lookProducts = look.productIds.map((id) => byId[id]).filter(Boolean);
  return {
    id: look.id,
    name: look.name,
    mood: look.mood,
    tag: look.tag,
    duration: look.duration,
    description: look.description,
    steps: look.steps,
    image: heroPhoto?.url || null,
    imageCredit: heroPhoto ? { name: heroPhoto.credit, url: heroPhoto.creditUrl } : null,
    detailImage: detailPhoto?.url || null,
    detailImageCredit: detailPhoto ? { name: detailPhoto.credit, url: detailPhoto.creditUrl } : null,
    products: lookProducts,
    total: Math.round(lookProducts.reduce((s, p) => s + p.price, 0)),
  };
}

function fetchLookHeroPhoto(look) {
  return look.photoId
    ? fetchUnsplashPhotoById(look.photoId, { size: "regular" })
    : fetchUnsplashPhoto(look.query, { orientation: "portrait", size: "regular" });
}

function fetchLookDetailPhoto(look) {
  return look.detailPhotoId
    ? fetchUnsplashPhotoById(look.detailPhotoId, { size: "small" })
    : fetchUnsplashPhoto(look.detailQuery, { orientation: "squarish", size: "small" });
}

export async function getLookbook() {
  const allProductIds = [...new Set(LOOKBOOK.flatMap((l) => l.productIds))];
  const [heroPhotos, detailPhotos, products] = await Promise.all([
    Promise.all(LOOKBOOK.map((l) => fetchLookHeroPhoto(l))),
    Promise.all(LOOKBOOK.map((l) => fetchLookDetailPhoto(l))),
    getProductsByIds(allProductIds),
  ]);
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  return LOOKBOOK.map((look, i) => buildLook(look, heroPhotos[i], detailPhotos[i], byId));
}

// Lighter single-look fetch for the homepage's "Look of the Day" — avoids
// pulling in every other look's hero photo + products just to show one.
export async function getFeaturedLook(id = 1) {
  const look = LOOKBOOK.find((l) => l.id === id) || LOOKBOOK[0];
  const [heroPhoto, detailPhoto, products] = await Promise.all([
    fetchLookHeroPhoto(look),
    fetchLookDetailPhoto(look),
    getProductsByIds(look.productIds),
  ]);
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  return buildLook(look, heroPhoto, detailPhoto, byId);
}
