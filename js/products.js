// LE ROSÈA - PDF-informed product catalog with generated gallery media.

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const DEFAULT_CARE = 'Dry clean only';
const DEFAULT_LEAD_TIME = '2 weeks';

function assetPath(path){
  return encodeURI(path);
}

function makeProduct(product){
  return {
    sizes: DEFAULT_SIZES,
    customizable: true,
    madeToOrder: true,
    care: DEFAULT_CARE,
    leadTime: DEFAULT_LEAD_TIME,
    craft: '100% hand embroidery',
    ...product,
  };
}

const PRODUCTS = [
  makeProduct({
    id: 'sequins-rush-set-sea-green',
    name: 'Sequins Rush Set',
    category: 'Co-ords & Separates',
    collection: 'Pret',
    price: 28500,
    colorway: 'Sea Green',
    isNew: true,
    isBestseller: true,
    fabric: 'Embroidered mesh with Lycra lining',
    embellishment: 'Sequins, cutdana and cutdana latkans',
    description: 'An intricately hand-embroidered sea-green set featuring shimmering sequins, cutdana and cascading latkans, designed to catch the light and move beautifully with the body.',
    fit: 'Fitted crop top with mini skirt.',
    artVariant: 'bloom',
  }),
  makeProduct({
    id: 'sequins-rush-set-pink',
    name: 'Sequins Rush Set',
    category: 'Co-ords & Separates',
    collection: 'Pret',
    price: 28500,
    colorway: 'Pink',
    isNew: true,
    isBestseller: false,
    fabric: 'Embroidered mesh with Lycra lining',
    embellishment: 'Sequins, cutdana and cutdana latkans',
    description: 'A vivid pink interpretation of the sequins rush set, hand-worked to shimmer from every angle and move softly with the body.',
    fit: 'Fitted crop top with mini skirt.',
    artVariant: 'rose',
  }),
  makeProduct({
    id: 'fringe-mini-dress-sea-green',
    name: 'Fringe Mini Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 32500,
    colorway: 'Sea Green',
    isNew: false,
    isBestseller: true,
    fabric: 'Satin lyra with matching lining',
    embellishment: 'Sequins, cutdana and cutdana latkans',
    description: 'An elegant sea-green mini dress elevated with intricate hand embroidery, sparkling sequins and cascading fringe for statement evening dressing.',
    fit: 'Fitted mini dress with fine shoulder straps.',
    artVariant: 'drape',
  }),
  makeProduct({
    id: 'fringe-mini-dress-lavender',
    name: 'Fringe Mini Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 32500,
    colorway: 'Lavender',
    isNew: false,
    isBestseller: false,
    fabric: 'Satin lyra with matching lining',
    embellishment: 'Sequins, cutdana and cutdana latkans',
    description: 'A lavender take on the fringe mini dress, detailed with hand embroidery, beading and an embellished bodice that moves with ease.',
    fit: 'Fitted mini dress with fine shoulder straps.',
    artVariant: 'grid',
  }),
  makeProduct({
    id: 'fringe-mini-dress-pink',
    name: 'Fringe Mini Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 32500,
    colorway: 'Pink',
    isNew: false,
    isBestseller: false,
    fabric: 'Satin lyra with matching lining',
    embellishment: 'Sequins, cutdana and cutdana latkans',
    description: 'A pink interpretation of the fringe mini dress, detailed with hand embroidery, beading and a cascading fringe bodice.',
    fit: 'Fitted mini dress with fine shoulder straps.',
    artVariant: 'bloom',
  }),
  makeProduct({
    id: 'wildflower-coord-set-white',
    name: 'Wildflower Co-ord Set',
    category: 'Co-ords & Separates',
    collection: 'Pret',
    price: 35500,
    colorway: 'White',
    isNew: false,
    isBestseller: false,
    fabric: 'Crepe with Lycra lining',
    embellishment: 'Net flowers and intricate beadwork',
    description: 'A refined white crepe set adorned with hand-appliqued net flowers and intricate beadwork, inspired by wildflowers in bloom.',
    fit: 'Cropped top with a long, figure-skimming skirt.',
    artVariant: 'botanical',
  }),
  makeProduct({
    id: 'blush-dress',
    name: 'Blush Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 29500,
    colorway: 'Blush Pink',
    isNew: false,
    isBestseller: false,
    fabric: 'Suede-like fabric with Lycra lining',
    embellishment: 'Assorted crystals',
    description: 'A sophisticated blush mini dress in a tactile suede-like fabric, finished with crystal embellishment tracing the neckline and hem for a soft evening glow.',
    fit: 'Relaxed, straight mini dress with deep V-neckline.',
    artVariant: 'rose',
  }),
  makeProduct({
    id: 'secret-rose-corset-gown',
    name: 'Secret Rose Corset Gown',
    category: 'Gowns',
    collection: 'Couture',
    price: 68500,
    colorway: 'Wine',
    isNew: true,
    isBestseller: false,
    fabric: 'Duchess satin corset with embroidered mesh skirt',
    embellishment: '3D floral sequins and crystals',
    description: 'A dramatic wine-hued gown combining a sculpted duchess satin corset with a flowing hand-embroidered mesh skirt and dimensional florals.',
    fit: 'Structured strapless corset with flowing floor-length skirt.',
    artVariant: 'bloom',
  }),
  makeProduct({
    id: 'starfall-cowl-dress-sky-blue',
    name: 'Starfall Cowl Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 36500,
    colorway: 'Sky Blue',
    isNew: false,
    isBestseller: true,
    fabric: 'Satin with Lycra lining',
    embellishment: 'Crystals, glass beads and assorted beads',
    description: 'A sleek sky-blue satin cowl mini dress illuminated by hand-applied crystals, beads and delicate embellishment inspired by falling stars.',
    fit: 'Fitted mini dress with a draped cowl neckline.',
    artVariant: 'rose',
  }),
  makeProduct({
    id: 'starfall-cowl-dress-black',
    name: 'Starfall Cowl Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 36500,
    colorway: 'Black',
    isNew: false,
    isBestseller: false,
    fabric: 'Satin with Lycra lining',
    embellishment: 'Crystals, glass beads and assorted beads',
    description: 'A black satin cowl mini dress finished with hand-applied crystal and bead embellishment for a quieter but equally refined shimmer.',
    fit: 'Fitted mini dress with a draped cowl neckline.',
    artVariant: 'grid',
  }),
  makeProduct({
    id: 'fringe-cascade-gown-brown',
    name: 'Fringe Cascade Gown',
    category: 'Gowns',
    collection: 'Couture',
    price: 59500,
    colorway: 'Brown',
    isNew: false,
    isBestseller: false,
    fabric: 'Embroidered mesh bodice with georgette skirt',
    embellishment: 'Bugle beads, round beads and sequins',
    description: 'A rich brown halter gown combining intricate hand embroidery with bugle beads, round beads and cascading nylon fringe over a fluid georgette skirt.',
    fit: 'Fitted halter bodice with flowing floor-length skirt.',
    artVariant: 'drape',
  }),
  makeProduct({
    id: 'royal-draped-gown-dark-blue',
    name: 'Royal Draped Gown',
    category: 'Gowns',
    collection: 'Couture',
    price: 62500,
    colorway: 'Dark Blue',
    isNew: false,
    isBestseller: true,
    fabric: 'Poly georgette',
    embellishment: 'Intricate naqshi work and crystals',
    description: 'A fluid dark-blue georgette gown defined by graceful draping and an intricately hand-embroidered bust border.',
    fit: 'Draped, floor-length gown with strapless neckline.',
    artVariant: 'bloom',
  }),
  makeProduct({
    id: 'mocha-gold-mini-dress',
    name: 'Mocha Gold Mini Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 34500,
    colorway: 'Mocha Brown & Gold',
    isNew: false,
    isBestseller: true,
    fabric: 'Satin Lycra skirt with embellished net bodice and satin lining',
    embellishment: 'Heat-applied stones',
    description: 'A sophisticated mocha-brown mini dress pairing a luminous stone-embellished corset bodice with a softly draped satin Lycra skirt.',
    fit: 'Fitted strapless mini dress with structured corset-inspired bodice.',
    artVariant: 'grid',
  }),
  makeProduct({
    id: 'black-jewel-dress',
    name: 'Black Jewel Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 31500,
    colorway: 'Black',
    isNew: false,
    isBestseller: false,
    fabric: 'Crepe with Lycra lining',
    embellishment: 'Beads, crystals and pearls',
    description: 'A striking black crepe mini dress with structured shoulders, elevated by intricate hand embroidery cascading along the cuffs and hem.',
    fit: 'Structured fitted mini dress with embellished long sleeves.',
    artVariant: 'rose',
  }),
  makeProduct({
    id: 'ivory-bloom-dress',
    name: 'Ivory Bloom Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 33500,
    colorway: 'Ivory White',
    isNew: false,
    isBestseller: true,
    fabric: 'Embroidered mesh bodice with crepe skirt',
    embellishment: 'Three varieties of 3D floral sequins and crystals',
    description: 'An ivory-white mini dress featuring a hand-embroidered mesh bodice adorned with dimensional floral sequins and crystals.',
    fit: 'Fitted mini dress with a deep V-neckline and wide straps.',
    artVariant: 'bloom',
  }),
  makeProduct({
    id: 'midnight-rain-gown',
    name: 'Midnight Rain Gown',
    category: 'Gowns',
    collection: 'Couture',
    price: 64500,
    colorway: 'Midnight Blue',
    isNew: false,
    isBestseller: false,
    fabric: 'Crepe with Lycra lining',
    embellishment: 'Crystals and glass beads',
    description: 'A sophisticated midnight-blue crepe gown illuminated by hand-embroidered crystals and glass beads arranged in a cascading rain-like pattern.',
    fit: 'Figure-skimming floor-length gown with strapless neckline.',
    artVariant: 'drape',
  }),
  makeProduct({
    id: 'crystal-bow-dress',
    name: 'Crystal Bow Dress',
    category: 'Gowns',
    collection: 'Pret',
    price: 42500,
    colorway: 'Black',
    isNew: false,
    isBestseller: false,
    fabric: 'Crepe with Lycra lining',
    embellishment: 'Crystals',
    description: 'A timeless black crepe gown with a softly draped off-shoulder neckline, delicately hand-embellished with crystals for evening glamour.',
    fit: 'Fitted, floor-length gown with off-shoulder neckline.',
    artVariant: 'rose',
  }),
  makeProduct({
    id: 'noir-bloom-set-black',
    name: 'Noir Bloom Set',
    category: 'Co-ords & Separates',
    collection: 'Pret',
    price: 37500,
    colorway: 'Black',
    isNew: false,
    isBestseller: false,
    fabric: 'Crepe with Lycra lining',
    embellishment: 'Crystals and glass-bead fringes',
    description: 'A refined black crepe co-ord featuring a crystal-trimmed cropped top and flowing skirt, detailed with hand-embellished motifs and delicate glass-bead fringes.',
    fit: 'Cropped top with long, fluid skirt.',
    artVariant: 'grid',
  }),
  makeProduct({
    id: 'golden-rose-corset-with-skirt',
    name: 'Golden Rose Corset with Skirt',
    category: 'Gowns',
    collection: 'Couture',
    price: 74500,
    colorway: 'Gold & Black',
    isNew: true,
    isBestseller: false,
    fabric: 'Embroidered mesh with silk lining',
    embellishment: '3D floral embroidery and crystals',
    description: 'A statement gold-and-black ensemble featuring a sculpted hand-embroidered corset, fluid black satin skirt and coordinating dupatta.',
    fit: 'Structured corset with fluid draped skirt.',
    artVariant: 'bloom',
  }),
  makeProduct({
    id: 'blue-bell-dress',
    name: 'Blue Bell Dress',
    category: 'Dresses',
    collection: 'Couture',
    price: 39500,
    colorway: 'Light Blue',
    isNew: true,
    isBestseller: false,
    fabric: 'Dupion silk with satin lining',
    embellishment: '3D floral embroidery and sequins',
    description: 'A luminous light-blue Dupion silk mini dress adorned with intricate hand-embroidered florals and shimmering sequins.',
    fit: 'Fitted bodice with softly flared mini skirt.',
    artVariant: 'rose',
  }),
  makeProduct({
    id: 'cream-stone-set',
    name: 'Cream Stone Set',
    category: 'Co-ords & Separates',
    collection: 'Pret',
    price: 26500,
    colorway: 'Crème',
    isNew: false,
    isBestseller: false,
    fabric: 'Crepe with Lycra lining',
    embellishment: 'Crystal trims',
    description: 'A refined crème crepe set featuring a sleek cropped top and high-waisted mini skirt, finished with delicate crystal trims.',
    fit: 'Cropped top with fitted high-waisted mini skirt.',
    artVariant: 'botanical',
  }),
  makeProduct({
    id: 'azure-petal-midi-dress',
    name: 'Azure Petal Midi Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 34500,
    colorway: 'Sparkle Blue',
    isNew: false,
    isBestseller: false,
    fabric: 'Poly georgette',
    embellishment: '3D floral motifs and crystals',
    description: 'A vibrant sparkle-blue midi dress featuring sculptural hand-embroidered florals and delicate crystal detailing along the neckline.',
    fit: 'Figure-skimming midi dress with halter neckline.',
    artVariant: 'bloom',
  }),
  makeProduct({
    id: 'sky-fringe-gown',
    name: 'Sky Fringe Gown',
    category: 'Gowns',
    collection: 'Pret',
    price: 61500,
    colorway: 'Black & Sky Blue',
    isNew: false,
    isBestseller: true,
    fabric: 'Crepe top with satin skirt',
    embellishment: 'Beaded fringe',
    description: 'A striking black and sky-blue gown pairing a hand-embellished beaded-fringe bodice with a fluid satin skirt for a strong contrast silhouette.',
    fit: 'Fitted embellished bodice with floor-length skirt.',
    artVariant: 'drape',
  }),
  makeProduct({
    id: 'aqua-pearl-mini-dress',
    name: 'Aqua Pearl Mini Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 38500,
    colorway: 'Blue Ombré',
    isNew: false,
    isBestseller: false,
    fabric: 'Satin with Lycra lining',
    embellishment: 'Dense cutdana, crystals and pearls',
    description: 'A luminous blue ombré satin mini dress densely hand-embroidered with cutdana and accented with crystals and pearls.',
    fit: 'Fitted mini dress with high round neckline.',
    artVariant: 'grid',
  }),
  makeProduct({
    id: 'bubblegum-ombre-mini-dress',
    name: 'Bubblegum Ombré Mini Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 40500,
    colorway: 'Peach to Red Ombré',
    isNew: true,
    isBestseller: false,
    fabric: 'Embroidered mesh with Lycra lining',
    embellishment: '3D sequin flowers with beads',
    description: 'A fitted ombré mini dress richly hand-embellished with dimensional sequin flowers and beads on delicate mesh.',
    fit: 'Fitted mini dress with curved neckline and embellished straps.',
    artVariant: 'rose',
  }),
  makeProduct({
    id: 'hand-embellished-bridal-gown',
    name: 'Hand Embellished Bridal Gown',
    category: 'Gowns',
    collection: 'Couture',
    price: 79500,
    colorway: 'White',
    isNew: true,
    isBestseller: true,
    fabric: 'Net embroidered bodice with crepe lining and crepe skirt',
    embellishment: 'Fine hand bridal embroidery',
    description: 'A timeless white bridal gown featuring a finely hand-embellished bodice and an effortlessly fluid crepe skirt for understated bridal elegance.',
    fit: 'Fitted bodice with flowing floor-length skirt.',
    artVariant: 'bloom',
  }),
  makeProduct({
    id: 'starry-night-beaded-fringe-dress',
    name: 'Starry Night Beaded Fringe Dress',
    category: 'Gowns',
    collection: 'Couture',
    price: 82500,
    colorway: 'Navy Blue & Light Blue',
    isNew: true,
    isBestseller: true,
    fabric: 'Silk velvet corset with embroidered mesh skirt',
    embellishment: 'Mix of beads and crystals with cascading glass-bead fringes',
    description: 'A dramatic navy and light-blue evening dress featuring a sculpted velvet corset, intricately beaded mesh skirt and cascading glass-bead fringe.',
    fit: 'Structured corset with elongated, fluid skirt.',
    artVariant: 'grid',
  }),
];

