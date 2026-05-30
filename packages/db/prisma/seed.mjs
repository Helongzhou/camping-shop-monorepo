import { PrismaClient } from '@prisma/client';

const SITE_SETTINGS_ID = 'singleton';

const prisma = new PrismaClient();

const siteContents = [
  {
    locale: 'en',
    siteName: 'TrailNest',
    announcement: 'Free shipping on TrailNest orders over $50',
    footerText: '© 2026 TrailNest. All prices in USD.',
  },
  {
    locale: 'zh',
    siteName: '趣巢',
    announcement: '趣巢满 $50 免运费',
    footerText: '© 2026 趣巢（TrailNest）。所有价格均以美元（USD）显示。',
  },
];

const categories = [
  {
    slug: 'tents',
    name: 'Tents',
    description: 'Ultralight and weather-ready shelters for every season on the trail.',
    sortOrder: 1,
  },
  {
    slug: 'sleeping-bags',
    name: 'Sleeping Bags',
    description: 'Warm, packable sleep systems rated for alpine nights and summer camps.',
    sortOrder: 2,
  },
  {
    slug: 'backpacks',
    name: 'Backpacks',
    description: 'Trail-tested packs with ergonomic support for day hikes and thru-hikes.',
    sortOrder: 3,
  },
  {
    slug: 'camp-kitchen',
    name: 'Camp Kitchen',
    description: 'Stoves, cookware, and essentials to fuel your backcountry meals.',
    sortOrder: 4,
  },
];

const products = [
  {
    slug: 'trailnest-ultralight-2p',
    name: 'TrailNest Ultralight 2P Tent',
    description:
      'A 2-person freestanding tent with dual doors, seam-taped fly, and a packed weight under 1.5 kg for fast alpine missions.',
    priceCents: 24900,
    stock: 18,
    imageUrl:
      'https://images.unsplash.com/photo-1478131143081-80f7f84b01e7?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'tents',
  },
  {
    slug: 'summit-dome-3p',
    name: 'Summit Dome 3P Tent',
    description:
      'Spacious three-person dome tent with full-coverage rainfly and reinforced guylines for windy ridgelines.',
    priceCents: 32900,
    stock: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'tents',
  },
  {
    slug: 'aurora-15-down-bag',
    name: 'Aurora 15°F Down Sleeping Bag',
    description:
      '850-fill responsibly sourced down with a mummy cut and draft collar rated to 15°F for cold shoulder seasons.',
    priceCents: 18900,
    stock: 25,
    imageUrl:
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'sleeping-bags',
  },
  {
    slug: 'pine-synthetic-30-bag',
    name: 'Pine Synthetic 30°F Sleeping Bag',
    description:
      'Quick-drying synthetic insulation that stays warm when damp — ideal for humid climates and river trips.',
    priceCents: 9900,
    stock: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1473341304170-971ddcc1541e?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'sleeping-bags',
  },
  {
    slug: 'ridge-explorer-45l',
    name: 'Ridge Explorer 45L Backpack',
    description:
      'Ventilated back panel, adjustable torso length, and side pockets sized for soft flasks and trail maps.',
    priceCents: 15900,
    stock: 22,
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'backpacks',
  },
  {
    slug: 'thru-trail-65l',
    name: 'Thru Trail 65L Backpack',
    description:
      'Load-lifter harness and removable top lid for multi-day treks with a 65-liter capacity and hydration sleeve.',
    priceCents: 21900,
    stock: 14,
    imageUrl:
      'https://images.unsplash.com/photo-1622260614153-03223fb72052?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'backpacks',
  },
  {
    slug: 'ember-canister-stove',
    name: 'Ember Canister Stove Kit',
    description:
      'Compact canister stove with piezo ignition, windscreen, and nested pot set for two backcountry meals.',
    priceCents: 7900,
    stock: 40,
    imageUrl:
      'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'camp-kitchen',
  },
  {
    slug: 'trail-brew-coffee-set',
    name: 'Trail Brew Coffee Set',
    description:
      'Ultralight pour-over dripper and insulated mug combo for sunrise brews at camp.',
    priceCents: 4500,
    stock: 35,
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'camp-kitchen',
  },
];

async function seedSiteSettings() {
  await prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    create: { id: SITE_SETTINGS_ID },
    update: {},
  });

  for (const content of siteContents) {
    await prisma.siteContent.upsert({
      where: {
        settingsId_locale: {
          settingsId: SITE_SETTINGS_ID,
          locale: content.locale,
        },
      },
      create: {
        settingsId: SITE_SETTINGS_ID,
        locale: content.locale,
        siteName: content.siteName,
        announcement: content.announcement,
        footerText: content.footerText,
      },
      update: {
        siteName: content.siteName,
        announcement: content.announcement,
        footerText: content.footerText,
      },
    });
  }
}

async function seedCatalog() {
  const categoryIdBySlug = new Map();

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
      },
    });
    categoryIdBySlug.set(category.slug, record.id);
  }

  for (const product of products) {
    const categoryId = categoryIdBySlug.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(`Missing category for product: ${product.slug}`);
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        priceCents: product.priceCents,
        stock: product.stock,
        imageUrl: product.imageUrl,
        categoryId,
      },
      update: {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        stock: product.stock,
        imageUrl: product.imageUrl,
        categoryId,
      },
    });
  }
}

async function main() {
  await seedSiteSettings();
  await seedCatalog();
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
