import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting THE FITNESS STORE database seeding...");

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || "admin@thefitnessstore.com";
  const rawPassword = process.env.ADMIN_INITIAL_PASSWORD || "Admin@TFS2026Secure";
  const adminName = process.env.ADMIN_INITIAL_NAME || "Store Administrator";
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: adminName,
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Store Settings
  const defaultSettings = [
    { key: "store_name", value: "THE FITNESS STORE", group: "general", description: "Official store brand name" },
    { key: "store_tagline", value: "Wholesaler & Retailer of Sports & Fitness Goods", group: "general", description: "Store tagline" },
    { key: "whatsapp_number", value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210", group: "whatsapp", description: "WhatsApp Business Number in international format" },
    { key: "support_email", value: "support@thefitnessstore.com", group: "contact", description: "Customer support email" },
    { key: "contact_phone", value: "+91 98765 43210", group: "contact", description: "Store phone number" },
    { key: "store_address", value: "Shop 12, Prime Fitness Hub, MG Road, Commercial Plaza, India", group: "contact", description: "Physical showroom & warehouse address" },
    { key: "hero_eyebrow", value: "BUILT FOR EVERY REP", group: "hero", description: "Homepage hero eyebrow" },
    { key: "hero_headline", value: "YOUR TRAINING. YOUR EQUIPMENT. YOUR LIMITS.", group: "hero", description: "Homepage hero headline" },
    { key: "hero_description", value: "From everyday gym essentials to performance-driven equipment, find everything you need to train harder.", group: "hero", description: "Hero description text" },
    { key: "wholesale_banner_headline", value: "BUY FOR YOUR GYM. EQUIP YOUR BUSINESS.", group: "wholesale", description: "Wholesale section headline" },
    { key: "currency_symbol", value: "₹", group: "general", description: "Currency display symbol" },
    { key: "instagram_url", value: "https://instagram.com/thefitnessstore", group: "social", description: "Instagram page" },
    { key: "facebook_url", value: "https://facebook.com/thefitnessstore", group: "social", description: "Facebook page" },
  ];

  for (const s of defaultSettings) {
    await prisma.storeSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group, description: s.description },
      create: { key: s.key, value: s.value, group: s.group, description: s.description },
    });
  }
  console.log(`✅ Store settings seeded`);

  // 3. Seed Categories
  const categoriesData = [
    { name: "Men's Wear", slug: "mens-wear", description: "High-performance athletic trackpants, gym tees & training wear for men", image: "/images/products/technosport_or_55.png", displayOrder: 1 },
    { name: "Women's Wear", slug: "womens-wear", description: "Comfortable yoga tights, straight fit pants & sports tees for women", image: "/images/products/technosport_w_110.png", displayOrder: 2 },
    { name: "Supplements", slug: "supplements", description: "High-protein peanut butter, whey nutrition & athletic recovery essentials", image: "/images/products/myfitness_1kg_high_protein.png", displayOrder: 3 },
    { name: "Shakers", slug: "shakers", description: "Stainless steel and BPA-free protein shakers with storage compartments", image: "/images/products/shifter_steel_shaker_container.png", displayOrder: 4 },
    { name: "Dumbbells", slug: "dumbbells", description: "Commercial rubber bouncer dumbbells and hex weights", image: "/images/products/bouncer_dumbbell_5kg.png", displayOrder: 5 },
    { name: "Weight Plates", slug: "weight-plates", description: "28mm regular rubber weight plates and Olympic bumper plates", image: "/images/products/rubber_plates_5kg.png", displayOrder: 6 },
    { name: "Rods and Barbells", slug: "rods-and-barbells", description: "EZ curl rods, straight barbells & Olympic lifting rods with threaded collars", image: "/images/products/ez_curl_rod_3ft.png", displayOrder: 7 },
    { name: "Gym and Weightlifting Belts", slug: "gym-belts", description: "Heavy-duty imported 13mm & 11mm lever belts and genuine leather belts", image: "/images/products/repex_lever_belt_13mm.png", displayOrder: 8 },
    { name: "Gym Equipment", slug: "gym-equipment", description: "Commercial flat benches, deadlift platforms, plate racks & multi-stations", image: "/images/products/imported_flat_bench.png", displayOrder: 9 },
    { name: "Machine Handles and Parts", slug: "machine-handles-and-parts", description: "Ergonomic lat bar sets, heavy duty tricep ropes & cable attachments", image: "/images/products/lat_bar_handle_set5.png", displayOrder: 10 },
    { name: "Wrist Wraps and Supports", slug: "wrist-wraps-and-supports", description: "Professional wrist wraps, thumb loops & heavy support straps", image: "/images/products/kobo_wrist_support.png", displayOrder: 11 },
    { name: "Resistance Bands", slug: "resistance-bands", description: "Natural latex loop bands, heavy pull-up assist bands & power bands", image: "/images/products/power_loop_band_6_4mm.png", displayOrder: 12 },
    { name: "Gym Bags & Duffle Bags", slug: "gym-bags", description: "Durable gym kit bags and duffle bags with dedicated shoe pockets", image: "/images/products/jordan_sublimation_gym_bag.png", displayOrder: 13 },
    { name: "Skipping Ropes", slug: "skipping-ropes", description: "High-speed ball bearing jump ropes & durable PVC skipping ropes", image: "/images/products/hayden_speedo_jump_rope.png", displayOrder: 14 },
    { name: "Gym Gloves & Joint Supports", slug: "gloves-and-supports", description: "Padded gym gloves with wrist support, knee sleeves & elbow supports", image: "/images/products/tenstar_gym_gloves_ts600.png", displayOrder: 15 },
    { name: "Fitness Accessories", slug: "fitness-accessories", description: "Aerobic steppers, magnetic twisters, treadmill lubricants & mobility gear", image: "/images/products/aerobic_stepper_68cm.png", displayOrder: 16 },
    { name: "Sports Gear", slug: "sports-gear", description: "Cricket bats, tournament leather balls, tennis balls & badminton kitbags", image: "/images/products/yonex_badminton_kitbag.png", displayOrder: 17 },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, image: cat.image, displayOrder: cat.displayOrder, isActive: true },
      create: { name: cat.name, slug: cat.slug, description: cat.description, image: cat.image, displayOrder: cat.displayOrder, isActive: true },
    });
    categoryMap.set(cat.slug, created.id);
  }
  console.log(`✅ Seeded ${categoryMap.size} categories`);

  // 4. Products Data
  interface SeedProduct {
    name: string;
    slug: string;
    sku: string;
    brand: string;
    categorySlug: string;
    sellingPricePaise: number;
    originalPricePaise?: number;
    shortDescription: string;
    fullDescription: string;
    stock: number;
    isFeatured: boolean;
    isNewArrival: boolean;
    isOffer: boolean;
    enquiryType: string;
    specifications: string;
    image: string;
    variants: Array<{
      name: string;
      size?: string;
      weight?: string;
      color?: string;
      pricePaise?: number;
      stock: number;
    }>;
  }

  const products: SeedProduct[] = [
    // Men's Wear
    {
      name: "Technosport OR-55 Trackpant",
      slug: "technosport-or-55-trackpant",
      sku: "TFS-MW-001",
      brand: "Technosport",
      categorySlug: "mens-wear",
      sellingPricePaise: 79900,
      originalPricePaise: 99900,
      shortDescription: "Available Sizes - M, L, XL, XXL. Available in Navy Blue & Black.",
      fullDescription: "Premium Technosport slim-fit yoga and workout trackpant engineered with ultra-soft breathable stretch fabric. Designed for all-day gym training, running, and casual athletic lifestyle.",
      stock: 45,
      isFeatured: true,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Material: 4-Way Stretch Polyester-Spandex blend\nFit: Slim Fit\nPockets: 2 Zipper Side Pockets\nWaist: Elastic Drawstring\nCare: Machine washable",
      image: "/images/products/technosport_or_55.png",
      variants: [
        { name: "Navy Blue / M", size: "M", color: "Navy Blue", stock: 12 },
        { name: "Navy Blue / L", size: "L", color: "Navy Blue", stock: 15 },
        { name: "Navy Blue / XL", size: "XL", color: "Navy Blue", stock: 10 },
        { name: "Black / L", size: "L", color: "Black", stock: 8 },
      ],
    },
    {
      name: "Technosport OR-69 Trackpant",
      slug: "technosport-or-69-trackpant",
      sku: "TFS-MW-002",
      brand: "Technosport",
      categorySlug: "mens-wear",
      sellingPricePaise: 84900,
      originalPricePaise: 109900,
      shortDescription: "Technosport 4-Way stretch Track Pant (Odour Free) Model No - OR69.",
      fullDescription: "Built with antimicrobial Odour Free technology and rapid sweat-wicking fibres. Straight athletic cut providing full range of motion for heavy squats, cardio, and field training.",
      stock: 35,
      isFeatured: false,
      isNewArrival: true,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Model No: OR69\nFabric: 4-Way Rapid Dry Micro-Stretch\nOdour Control: Silver-ion Anti-Bacterial treated\nPockets: Deep concealed zippers",
      image: "/images/products/technosport_or_69.png",
      variants: [
        { name: "Black / M", size: "M", color: "Black", stock: 10 },
        { name: "Black / L", size: "L", color: "Black", stock: 15 },
        { name: "Dark Grey / XL", size: "XL", color: "Dark Grey", stock: 10 },
      ],
    },
    {
      name: "Technosport OR-25 Trackpant",
      slug: "technosport-or-25-trackpant",
      sku: "TFS-MW-003",
      brand: "Technosport",
      categorySlug: "mens-wear",
      sellingPricePaise: 74900,
      originalPricePaise: 94900,
      shortDescription: "Available Sizes - M, L, XL. Design - Narrow Fit in 6 different colors.",
      fullDescription: "Lightweight, tapered narrow-fit trackpant engineered for bodybuilders and fitness enthusiasts seeking an aesthetic silhouette without restricting flexibility.",
      stock: 40,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Fit: Tapered Narrow Fit\nColors: 6 Assorted Colorways\nBreathability: High airflow knit\nWaistband: Ribbed elastic with cord",
      image: "/images/products/technosport_or_25.png",
      variants: [
        { name: "Black / M", size: "M", color: "Black", stock: 10 },
        { name: "Olive Green / L", size: "L", color: "Olive Green", stock: 15 },
        { name: "Charcoal / XL", size: "XL", color: "Charcoal", stock: 15 },
      ],
    },

    // Women's Wear
    {
      name: "Technosport W-110 Women's Yoga Pant/Tights",
      slug: "technosport-w-110-womens-yoga-pant",
      sku: "TFS-WW-001",
      brand: "Technosport",
      categorySlug: "womens-wear",
      sellingPricePaise: 69900,
      originalPricePaise: 89900,
      shortDescription: "Technosport Women's Yoga Pants/Tights Available in M, L, XL.",
      fullDescription: "High-waisted compression yoga tights made for flexibility, yoga flow, pilates, and high-intensity gym sessions. Squat-proof opaque fabric with buttery-soft touch.",
      stock: 30,
      isFeatured: true,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Fabric: 88% Nylon, 12% Spandex\nWaist: High Rise Wide Compression Band\nOpacity: 100% Squat Proof\nSeams: Flatlock anti-chafing",
      image: "/images/products/technosport_w_110.png",
      variants: [
        { name: "Teal Green / M", size: "M", color: "Teal Green", stock: 10 },
        { name: "Mauve Pink / L", size: "L", color: "Mauve Pink", stock: 10 },
        { name: "Midnight Black / XL", size: "XL", color: "Midnight Black", stock: 10 },
      ],
    },
    {
      name: "Technosport W-134 Women Straight Fit Trackpant",
      slug: "technosport-w-134-women-straight-fit-trackpant",
      sku: "TFS-WW-002",
      brand: "Technosport",
      categorySlug: "womens-wear",
      sellingPricePaise: 74900,
      originalPricePaise: 94900,
      shortDescription: "Available Sizes: M, L, XL. Straight Fit comfortable workout wear.",
      fullDescription: "Relaxed straight-fit trackpants tailored specifically for women seeking comfort, mobility, and clean sporty styling in daily workouts and travel.",
      stock: 25,
      isFeatured: false,
      isNewArrival: true,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Style: Straight Leg Relaxed Fit\nFabric: Breathable French Terry Stretch\nPockets: Dual Side Pockets\nWaistband: Enclosed elastic with drawcord",
      image: "/images/products/technosport_w_134.png",
      variants: [
        { name: "Grey / M", size: "M", color: "Grey", stock: 8 },
        { name: "Black / L", size: "L", color: "Black", stock: 10 },
        { name: "Navy / XL", size: "XL", color: "Navy", stock: 7 },
      ],
    },
    {
      name: "Technosport W-112 Women Tees",
      slug: "technosport-w-112-women-tees",
      sku: "TFS-WW-003",
      brand: "Technosport",
      categorySlug: "womens-wear",
      sellingPricePaise: 49900,
      originalPricePaise: 64900,
      shortDescription: "Model No: W112. Available Sizes - M, L, XL in vibrant colour options.",
      fullDescription: "Lightweight workout t-shirt featuring quick-dry moisture management and energetic athletic prints. Keeps you cool through tough HIIT and cardio routines.",
      stock: 50,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Model: W112\nFabric: 100% Quick-Dry Aerocool Polyester\nNeck: Crew Neck\nFit: Athletic Regular Fit",
      image: "/images/products/technosport_w_112.png",
      variants: [
        { name: "Sunny Yellow / M", size: "M", color: "Yellow", stock: 15 },
        { name: "Coral Red / L", size: "L", color: "Coral", stock: 20 },
        { name: "Teal Blue / XL", size: "XL", color: "Teal", stock: 15 },
      ],
    },

    // Supplements
    {
      name: "Myfitness 510g Peanut Butter Crunchy",
      slug: "myfitness-510g-peanut-butter-crunchy",
      sku: "TFS-SUP-001",
      brand: "Myfitness",
      categorySlug: "supplements",
      sellingPricePaise: 34900,
      originalPricePaise: 39900,
      shortDescription: "Chocolate Crunchy - Roasted peanut butter packed with wholesome protein.",
      fullDescription: "Original Myfitness Chocolate Crunchy Peanut Butter. High in natural protein, healthy fats, and dietary fibre. Perfect for pre-workout energy toasts, oats, and shakes.",
      stock: 60,
      isFeatured: true,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Net Weight: 510g\nTexture: Crunchy with real peanut pieces\nFlavour: Chocolate\nProtein per 100g: ~26g\nShelf Life: 12 months",
      image: "/images/products/myfitness_510g_crunchy.png",
      variants: [
        { name: "510g Chocolate Crunchy", weight: "510g", stock: 60 },
      ],
    },
    {
      name: "Myfitness 1Kg Peanut Butter High Protein",
      slug: "myfitness-1kg-peanut-butter-high-protein",
      sku: "TFS-SUP-002",
      brand: "Myfitness",
      categorySlug: "supplements",
      sellingPricePaise: 64900,
      originalPricePaise: 74900,
      shortDescription: "Myfitness Peanut Butter Olympia 1 Kg with added Whey Protein Flavour - Dark Chocolate.",
      fullDescription: "Official Olympia edition enriched with premium imported whey protein isolate. Delivers maximum protein per serving for serious athletes and muscle building goals.",
      stock: 40,
      isFeatured: true,
      isNewArrival: true,
      isOffer: true,
      enquiryType: "BOTH",
      specifications: "Weight: 1000g (1 Kg)\nProtein Content: 32g Protein per 100g\nSpecial Ingredient: Added Whey Protein Isolate\nFlavour: Rich Dark Chocolate",
      image: "/images/products/myfitness_1kg_high_protein.png",
      variants: [
        { name: "1 Kg Dark Chocolate High Protein", weight: "1kg", stock: 40 },
      ],
    },
    {
      name: "Myfitness 1.2Kg Peanut Butter Crispy",
      slug: "myfitness-1-2kg-peanut-butter-crispy",
      sku: "TFS-SUP-003",
      brand: "Myfitness",
      categorySlug: "supplements",
      sellingPricePaise: 74900,
      originalPricePaise: 84900,
      shortDescription: "Chocolate Crispy - Value jumbo pack with crispy rice puffs.",
      fullDescription: "Loaded with crunchy roasted peanuts and crispy rice balls in creamy Belgian-style chocolate butter. Ideal for bulk muscle building nutrition.",
      stock: 30,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Weight: 1200g (1.2 Kg)\nTexture: Crispy Puffs & Roasted Peanuts\nZero Trans Fat & Cholesterol",
      image: "/images/products/myfitness_1_2kg_crispy.png",
      variants: [
        { name: "1.2 Kg Chocolate Crispy", weight: "1.2kg", stock: 30 },
      ],
    },

    // Shakers
    {
      name: "Shifter Steel Shaker (with Container)",
      slug: "shifter-steel-shaker-with-container",
      sku: "TFS-SHK-001",
      brand: "Shifter",
      categorySlug: "shakers",
      sellingPricePaise: 59900,
      originalPricePaise: 79900,
      shortDescription: "High-grade stainless steel shaker with screw-on powder container.",
      fullDescription: "Insulated food-grade stainless steel shaker bottle with a detachable powder and pill organizer compartment. Odour resistant, leak-proof, and exceptionally durable.",
      stock: 50,
      isFeatured: true,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Capacity: 750ml Main + 200ml Bottom Container\nMaterial: 304 Food-Grade Stainless Steel\nClosure: Leak-Proof Flip Cap & Carry Loop\nInterior: Rounded base for lump-free mixing",
      image: "/images/products/shifter_steel_shaker_container.png",
      variants: [
        { name: "Matte Black 750ml", color: "Matte Black", stock: 25 },
        { name: "Stainless Silver 750ml", color: "Silver", stock: 25 },
      ],
    },
    {
      name: "Shifter Steel Shaker",
      slug: "shifter-steel-shaker",
      sku: "TFS-SHK-002",
      brand: "Shifter",
      categorySlug: "shakers",
      sellingPricePaise: 49900,
      originalPricePaise: 64900,
      shortDescription: "Pure stainless steel fitness shaker with wire whisk ball.",
      fullDescription: "Classic stainless steel protein mixer designed to eliminate plastic smells and withstand gym drops. Features embossed measurement markings inside and outside.",
      stock: 40,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Capacity: 700ml\nBody: Single wall lightweight 304 Steel\nWhisk: Stainless steel blending wire",
      image: "/images/products/shifter_steel_shaker.png",
      variants: [
        { name: "Classic Silver 700ml", color: "Silver", stock: 40 },
      ],
    },
    {
      name: "Shifter Commander Shaker with Protein Container",
      slug: "shifter-commander-shaker-with-protein-container",
      sku: "TFS-SHK-003",
      brand: "Shifter",
      categorySlug: "shakers",
      sellingPricePaise: 39900,
      originalPricePaise: 49900,
      shortDescription: "Ergonomic BPA-free plastic shaker with red accents and supplement jar.",
      fullDescription: "Tough BPA-free polymer body with bold red cap styling. Includes pill tray and powder compartment for seamless post-workout nutrition on the go.",
      stock: 60,
      isFeatured: false,
      isNewArrival: true,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Capacity: 600ml\nSafety: 100% BPA Free, DEHP Free\nFeatures: Dual storage base jars",
      image: "/images/products/shifter_commander_shaker.png",
      variants: [
        { name: "Red / White 600ml", color: "Red/White", stock: 60 },
      ],
    },

    // Dumbbells
    {
      name: "Bouncer Dumbbells (Pair)",
      slug: "bouncer-dumbbells-pair",
      sku: "TFS-DB-001",
      brand: "TFS Pro",
      categorySlug: "dumbbells",
      sellingPricePaise: 85000, // starting price for 2.5kg pair
      originalPricePaise: 110000,
      shortDescription: "Commercial high-density rubber bouncer dumbbells with ergonomic knurled handles.",
      fullDescription: "High-grade commercial bouncer dumbbells built with shock-absorbing solid rubber encasing and precision-knurled steel grips. Minimizes noise and protects gym flooring on impact.",
      stock: 30,
      isFeatured: true,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Grip: Chrome plated ergonomic knurl\nWeight Options: 2.5kg, 5kg, 7.5kg, 10kg pairs\nEnd Coating: High-density shock-absorbing rubber",
      image: "/images/products/bouncer_dumbbell_5kg.png",
      variants: [
        { name: "2.5 Kg Pair", weight: "2.5kg x 2", pricePaise: 85000, stock: 15 },
        { name: "5 Kg Pair", weight: "5kg x 2", pricePaise: 165000, stock: 15 },
        { name: "7.5 Kg Pair", weight: "7.5kg x 2", pricePaise: 245000, stock: 10 },
      ],
    },

    // Weight Plates
    {
      name: "Rubber Weight Plates Regular (28mm)",
      slug: "rubber-weight-plates-regular-28mm",
      sku: "TFS-WP-001",
      brand: "TFS Pro",
      categorySlug: "weight-plates",
      sellingPricePaise: 45000, // 2.5kg pair
      originalPricePaise: 60000,
      shortDescription: "28mm inner diameter heavy duty rubber coated weight plates with 3-hole grip.",
      fullDescription: "Solid cast iron core coated with heavy virgin rubber. Suitable for 28mm standard gym rods and home gym barbells. Includes integrated ergonomic hand grips for plate loaded exercises.",
      stock: 50,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Bore Size: 28mm Standard\nCore: Solid Cast Iron\nOuter: Odourless rubber protection\nGrip: Tri-grip design for easy handling",
      image: "/images/products/rubber_plates_5kg.png",
      variants: [
        { name: "2.5 Kg Pair (28mm)", weight: "2.5kg x 2", pricePaise: 45000, stock: 20 },
        { name: "5 Kg Pair (28mm)", weight: "5kg x 2", pricePaise: 85000, stock: 20 },
        { name: "7.5 Kg Pair (28mm)", weight: "7.5kg x 2", pricePaise: 125000, stock: 15 },
      ],
    },

    // Rods and Barbells
    {
      name: "3 ft EZ/Curl Regular Rod (28mm)",
      slug: "3-ft-ez-curl-regular-rod-28mm",
      sku: "TFS-ROD-001",
      brand: "TFS Pro",
      categorySlug: "rods-and-barbells",
      sellingPricePaise: 85000,
      originalPricePaise: 110000,
      shortDescription: "28mm regular zigzag EZ curl rod with heavy star collars.",
      fullDescription: "Ergonomically contoured angle reduces wrist and forearm strain during bicep curls, skull crushers, and preacher bench lifts. Solid steel construction with solid chrome finish.",
      stock: 25,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Length: 3 Feet (36 inches)\nDiameter: 28mm Standard\nCollars: 2x Threaded Star Lock Collars included\nWeight Capacity: 150 kg",
      image: "/images/products/ez_curl_rod_3ft.png",
      variants: [
        { name: "3 ft EZ Curl Rod (28mm)", size: "3 ft", stock: 25 },
      ],
    },
    {
      name: "4 ft Straight Rod Regular (28mm)",
      slug: "4-ft-straight-rod-regular-28mm",
      sku: "TFS-ROD-002",
      brand: "TFS Pro",
      categorySlug: "rods-and-barbells",
      sellingPricePaise: 95000,
      originalPricePaise: 125000,
      shortDescription: "4 ft regular straight gym rod with precision thread & star nuts.",
      fullDescription: "Solid heavy-duty carbon steel straight bar with medium knurling for bench press, deadlifts, and military presses. Threaded ends ensure plates never slip.",
      stock: 25,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Length: 4 Feet\nDiameter: 28mm\nEnd Type: Threaded with Lock Nuts\nFinish: Hard Chrome Plated",
      image: "/images/products/straight_rod_4ft_28mm.png",
      variants: [
        { name: "4 ft Straight Rod (28mm)", size: "4 ft", stock: 25 },
      ],
    },

    // Gym & Weightlifting Belts
    {
      name: "Repex Lever Belt Imported 13mm",
      slug: "repex-lever-belt-imported-13mm",
      sku: "TFS-BELT-001",
      brand: "Repex",
      categorySlug: "gym-belts",
      sellingPricePaise: 420000,
      originalPricePaise: 549900,
      shortDescription: "13mm Lever Belt (Heavy Duty) Sizes Available - S, M, L.",
      fullDescription: "Professional grade IPF-spec 13mm powerlifting lever belt built with genuine multi-layer stiff leather and heavy cast steel lever mechanism. Provides rock-solid intra-abdominal pressure for record-breaking squats and pulls.",
      stock: 20,
      isFeatured: true,
      isNewArrival: true,
      isOffer: true,
      enquiryType: "BOTH",
      specifications: "Thickness: 13mm Full Grain Leather\nWidth: 4 Inches (10cm IPF specification)\nBuckle: Heavy Alloy Steel Quick-Release Lever\nLining: Anti-slip inner black suede\nSizes: Small (27-33\"), Medium (32-38\"), Large (37-43\")",
      image: "/images/products/repex_lever_belt_13mm.png",
      variants: [
        { name: "Size S (28-32 in)", size: "S", stock: 6 },
        { name: "Size M (32-36 in)", size: "M", stock: 8 },
        { name: "Size L (36-40 in)", size: "L", stock: 6 },
      ],
    },
    {
      name: "USI Lever Belt 11mm",
      slug: "usi-lever-belt-11mm",
      sku: "TFS-BELT-002",
      brand: "USI",
      categorySlug: "gym-belts",
      sellingPricePaise: 360000,
      originalPricePaise: 450000,
      shortDescription: "11mm competition leather lever belt with precision chrome buckle.",
      fullDescription: "Premium 11mm thickness delivers optimal balance between maximum spine stabilization and immediate comfort without long break-in times.",
      stock: 18,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Thickness: 11mm\nBuckle: Polished Chrome Lever\nMaterial: Premium split leather core with suede finish",
      image: "/images/products/usi_lever_belt_11mm.png",
      variants: [
        { name: "Size M", size: "M", stock: 10 },
        { name: "Size L", size: "L", stock: 8 },
      ],
    },
    {
      name: "Leather Weight Lifting Belt",
      slug: "leather-weight-lifting-belt",
      sku: "TFS-BELT-004",
      brand: "TFS Pro",
      categorySlug: "gym-belts",
      sellingPricePaise: 120000,
      originalPricePaise: 160000,
      shortDescription: "Sizes Available - M, L, XL. Double-prong steel roller buckle with lumbar cushion.",
      fullDescription: "Classic genuine leather bodybuilding belt featuring contoured wide back support, reinforced double stitching, and a heavy-duty twin-prong roller buckle.",
      stock: 35,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Back Width: 6 Inches contoured lumbar support\nBuckle: Heavy Double Prong Steel Roller\nMaterial: 100% Genuine Treated Buffalo Leather",
      image: "/images/products/leather_weightlifting_belt.png",
      variants: [
        { name: "Size M", size: "M", stock: 12 },
        { name: "Size L", size: "L", stock: 15 },
        { name: "Size XL", size: "XL", stock: 8 },
      ],
    },

    // Gym Equipment
    {
      name: "Bumper Plates Stand (Heavy Duty)",
      slug: "bumper-plates-stand-heavy-duty",
      sku: "TFS-EQP-001",
      brand: "TFS Commercial",
      categorySlug: "gym-equipment",
      sellingPricePaise: 580000,
      originalPricePaise: 750000,
      shortDescription: "Commercial Heavy Duty for Gym. Horizontal toaster-style bumper plate organizer.",
      fullDescription: "Heavy-gauge steel bumper plate toaster rack with integrated transport wheels and handle. Keeps gym floors organized and bumper plates easily accessible during workouts.",
      stock: 10,
      isFeatured: true,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Frame: 3x2 inch 11-gauge tubular steel\nSlots: 8 plate dividers fitting up to 25kg bumper plates\nMobility: Wheels on rear with front handle for easy gym movement\nFinish: Scratch-resistant matte black powder coat",
      image: "/images/products/bumper_plates_stand.png",
      variants: [
        { name: "Standard Matte Black", color: "Matte Black", stock: 10 },
      ],
    },
    {
      name: "Imported Gym Flat Bench",
      slug: "imported-gym-flat-bench",
      sku: "TFS-EQP-002",
      brand: "TFS Commercial",
      categorySlug: "gym-equipment",
      sellingPricePaise: 850000,
      originalPricePaise: 1100000,
      shortDescription: "Uses: Commercial. Heavy-duty competition flat utility bench.",
      fullDescription: "Rock-solid 3-point stance flat bench engineered with high-density tear-resistant vinyl padding and reinforced structural steel. Handles over 450 kg without wobbling.",
      stock: 8,
      isFeatured: true,
      isNewArrival: true,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Rating: 500 kg maximum load\nPad: 2.75 inch high-density recycled foam with grippy vinyl\nHeight: 17 inches IPF standard height from floor",
      image: "/images/products/imported_flat_bench.png",
      variants: [
        { name: "Commercial Flat Bench", stock: 8 },
      ],
    },
    {
      name: "Fit Bulls Deadlift Platform (Imported)",
      slug: "fit-bulls-deadlift-platform-imported",
      sku: "TFS-EQP-003",
      brand: "Fit Bulls",
      categorySlug: "gym-equipment",
      sellingPricePaise: 1850000,
      originalPricePaise: 2400000,
      shortDescription: "Thickness - 50mm Heavy Duty for Commercial Gym.",
      fullDescription: "Professional Olympic deadlift and powerlifting platform with thick tongue-and-groove hardwood center and dense 50mm rubber drop tiles enclosed in heavy steel perimeter corners.",
      stock: 5,
      isFeatured: true,
      isNewArrival: false,
      isOffer: true,
      enquiryType: "WHOLESALE",
      specifications: "Overall Thickness: 50mm solid construction\nCenter: Multi-ply lacquered hardwood lifting zone\nDrop Wings: High-density shock & sound absorbing rubber\nFrame: Heavy corner-braced steel band",
      image: "/images/products/fit_bulls_deadlift_platform.png",
      variants: [
        { name: "8ft x 6ft Standard Commercial", size: "8x6 ft", stock: 5 },
      ],
    },
    {
      name: "NB Multi Station",
      slug: "nb-multi-station",
      sku: "TFS-EQP-004",
      brand: "NB Fitness",
      categorySlug: "gym-equipment",
      sellingPricePaise: 4800000,
      originalPricePaise: 6200000,
      shortDescription: "A complete workout home gym machine that trains every part of our body.",
      fullDescription: "All-in-one multi jungle gym station incorporating lat pulldown, seated low row, chest press, pec fly, leg extension, and preacher curl stations with enclosed pin-select weight stacks.",
      stock: 4,
      isFeatured: false,
      isNewArrival: true,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Weight Stack: 150 lbs heavy-duty vinyl/cast stack\nCables: Aircraft-grade 2000 lb rated steel cables\nPulleys: Sealed ball-bearing nylon pulleys",
      image: "/images/products/nb_multi_station.png",
      variants: [
        { name: "Multi Station Standard Stack", stock: 4 },
      ],
    },

    // Machine Handles and Parts
    {
      name: "Imported Lat Bar Handle (Set of 5)",
      slug: "imported-lat-bar-handle-set-of-5",
      sku: "TFS-MCH-001",
      brand: "TFS Pro",
      categorySlug: "machine-handles-and-parts",
      sellingPricePaise: 650000,
      originalPricePaise: 850000,
      shortDescription: "Complete set of 5 ergonomic neutral and wide-grip cable pulldown attachments.",
      fullDescription: "Features biomechanically engineered angled grips that isolate lats and back musculature while dramatically reducing wrist and joint stress. Dipped in textured non-slip rubber.",
      stock: 15,
      isFeatured: true,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Set Includes: 5 Handles (Wide, Medium Pronate, Medium Supinate, Narrow Neutral, Close Supinate)\nCoating: Matte black vulcanized rubber dip\nCore: Solid 10mm high tensile steel plate",
      image: "/images/products/lat_bar_handle_set5.png",
      variants: [
        { name: "Set of 5 Handles", stock: 15 },
      ],
    },
    {
      name: "Tricep Rope Heavy Duty (Imported)",
      slug: "tricep-rope-heavy-duty-imported",
      sku: "TFS-MCH-002",
      brand: "TFS Pro",
      categorySlug: "machine-handles-and-parts",
      sellingPricePaise: 85000,
      originalPricePaise: 110000,
      shortDescription: "Thick braided nylon rope with heavy solid rubber ends and steel swivel.",
      fullDescription: "Classic commercial tricep pushdown and facepull attachment. Heavy woven nylon braid with oversized solid rubber stopper ends for non-slip grip even when sweating.",
      stock: 35,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Length: 28 inches (70cm)\nRope Diameter: 1.25 inches thick braided nylon\nHanger: Chrome-plated universal carabiner clip attachment",
      image: "/images/products/tricep_rope_heavy_duty.png",
      variants: [
        { name: "28-inch Standard Rope", stock: 35 },
      ],
    },

    // Wrist Wraps and Supports
    {
      name: "Kobo Wrist Support",
      slug: "kobo-wrist-support-wta-04",
      sku: "TFS-WRS-001",
      brand: "Kobo",
      categorySlug: "wrist-wraps-and-supports",
      sellingPricePaise: 35000,
      originalPricePaise: 49900,
      shortDescription: "Item Code: WTA-04. Elastic compression wrist support with wide Velcro.",
      fullDescription: "Authentic Kobo WTA-04 wrist wraps engineered for heavy bench pressing, overhead push presses, and CrossFit workouts. Prevents hyper-extension and wrist pain under load.",
      stock: 45,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Item Code: WTA-04\nMaterial: Heavy Elastic Cotton Polyester\nFastener: Industrial grade hook and loop fastener\nThumb Loop: Reinforced elastic loop",
      image: "/images/products/kobo_wrist_support.png",
      variants: [
        { name: "Pair - Black/Green", color: "Black/Green", stock: 45 },
      ],
    },
    {
      name: "Arrowmax Professional Wrist Straps with Thumb Loop",
      slug: "arrowmax-professional-wrist-straps",
      sku: "TFS-WRS-002",
      brand: "Arrowmax",
      categorySlug: "wrist-wraps-and-supports",
      sellingPricePaise: 45000,
      originalPricePaise: 59900,
      shortDescription: "Heavy duty competition grade wrist support wraps with thumb loop.",
      fullDescription: "Stiff woven elastic wrist wraps specifically engineered for powerlifters and heavy weight trainers requiring maximum joint immobilization during maximum-effort lifts.",
      stock: 30,
      isFeatured: false,
      isNewArrival: true,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Length: 18 Inches\nWidth: 3 Inches\nClosure: Heavy duty Velcro",
      image: "/images/products/arrowmax_wrist_straps.png",
      variants: [
        { name: "Black / Yellow Pair", color: "Black/Yellow", stock: 30 },
      ],
    },

    // Gym Bags
    {
      name: "Jordan Sublimation Gym Bag with Shoe Pocket",
      slug: "jordan-sublimation-gym-bag-with-shoe-pocket",
      sku: "TFS-BAG-001",
      brand: "Jordan",
      categorySlug: "gym-bags",
      sellingPricePaise: 115000,
      originalPricePaise: 159900,
      shortDescription: "Sublimated premium gym duffle bag with isolated ventilated shoe pocket.",
      fullDescription: "Spacious cylindrical gym duffle bag featuring eye-catching sublimation print, water-resistant base, and separate side compartment to keep dirty sneakers away from clean clothes.",
      stock: 25,
      isFeatured: true,
      isNewArrival: true,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Capacity: 35 Litres\nShoe Compartment: Dedicated zippered side pocket\nShoulder Strap: Padded detachable strap\nWater Resistance: Water-repellent polyester shell",
      image: "/images/products/jordan_sublimation_gym_bag.png",
      variants: [
        { name: "Urban Camo / White", color: "White/Camo", stock: 25 },
      ],
    },
    {
      name: "Nivia Deflate 2.0 Gym Bag",
      slug: "nivia-deflate-2-0-gym-bag",
      sku: "TFS-BAG-004",
      brand: "Nivia",
      categorySlug: "gym-bags",
      sellingPricePaise: 85000,
      originalPricePaise: 115000,
      shortDescription: "Bag Capacity: 20 Litres - Kit Bag - Material: Polyester.",
      fullDescription: "Authentic Nivia Deflate 2.0 lightweight barrel duffle gym bag. Highly durable polyester construction with reinforced grab handles and smooth nylon coil zippers.",
      stock: 30,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Brand: Nivia\nModel: Deflate 2.0\nCapacity: 20 Litres\nDimensions: 45 x 22 x 22 cm\nMaterial: High Density Polyester",
      image: "/images/products/nivia_deflate_gym_bag.png",
      variants: [
        { name: "Black / Blue 20L", color: "Black/Blue", stock: 30 },
      ],
    },

    // Skipping Ropes
    {
      name: "Hayden Speedo Jump Rope with Bearing",
      slug: "hayden-speedo-jump-rope-with-bearing",
      sku: "TFS-ROP-003",
      brand: "Hayden",
      categorySlug: "skipping-ropes",
      sellingPricePaise: 20000,
      originalPricePaise: 29900,
      shortDescription: "Foam Padded Handle for Perfect Grip. 360-degree high-speed ball bearings.",
      fullDescription: "High-speed skipping rope engineered for double-unders, boxing footwork, and intense calorie-burning HIIT sessions. Cushioned foam grips absorb sweat effortlessly.",
      stock: 50,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Bearing: 360-degree dual ball bearing in handles\nHandle: Ergonomic sweat-absorbent foam padding\nRope: Durable PVC coated cable\nLength: 300cm fully adjustable with screws",
      image: "/images/products/hayden_speedo_jump_rope.png",
      variants: [
        { name: "Adjustable Speed Rope", stock: 50 },
      ],
    },

    // Gym Gloves & Supports
    {
      name: "Tenstar Gym Gloves TS 600",
      slug: "tenstar-gym-gloves-ts-600",
      sku: "TFS-GLV-001",
      brand: "Tenstar",
      categorySlug: "gloves-and-supports",
      sellingPricePaise: 45000,
      originalPricePaise: 59900,
      shortDescription: "Breathable padded workout gloves with silicon anti-slip palm grip.",
      fullDescription: "Reinforced weightlifting gloves with cushioned palm padding that shields hands from calluses and blisters during pull-ups, barbell rows, and kettlebell snatches.",
      stock: 40,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Palm: Microfiber with silicon anti-slip pattern\nBack: 4-Way stretch breathable mesh\nPull Tabs: Easy off finger pull tabs",
      image: "/images/products/tenstar_gym_gloves_ts600.png",
      variants: [
        { name: "Size M", size: "M", stock: 15 },
        { name: "Size L", size: "L", stock: 15 },
        { name: "Size XL", size: "XL", stock: 10 },
      ],
    },

    // Resistance Bands
    {
      name: "Imported Power/Loop Band (6.4mm)",
      slug: "imported-power-loop-band-6-4mm",
      sku: "TFS-BND-001",
      brand: "TFS Pro",
      categorySlug: "resistance-bands",
      sellingPricePaise: 35000,
      originalPricePaise: 49900,
      shortDescription: "Dimension: 2080*6.4*4.5mm - Color: Yellow. Light tension mobility loop.",
      fullDescription: "Premium continuous-loop 100% natural latex band. Ideal for rotator cuff warm-ups, shoulder mobility drills, rehabilitation, and light resistance conditioning.",
      stock: 50,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Dimensions: 2080 mm circumference x 6.4 mm width x 4.5 mm thickness\nResistance: 5 to 15 lbs\nColor: Yellow\nMaterial: 100% Natural Layered Latex",
      image: "/images/products/power_loop_band_6_4mm.png",
      variants: [
        { name: "Yellow (6.4mm - Light)", color: "Yellow", stock: 50 },
      ],
    },
    {
      name: "Arrowmax Power Loop Band Heavy",
      slug: "arrowmax-power-loop-band-heavy",
      sku: "TFS-BND-004",
      brand: "Arrowmax",
      categorySlug: "resistance-bands",
      sellingPricePaise: 85000,
      originalPricePaise: 110000,
      shortDescription: "Heavy red resistance band for pull-up assistance, squats, and banded bench.",
      fullDescription: "Thick powerlifting resistance band capable of heavy tension. Perfect for banded squats, deadlift accommodating resistance, and assisted pull-ups.",
      stock: 30,
      isFeatured: true,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Color: Red\nResistance: 50 to 125 lbs\nCircumference: 2080 mm\nDurability: High-tensile snap-resistant latex",
      image: "/images/products/arrowmax_power_loop_heavy.png",
      variants: [
        { name: "Red (Heavy 50-125 lbs)", color: "Red", stock: 30 },
      ],
    },

    // Fitness Accessories
    {
      name: "Aerobic Stepper 68 cms",
      slug: "aerobic-stepper-68-cms",
      sku: "TFS-ACC-003",
      brand: "TFS Pro",
      categorySlug: "fitness-accessories",
      sellingPricePaise: 145000,
      originalPricePaise: 195000,
      shortDescription: "Size - 68*28*15cm Heavy-duty Polypropylene Material. Adjustable height.",
      fullDescription: "Commercial aerobic fitness step bench with non-skid textured top surface and height risers. Great for cardiovascular training, aerobic choreography, lunges, and calf raises.",
      stock: 20,
      isFeatured: true,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Platform Size: 68 cm x 28 cm\nAdjustable Heights: 10 cm and 15 cm with risers\nWeight Capacity: 150 kg\nSurface: Non-slip grooved rubberized texture",
      image: "/images/products/aerobic_stepper_68cm.png",
      variants: [
        { name: "Standard 68cm Stepper", stock: 20 },
      ],
    },
    {
      name: "Super Lube Treadmill Belt Spray",
      slug: "super-lube-treadmill-belt-spray",
      sku: "TFS-ACC-002",
      brand: "Super Lube",
      categorySlug: "fitness-accessories",
      sellingPricePaise: 45000,
      originalPricePaise: 59900,
      shortDescription: "Best suited for Commercial as well as Domestic Treadmills. 100% pure silicone.",
      fullDescription: "High-viscosity silicone aerosol lubricant designed specifically for treadmill running decks. Reduces motor strain, stops friction heat, and prolongs belt lifespan.",
      stock: 45,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Volume: 500ml Spray Can with precision straw\nBase: 100% Pure Non-Toxic Silicone\nApplications: Commercial gyms & home fitness treadmills",
      image: "/images/products/super_lube_treadmill_spray.png",
      variants: [
        { name: "500ml Aerosol Spray", stock: 45 },
      ],
    },
    {
      name: "Bell's Twister",
      slug: "bells-twister",
      sku: "TFS-ACC-001",
      brand: "Bell's",
      categorySlug: "fitness-accessories",
      sellingPricePaise: 65000,
      originalPricePaise: 85000,
      shortDescription: "Rotating waist trimming disc with magnetic acupressure nodes.",
      fullDescription: "Smooth ball-bearing rotating exercise board designed for core toning, obliques sculpting, and foot reflexology during cardio routines.",
      stock: 25,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Diameter: 30 cm\nBearing: High precision smooth rotating steel balls\nFootplate: Reflexology acupoints with embedded therapy magnets",
      image: "/images/products/bells_twister.png",
      variants: [
        { name: "Blue Disc (Acupressure)", color: "Blue", stock: 25 },
      ],
    },

    // Sports Gear
    {
      name: "Yonex Sunr2225 Badminton Kitbag",
      slug: "yonex-sunr2225-badminton-kitbag",
      sku: "TFS-SPT-004",
      brand: "Yonex",
      categorySlug: "sports-gear",
      sellingPricePaise: 185000,
      originalPricePaise: 249900,
      shortDescription: "Dual compartment racket bag with thermal thermo-guard foil lining.",
      fullDescription: "Authentic Yonex tournament series kit bag designed to hold up to 6 badminton rackets comfortably alongside clothing, shuttlecocks, shoes, and grip accessories.",
      stock: 15,
      isFeatured: true,
      isNewArrival: true,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Model: Sunr2225\nCapacity: 6 Rackets + Apparel\nProtection: Thermo-guard heat reflection layer\nStraps: Backpack style padded twin straps",
      image: "/images/products/yonex_badminton_kitbag.png",
      variants: [
        { name: "Black / Neon Green", color: "Black/Green", stock: 15 },
      ],
    },
    {
      name: "8Kg Vinyl Kettlebell",
      slug: "8kg-vinyl-kettlebell",
      sku: "TFS-KTB-001",
      brand: "TFS Pro",
      categorySlug: "dumbbells",
      sellingPricePaise: 145000,
      originalPricePaise: 189900,
      shortDescription: "Smooth cast iron kettlebell encased in floor-friendly red vinyl.",
      fullDescription: "Ergonomic wide horn grip suitable for single and two-handed swings, clean and press, and Turkish get-ups. Flat stable bottom prevents rolling.",
      stock: 20,
      isFeatured: false,
      isNewArrival: false,
      isOffer: false,
      enquiryType: "BOTH",
      specifications: "Weight: 8 Kg\nCoating: Thick protective vinyl shell\nHandle: Smooth anti-slip cast handle\nBase: Anti-roll flat base",
      image: "/images/products/vinyl_kettlebell_8kg.png",
      variants: [
        { name: "8 Kg Vinyl (Red)", weight: "8kg", stock: 20 },
      ],
    },
  ];

  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) {
      console.warn(`Category slug ${p.categorySlug} not found for product ${p.name}`);
      continue;
    }

    const createdProduct = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        sku: p.sku,
        brand: p.brand,
        categoryId,
        sellingPricePaise: p.sellingPricePaise,
        originalPricePaise: p.originalPricePaise,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription,
        stock: p.stock,
        isAvailable: true,
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isOffer: p.isOffer,
        enquiryType: p.enquiryType,
        specifications: p.specifications,
        seoTitle: `${p.name} | THE FITNESS STORE`,
        seoDescription: p.shortDescription,
      },
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        brand: p.brand,
        categoryId,
        sellingPricePaise: p.sellingPricePaise,
        originalPricePaise: p.originalPricePaise,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription,
        stock: p.stock,
        isAvailable: true,
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isOffer: p.isOffer,
        enquiryType: p.enquiryType,
        specifications: p.specifications,
        seoTitle: `${p.name} | THE FITNESS STORE`,
        seoDescription: p.shortDescription,
      },
    });

    // Seed product image
    await prisma.productImage.deleteMany({ where: { productId: createdProduct.id } });
    await prisma.productImage.create({
      data: {
        productId: createdProduct.id,
        url: p.image,
        alt: p.name,
        displayOrder: 0,
      },
    });

    // Seed variants
    await prisma.productVariant.deleteMany({ where: { productId: createdProduct.id } });
    for (const v of p.variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          name: v.name,
          size: v.size,
          weight: v.weight,
          color: v.color,
          pricePaise: v.pricePaise || p.sellingPricePaise,
          stock: v.stock,
          isAvailable: true,
        },
      });
    }
  }
  console.log(`✅ Seeded ${products.length} products with variants and images`);

  // 5. Seed Homepage Banners
  const banners = [
    {
      title: "YOUR TRAINING. YOUR EQUIPMENT. YOUR LIMITS.",
      subtitle: "BUILT FOR EVERY REP",
      tag: "FEATURED COLLECTION",
      ctaLabel: "SHOP NOW",
      ctaUrl: "/shop",
      displayOrder: 1,
      isActive: true,
    },
    {
      title: "EQUIP YOUR COMMERCIAL GYM",
      subtitle: "WHOLESALE CATALOGUE",
      tag: "BULK ENQUIRIES",
      ctaLabel: "EXPLORE WHOLESALE",
      ctaUrl: "/bulk-orders",
      displayOrder: 2,
      isActive: true,
    },
    {
      title: "IPF-SPEC LEVER BELTS & POWERLIFTING GEAR",
      subtitle: "HEAVY DUTY 13MM & 11MM",
      tag: "STRENGTH ESSENTIALS",
      ctaLabel: "VIEW LEVER BELTS",
      ctaUrl: "/shop/gym-belts",
      displayOrder: 3,
      isActive: true,
    },
  ];

  await prisma.homepageBanner.deleteMany({});
  for (const b of banners) {
    await prisma.homepageBanner.create({ data: b });
  }
  console.log(`✅ Seeded homepage banners`);

  // 6. Seed Offers
  const offers = [
    {
      title: "Flat 15% Off On Powerlifting Lever Belts",
      badge: "LIMITED PERIOD",
      description: "Direct wholesale rates on imported 13mm & 11mm lever belts for competitive lifters.",
      code: "TFSBELT15",
      discountPercent: 15,
      isActive: true,
      ctaLabel: "SHOP BELTS",
      ctaUrl: "/shop/gym-belts",
    },
    {
      title: "Gym Owner Bulk Setup Package",
      badge: "WHOLESALE SPECIAL",
      description: "Equip your full commercial gym floor with bumper stands, deadlift platforms, and dumbells at direct dealer pricing.",
      code: "TFSGYMSETUP",
      discountPercent: 20,
      isActive: true,
      ctaLabel: "ENQUIRE ON WHATSAPP",
      ctaUrl: "/bulk-orders",
    },
  ];

  await prisma.offer.deleteMany({});
  for (const off of offers) {
    await prisma.offer.create({ data: off });
  }
  console.log(`✅ Seeded offers`);

  console.log("🏁 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