const PRODUCT_VIEWS = [
  { key: 'front', label: 'Front view' },
  { key: 'back', label: 'Back view' },
  { key: 'side', label: 'Side view' },
  { key: 'close', label: 'Close-up detail' },
];

const LOCAL_MEDIA = {
  'sequins-rush-set-sea-green': [
    { key: 'front', label: 'Front view', src: assetPath('le-rosea images/sequins rush top:skirt/1.jpeg') },
  ],
  'sequins-rush-set-pink': [
    { key: 'front', label: 'Front view', src: assetPath('le-rosea images/sequins rush top:skirt/2.jpeg') },
  ],
  'fringe-mini-dress-sea-green': [
    { key: 'front', label: 'Front view', src: assetPath('le-rosea images/fringe mini dress/1.jpeg') },
  ],
  'fringe-mini-dress-pink': [
    { key: 'front', label: 'Front view', src: assetPath('le-rosea images/fringe mini dress/2.jpeg') },
  ],
  'fringe-mini-dress-lavender': [
    { key: 'front', label: 'Front view', src: assetPath('le-rosea images/fringe mini dress/3.jpeg') },
  ],
};

const COLOR_PALETTES = [
  { match: ['sea green'], colors: ['#4f958c', '#a9d6ce', '#f4f8f7'] },
  { match: ['pink', 'blush', 'rose'], colors: ['#c87492', '#efc0cf', '#fbf3f6'] },
  { match: ['lavender'], colors: ['#a98bcf', '#d4c4ea', '#f7f3fc'] },
  { match: ['wine'], colors: ['#7f2d40', '#c995a6', '#f8f0f2'] },
  { match: ['sky blue', 'light blue', 'blue ombré', 'sparkle blue', 'blue'], colors: ['#4f86c8', '#a9c9ec', '#f3f8ff'] },
  { match: ['black', 'midnight', 'navy'], colors: ['#201a1a', '#584b47', '#f0e5d7'] },
  { match: ['brown', 'mocha', 'gold'], colors: ['#9b6b3e', '#d5b88a', '#fcf5e7'] },
  { match: ['white', 'ivory', 'crème', 'cream'], colors: ['#c8b79a', '#f0e8d9', '#fffdf9'] },
  { match: ['peach', 'red'], colors: ['#dd8d7b', '#efc5bc', '#fff6f3'] },
];

