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
    // Per-product so it can be overridden individually later; defaults to XS.
    modelSize: 'XS',
    ...product,
  };
}

// Resolve the image list for a product, optionally for a specific colour.
// Merged multi-colour products keep per-colour images in `colors[]`; the
// top-level `images` mirrors the default (first) colour for cards/cart.
function colorImages(product, colorName){
  if (product && product.colors && product.colors.length){
    var match = colorName ? product.colors.find(function(c){ return c.name === colorName; }) : null;
    var chosen = match || product.colors[0];
    return chosen && chosen.images && chosen.images.length ? chosen.images : (product.images || []);
  }
  return product && product.images ? product.images : [];
}

const PRODUCTS = [
  // Merged colour product: crop-top + mini-skirt set offered in two colourways.
  // Top-level `images`/`colorway`/`artVariant` mirror the default (first) colour
  // so product cards, cart thumbnails and the shop grid keep working unchanged.
  makeProduct({
    id: 'sequins-rush-set',
    name: 'Sequins Rush Set',
    category: 'Co-ords & Separates',
    collection: 'Pret',
    price: 14999,
    colorway: 'Sea Green',
    isNew: true,
    isBestseller: true,
    fabric: 'Embroidered mesh with Lycra lining',
    embellishment: 'Sequins, cutdana and cutdana latkans',
    description: 'An intricately hand-embroidered set featuring shimmering sequins, cutdana and cascading latkans, designed to catch the light and move beautifully with the body. Available in sea green, lavender and pink.',
    fit: 'Fitted crop top with mini skirt.',
    artVariant: 'bloom',
    // Group campaign shot used on cards/grids; per-colour galleries below.
    cardImage: 'assets/products/sequins-rush-set-trio.jpg',
    images: ['assets/products/sequins-rush-set-sea-green/1.jpg', 'assets/products/sequins-rush-set-sea-green/2.jpg', 'assets/products/sequins-rush-set-sea-green/3.jpg'],
    colors: [
      { name: 'Sea Green', swatch: '#3F8374', images: ['assets/products/sequins-rush-set-sea-green/1.jpg', 'assets/products/sequins-rush-set-sea-green/2.jpg', 'assets/products/sequins-rush-set-sea-green/3.jpg'], video: null },
      { name: 'Lavender', swatch: '#B7A6DA', images: ['assets/products/sequins-rush-set-trio.jpg'], video: null },
      { name: 'Pink', swatch: '#E48CB2', images: ['assets/products/sequins-rush-set-pink/1.jpg', 'assets/products/sequins-rush-set-pink/2.jpg', 'assets/products/sequins-rush-set-pink/3.jpg', 'assets/products/sequins-rush-set-pink/4.jpg', 'assets/products/sequins-rush-set-pink/5.jpg', 'assets/products/sequins-rush-set-pink/6.jpg', 'assets/products/sequins-rush-set-pink/7.jpg'], video: null },
    ],
  }),
  // Merged colour product: fringe mini dress offered in three colourways.
  makeProduct({
    id: 'fringe-mini-dress',
    name: 'Fringe Mini Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 9999,
    colorway: 'Sea Green',
    isNew: false,
    isBestseller: true,
    fabric: 'Satin lyra with matching lining',
    embellishment: 'Sequins, cutdana and cutdana latkans',
    description: 'An elegant mini dress elevated with intricate hand embroidery, sparkling sequins and cascading fringe for statement evening dressing. Available in sea green, lavender and pink.',
    fit: 'Fitted mini dress with fine shoulder straps.',
    artVariant: 'drape',
    // Group campaign shot used on cards/grids; per-colour galleries below.
    cardImage: 'assets/products/fringe-mini-dress-trio.jpg',
    images: ['assets/products/fringe-mini-dress-sea-green/1.jpg', 'assets/products/fringe-mini-dress-sea-green/2.jpg', 'assets/products/fringe-mini-dress-sea-green/3.jpg'],
    colors: [
      { name: 'Sea Green', swatch: '#3F8374', images: ['assets/products/fringe-mini-dress-sea-green/1.jpg', 'assets/products/fringe-mini-dress-sea-green/2.jpg', 'assets/products/fringe-mini-dress-sea-green/3.jpg'], video: null },
      { name: 'Lavender', swatch: '#B7A6DA', images: ['assets/products/fringe-mini-dress-lavender/1.jpg', 'assets/products/fringe-mini-dress-lavender/2.jpg', 'assets/products/fringe-mini-dress-lavender/3.jpg'], video: null },
      { name: 'Pink', swatch: '#E48CB2', images: ['assets/products/fringe-mini-dress-pink/1.jpg', 'assets/products/fringe-mini-dress-pink/2.jpg', 'assets/products/fringe-mini-dress-pink/3.jpg'], video: null },
    ],
  }),
  makeProduct({
    id: 'wildflower-coord-set-white',
    images: ['assets/products/wildflower-coord-set-white/1.jpg', 'assets/products/wildflower-coord-set-white/2.jpg', 'assets/products/wildflower-coord-set-white/3.jpg', 'assets/products/wildflower-coord-set-white/4.jpg'],
    name: 'Wildflower Co-ord Set',
    category: 'Co-ords & Separates',
    collection: 'Pret',
    price: 24500,
    colorway: 'White',
    isNew: false,
    isBestseller: false,
    fabric: 'Crepe with Lycra lining',
    embellishment: 'Net flowers and intricate beadwork',
    description: 'A refined white crepe set adorned with hand-appliqued net flowers and intricate beadwork, inspired by wildflowers in bloom.',
    fit: 'Cropped top with a long, figure-skimming skirt.',
    artVariant: 'botanical',
  }),
  // Standalone pieces split out from the Wildflower Corset Quad Set (set kept at
  // ₹24,500). Images are the set's photos as a placeholder until dedicated
  // per-garment shots are available.
  makeProduct({
    id: 'wildflower-top',
    name: 'Wildflower Top',
    category: 'Top',
    collection: 'Pret',
    price: 9900,
    colorway: 'White',
    isNew: false,
    isBestseller: false,
    fabric: 'Crepe with Lycra lining',
    embellishment: 'Net flowers and intricate beadwork',
    description: 'The cropped corset top from the Wildflower set, offered on its own — hand-appliqued net flowers and intricate beadwork on refined white crepe. Shown here in set photography; dedicated piece imagery to follow.',
    fit: 'Cropped corset top.',
    artVariant: 'botanical',
    images: ['assets/products/wildflower-coord-set-white/1.jpg', 'assets/products/wildflower-coord-set-white/2.jpg', 'assets/products/wildflower-coord-set-white/3.jpg', 'assets/products/wildflower-coord-set-white/4.jpg'],
  }),
  makeProduct({
    id: 'wildflower-bottom',
    name: 'Wildflower Bottom',
    category: 'Skirt',
    collection: 'Pret',
    price: 15900,
    colorway: 'White',
    isNew: false,
    isBestseller: false,
    fabric: 'Crepe with Lycra lining',
    embellishment: 'Net flowers and intricate beadwork',
    description: 'The long, figure-skimming skirt from the Wildflower set, offered on its own — hand-appliqued net flowers and intricate beadwork on refined white crepe. Shown here in set photography; dedicated piece imagery to follow.',
    fit: 'Long, figure-skimming skirt.',
    artVariant: 'botanical',
    images: ['assets/products/wildflower-coord-set-white/1.jpg', 'assets/products/wildflower-coord-set-white/2.jpg', 'assets/products/wildflower-coord-set-white/3.jpg', 'assets/products/wildflower-coord-set-white/4.jpg'],
  }),
  makeProduct({
    id: 'blush-dress',
    images: ['assets/products/blush-dress/1.jpg', 'assets/products/blush-dress/2.jpg', 'assets/products/blush-dress/3.jpg', 'assets/products/blush-dress/4.jpg', 'assets/products/blush-dress/5.jpg', 'assets/products/blush-dress/6.jpg'],
    name: 'Blush Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 10999,
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
    images: ['assets/products/secret-rose-corset-gown/1.jpg', 'assets/products/secret-rose-corset-gown/2.jpg', 'assets/products/secret-rose-corset-gown/3.jpg', 'assets/products/secret-rose-corset-gown/4.jpg'],
    name: 'Secret Rose Corset Gown',
    category: 'Gowns',
    collection: 'Couture',
    price: 51000,
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
    images: ['assets/products/starfall-cowl-dress-sky-blue/1.jpg', 'assets/products/starfall-cowl-dress-sky-blue/2.jpg', 'assets/products/starfall-cowl-dress-sky-blue/3.jpg', 'assets/products/starfall-cowl-dress-sky-blue/4.jpg'],
    name: 'Starfall Cowl Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 14999,
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
    images: ['assets/products/starfall-cowl-dress-black/1.jpg', 'assets/products/starfall-cowl-dress-black/2.jpg', 'assets/products/starfall-cowl-dress-black/3.jpg', 'assets/products/starfall-cowl-dress-black/4.jpg'],
    name: 'Starfall Cowl Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 14999,
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
    images: ['assets/products/fringe-cascade-gown-brown/1.jpg', 'assets/products/fringe-cascade-gown-brown/2.jpg', 'assets/products/fringe-cascade-gown-brown/3.jpg', 'assets/products/fringe-cascade-gown-brown/4.jpg', 'assets/products/fringe-cascade-gown-brown/5.jpg', 'assets/products/fringe-cascade-gown-brown/6.jpg'],
    name: 'Fringe Cascade Gown',
    category: 'Gowns',
    collection: 'Couture',
    price: 22500,
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
    images: ['assets/products/royal-draped-gown-dark-blue/1.jpg', 'assets/products/royal-draped-gown-dark-blue/2.jpg', 'assets/products/royal-draped-gown-dark-blue/3.jpg', 'assets/products/royal-draped-gown-dark-blue/4.jpg', 'assets/products/royal-draped-gown-dark-blue/5.jpg', 'assets/products/royal-draped-gown-dark-blue/6.jpg', 'assets/products/royal-draped-gown-dark-blue/7.jpg'],
    name: 'Royal Draped Gown',
    category: 'Gowns',
    collection: 'Couture',
    price: 20000,
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
    price: 19500,
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
    images: ['assets/products/black-jewel-dress/1.jpg', 'assets/products/black-jewel-dress/2.jpg', 'assets/products/black-jewel-dress/3.jpg', 'assets/products/black-jewel-dress/4.jpg'],
    name: 'Black Jewel Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 29500,
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
    images: ['assets/products/ivory-bloom-dress/1.jpg', 'assets/products/ivory-bloom-dress/2.jpg', 'assets/products/ivory-bloom-dress/3.jpg', 'assets/products/ivory-bloom-dress/4.jpg', 'assets/products/ivory-bloom-dress/5.jpg'],
    name: 'Ivory Bloom Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 19000,
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
    price: 27500,
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
    images: ['assets/products/crystal-bow-dress/1.jpg', 'assets/products/crystal-bow-dress/2.jpg', 'assets/products/crystal-bow-dress/3.jpg', 'assets/products/crystal-bow-dress/4.jpg', 'assets/products/crystal-bow-dress/5.jpg'],
    name: 'Crystal Bow Dress',
    category: 'Gowns',
    collection: 'Pret',
    price: 11000,
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
    images: ['assets/products/noir-bloom-set-black/1.jpg', 'assets/products/noir-bloom-set-black/2.jpg', 'assets/products/noir-bloom-set-black/3.jpg', 'assets/products/noir-bloom-set-black/4.jpg', 'assets/products/noir-bloom-set-black/5.jpg'],
    name: 'Noir Bloom Set',
    category: 'Co-ords & Separates',
    collection: 'Pret',
    price: 25000,
    colorway: 'Black',
    isNew: false,
    isBestseller: false,
    fabric: 'Crepe with Lycra lining',
    embellishment: 'Crystals and glass-bead fringes',
    description: 'A refined black crepe co-ord featuring a crystal-trimmed cropped top and flowing skirt, detailed with hand-embellished motifs and delicate glass-bead fringes.',
    fit: 'Cropped top with long, fluid skirt.',
    artVariant: 'grid',
  }),
  // Standalone pieces split out from the Noir Bloom Set (set kept at ₹25,000).
  // Images are the set's photos as a placeholder until dedicated per-garment
  // shots are available.
  makeProduct({
    id: 'noir-bloom-top',
    name: 'Noir Bloom Top',
    category: 'Top',
    collection: 'Pret',
    price: 11400,
    colorway: 'Black',
    isNew: false,
    isBestseller: false,
    fabric: 'Crepe with Lycra lining',
    embellishment: 'Crystals and glass-bead fringes',
    description: 'The crystal-trimmed cropped top from the Noir Bloom set, offered on its own — hand-embellished motifs finished with delicate glass-bead fringes. Shown here in set photography; dedicated piece imagery to follow.',
    fit: 'Cropped top.',
    artVariant: 'grid',
    images: ['assets/products/noir-bloom-set-black/1.jpg', 'assets/products/noir-bloom-set-black/2.jpg', 'assets/products/noir-bloom-set-black/3.jpg', 'assets/products/noir-bloom-set-black/4.jpg', 'assets/products/noir-bloom-set-black/5.jpg'],
  }),
  makeProduct({
    id: 'noir-bloom-skirt',
    name: 'Noir Bloom Skirt',
    category: 'Skirt',
    collection: 'Pret',
    price: 13800,
    colorway: 'Black',
    isNew: false,
    isBestseller: false,
    fabric: 'Crepe with Lycra lining',
    embellishment: 'Crystals and glass-bead fringes',
    description: 'The long, fluid skirt from the Noir Bloom set, offered on its own — refined black crepe with hand-embellished motifs and delicate glass-bead fringes. Shown here in set photography; dedicated piece imagery to follow.',
    fit: 'Long, fluid skirt.',
    artVariant: 'grid',
    images: ['assets/products/noir-bloom-set-black/1.jpg', 'assets/products/noir-bloom-set-black/2.jpg', 'assets/products/noir-bloom-set-black/3.jpg', 'assets/products/noir-bloom-set-black/4.jpg', 'assets/products/noir-bloom-set-black/5.jpg'],
  }),
  makeProduct({
    id: 'golden-rose-corset-with-skirt',
    images: ['assets/products/golden-rose-corset-with-skirt/1.jpg', 'assets/products/golden-rose-corset-with-skirt/2.jpg', 'assets/products/golden-rose-corset-with-skirt/3.jpg', 'assets/products/golden-rose-corset-with-skirt/4.jpg'],
    name: 'Golden Rose Corset with Skirt',
    category: 'Gowns',
    collection: 'Couture',
    price: 79000,
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
    images: ['assets/products/blue-bell-dress/1.jpg', 'assets/products/blue-bell-dress/2.jpg', 'assets/products/blue-bell-dress/3.jpg', 'assets/products/blue-bell-dress/4.jpg'],
    name: 'Blue Bell Dress',
    category: 'Dresses',
    collection: 'Couture',
    price: 39999,
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
    id: 'cream-stone-dress',
    images: ['assets/products/cream-stone-set/1.jpg', 'assets/products/cream-stone-set/2.jpg', 'assets/products/cream-stone-set/3.jpg'],
    name: 'Cream Stone Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 10999,
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
    images: ['assets/products/azure-petal-midi-dress/1.jpg', 'assets/products/azure-petal-midi-dress/2.jpg', 'assets/products/azure-petal-midi-dress/3.jpg', 'assets/products/azure-petal-midi-dress/4.jpg'],
    name: 'Azure Petal Midi Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 14999,
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
    images: ['assets/products/sky-fringe-gown/1.jpg', 'assets/products/sky-fringe-gown/2.jpg', 'assets/products/sky-fringe-gown/3.jpg', 'assets/products/sky-fringe-gown/4.jpg', 'assets/products/sky-fringe-gown/5.jpg'],
    name: 'Sky Fringe Gown',
    category: 'Gowns',
    collection: 'Pret',
    price: 34500,
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
    images: ['assets/products/aqua-pearl-mini-dress/1.jpg', 'assets/products/aqua-pearl-mini-dress/2.jpg', 'assets/products/aqua-pearl-mini-dress/3.jpg', 'assets/products/aqua-pearl-mini-dress/4.jpg'],
    name: 'Aqua Pearl Mini Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 30500,
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
    images: ['assets/products/bubblegum-ombre-mini-dress/1.jpg', 'assets/products/bubblegum-ombre-mini-dress/2.jpg', 'assets/products/bubblegum-ombre-mini-dress/3.jpg', 'assets/products/bubblegum-ombre-mini-dress/4.jpg', 'assets/products/bubblegum-ombre-mini-dress/5.jpg', 'assets/products/bubblegum-ombre-mini-dress/6.jpg'],
    name: 'Bubblegum Ombré Mini Dress',
    category: 'Dresses',
    collection: 'Pret',
    price: 39500,
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
    price: 53000,
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
    images: ['assets/products/starry-night-beaded-fringe-dress/1.jpg', 'assets/products/starry-night-beaded-fringe-dress/2.jpg', 'assets/products/starry-night-beaded-fringe-dress/3.jpg', 'assets/products/starry-night-beaded-fringe-dress/4.jpg', 'assets/products/starry-night-beaded-fringe-dress/5.jpg', 'assets/products/starry-night-beaded-fringe-dress/6.jpg', 'assets/products/starry-night-beaded-fringe-dress/7.jpg'],
    name: 'Starry Night Beaded Fringe Dress',
    category: 'Gowns',
    collection: 'Couture',
    price: 95000,
    colorway: 'Navy Blue & Light Blue',
    isNew: true,
    isBestseller: true,
    fabric: 'Silk velvet corset with embroidered mesh skirt',
    embellishment: 'Mix of beads and crystals with cascading glass-bead fringes',
    description: 'A dramatic navy and light-blue evening dress featuring a sculpted velvet corset, intricately beaded mesh skirt and cascading glass-bead fringe.',
    fit: 'Structured corset with elongated, fluid skirt.',
    artVariant: 'grid',
  }),
  makeProduct({
    id: 'golden-crystal-corset-with-skirt',
    name: 'Golden Crystal Corset with Skirt',
    category: 'Gowns',
    collection: 'Couture',
    price: 70000,
    colorway: 'Gold & Brown',
    isNew: true,
    isBestseller: false,
    images: ['assets/products/golden-crystal-corset-with-skirt/1.jpg', 'assets/products/golden-crystal-corset-with-skirt/2.jpg', 'assets/products/golden-crystal-corset-with-skirt/3.jpg', 'assets/products/golden-crystal-corset-with-skirt/4.jpg'],
    fabric: 'Hand-embroidered corset with fluid satin skirt',
    embellishment: 'Gold crystal and stone embellishment',
    description: 'A statement gold ensemble pairing a sculpted corset densely hand-embellished with rectangular crystals and stones with a fluid chocolate-satin skirt and matching draped scarf.',
    fit: 'Structured corset with fluid floor-length skirt.',
    artVariant: 'grid',
  }),
  // ---------------------------------------------------------------------------
  // PAYMENT TEST PRODUCT — ₹99. For the owner to run a real end-to-end payment
  // test cheaply. `hidden: true` keeps it out of the shop grid, search, home
  // rows and related-products, so customers never see it. Reach it directly:
  //   product.html?id=payment-test-99
  // (Kept last in the array so home "first 4" slices never pick it up.)
  // ---------------------------------------------------------------------------
  makeProduct({
    id: 'payment-test-99',
    name: 'Payment Test Piece',
    category: 'Test',
    collection: 'Payment Test',
    price: 99,
    colorway: 'Test',
    isNew: false,
    isBestseller: false,
    hidden: true,
    fabric: 'N/A — internal payment test item',
    embellishment: 'N/A',
    description: 'Internal ₹99 item used only to verify the checkout and payment flow end to end. Not a real product; hidden from the shop, search and homepage. Add to bag and proceed to checkout to test a payment.',
    fit: 'N/A',
    artVariant: 'grid',
  }),
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

// Real photo when a product has matched photography; otherwise fall back to the
// generated SVG placeholder handled by js/placeholder-art.js (.art[data-art]).
function primaryImage(product){
  // Prefer a dedicated card/campaign image when set (e.g. multi-colour group
  // shots); cart/checkout thumbnails strip cardImage so they show the variant.
  if (product && product.cardImage) return product.cardImage;
  return (product && product.images && product.images.length) ? product.images[0] : '';
}

function productImageBlock(product, opts){
  opts = opts || {};
  var extraClass = opts.extraClass || '';
  var inner = opts.inner || '';
  var cls = ('art ' + extraClass).trim();
  var img = primaryImage(product);
  if (img){
    return '<div class="' + cls + ' has-photo">' +
      '<img src="' + assetPath(img) + '" alt="' + escapeHtml(product.name + ' — ' + product.colorway) + '"' +
      ' loading="lazy" decoding="async"' +
      ' data-art-id="' + escapeHtml(product.id) + '" data-art-variant="' + (product.artVariant || '') + '"' +
      ' onerror="lrArtFallback(this)">' +
      inner + '</div>';
  }
  return '<div class="' + cls + '" data-art="' + escapeHtml(product.id) + '" data-art-variant="' + (product.artVariant || '') + '">' + inner + '</div>';
}

// If a real photo fails to load, degrade gracefully to the SVG placeholder
// (js/placeholder-art.js) instead of showing a broken-image icon.
function lrArtFallback(img){
  var wrap = img && img.closest ? img.closest('.art') : null;
  if (!wrap) return;
  var id = img.getAttribute('data-art-id') || '';
  var variant = img.getAttribute('data-art-variant') || '';
  var badge = wrap.querySelector('.badge');
  var badgeHtml = badge ? badge.outerHTML : '';
  wrap.classList.remove('has-photo');
  wrap.setAttribute('data-art', id);
  if (variant) wrap.setAttribute('data-art-variant', variant);
  if (typeof paintArt === 'function') { paintArt(wrap); } else { wrap.innerHTML = ''; }
  if (badgeHtml) wrap.insertAdjacentHTML('beforeend', badgeHtml);
}