function getProductById(id){
  return PRODUCTS.find(p => p.id === id);
}

function formatINR(n){
  return '₹' + n.toLocaleString('en-IN');
}

function escapeHtml(value){
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function paletteFor(product){
  const needle = `${product.colorway} ${product.collection} ${product.name}`.toLowerCase();
  const palette = COLOR_PALETTES.find(entry => entry.match.some(token => needle.includes(token)));
  return palette ? palette.colors : ['#B08A3C', '#D8C7A8', '#F7F1E8'];
}

function svgDataUri(svg){
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function mediaSvg(product, viewKey, viewLabel){
  const [accent, mist, paper] = paletteFor(product);
  const name = escapeHtml(product.name);
  const colorway = escapeHtml(product.colorway);
  const collection = escapeHtml(product.collection);
  const safeLabel = escapeHtml(viewLabel);
  const shift = viewKey === 'back' ? -1 : viewKey === 'side' ? 1 : 0;
  const closeUp = viewKey === 'close';

  const silhouette = closeUp
    ? `<path d="M170 430c48-82 128-122 220-122 89 0 170 38 219 116 16 25 24 54 24 84 0 76-41 140-110 176-46 23-98 34-151 34-54 0-106-12-152-36-73-38-120-106-120-184 0-29 8-58 20-68z" fill="url(#dress)" opacity="0.94"/>`
    : `<path d="M330 214c52-36 114-54 120-54s69 18 120 54c34 24 58 70 58 124 0 91-49 222-80 320-17 53-50 96-98 126-28 18-63 26-100 26-39 0-74-8-102-26-48-30-81-73-98-126-31-98-80-229-80-320 0-54 24-100 58-124 51-36 114-54 120-54s68 18 120 54z" fill="url(#dress)" opacity="0.96"/>`;

  const overlay = closeUp
    ? `<circle cx="452" cy="487" r="154" fill="none" stroke="${accent}" stroke-width="14" opacity="0.4"/><path d="M324 502c42-51 89-76 128-76s85 26 126 78" fill="none" stroke="${accent}" stroke-width="10" stroke-linecap="round" opacity="0.55"/>`
    : `<path d="M451 240c-20 0-37 10-48 30l-18 36h132l-18-36c-11-20-28-30-48-30z" fill="${accent}" opacity="0.78"/><path d="M310 560c58-22 95-59 141-59s83 37 141 59" fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round" opacity="0.5"/>`;

  const details = viewKey === 'front'
    ? `<circle cx="450" cy="470" r="182" fill="none" stroke="${mist}" stroke-width="2" opacity="0.44"/><path d="M304 336h292" stroke="${mist}" stroke-width="2" opacity="0.3"/><path d="M304 624h292" stroke="${mist}" stroke-width="2" opacity="0.3"/>`
    : viewKey === 'back'
      ? `<path d="M374 260c20 26 48 40 76 40s56-14 76-40" fill="none" stroke="${mist}" stroke-width="6" stroke-linecap="round" opacity="0.4"/><path d="M430 408c0 12 8 20 20 20s20-8 20-20-8-20-20-20-20 8-20 20z" fill="${mist}" opacity="0.36"/>`
      : viewKey === 'side'
        ? `<path d="M366 286c36 26 76 40 121 40s88-14 123-40" fill="none" stroke="${mist}" stroke-width="6" stroke-linecap="round" opacity="0.4"/><path d="M367 558c46-16 101-22 182-18" fill="none" stroke="${mist}" stroke-width="6" stroke-linecap="round" opacity="0.34"/>`
        : `<path d="M322 316c44 20 80 46 129 46s85-26 129-46" fill="none" stroke="${mist}" stroke-width="6" stroke-linecap="round" opacity="0.45"/><circle cx="450" cy="492" r="82" fill="none" stroke="${mist}" stroke-width="4" opacity="0.45"/>`;

  return `
    <svg viewBox="0 0 900 1100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name} ${safeLabel}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${paper}"/>
          <stop offset="52%" stop-color="#f5ebe0"/>
          <stop offset="100%" stop-color="${mist}"/>
        </linearGradient>
        <linearGradient id="dress" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${accent}"/>
          <stop offset="100%" stop-color="#2f2420"/>
        </linearGradient>
      </defs>
      <rect width="900" height="1100" fill="url(#bg)"/>
      <g opacity="0.22" transform="translate(${180 + shift * 16}, 120) scale(1.1)">
        <circle cx="0" cy="0" r="230" fill="none" stroke="${accent}" stroke-width="2"/>
        <circle cx="0" cy="0" r="154" fill="none" stroke="${accent}" stroke-width="1.4"/>
        <path d="M-220 0H220M0 -220V220" stroke="${accent}" stroke-width="1.4"/>
      </g>
      <g transform="translate(${450 + shift * 16} 560)">
        ${silhouette}
        ${overlay}
        ${details}
      </g>
      <g fill="${accent}" opacity="0.82">
        <circle cx="142" cy="210" r="10"/>
        <circle cx="748" cy="212" r="10"/>
        <circle cx="182" cy="846" r="12"/>
        <circle cx="720" cy="832" r="12"/>
      </g>
      <text x="72" y="102" fill="#241C18" font-family="Cormorant Garamond, serif" font-size="52" letter-spacing="1.4">${safeLabel}</text>
      <text x="72" y="148" fill="#6f5c45" font-family="Jost, Arial, sans-serif" font-size="20" letter-spacing="3">${collection}</text>
      <text x="72" y="994" fill="#241C18" font-family="Cormorant Garamond, serif" font-size="44">${name}</text>
      <text x="72" y="1032" fill="#6f5c45" font-family="Jost, Arial, sans-serif" font-size="20">${colorway}</text>
    </svg>
  `.trim();
}

function buildProductMedia(product){
  const local = LOCAL_MEDIA[product.id] || [];
  const generatedViews = PRODUCT_VIEWS.slice(local.length).map(view => ({
    key: view.key,
    label: view.label,
    src: svgDataUri(mediaSvg(product, view.key, view.label)),
  }));
  return {
    images: [...local, ...generatedViews],
    video: {
      src: 'assets/atelier-loop.mp4',
      poster: 'assets/runway-hero.png',
      label: `${product.name} motion view`,
    },
  };
}

function getPrimaryProductMedia(product){
  return product.media && product.media.images && product.media.images[0] ? product.media.images[0].src : '';
}

PRODUCTS.forEach(product => {
  product.media = buildProductMedia(product);
});
