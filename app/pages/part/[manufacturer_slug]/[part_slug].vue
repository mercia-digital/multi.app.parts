<template>
  <div>
    <!-- Error state -->
    <div v-if="error" class="text-center">
      <h2 class="text-2xl font-bold text-red-600">Error Loading Part</h2>
      <p class="mt-4">{{ error.message || 'Unable to load part details. Please try again later.' }}</p>
    </div>

    <!-- No part found state -->
    <div v-else-if="!pending && !partValue" class="text-center">
      <h2 class="text-2xl font-bold">Part Not Found</h2>
      <p class="mt-4">The requested part could not be found.</p>
    </div>

    <!-- Loading state -->
    <div v-else-if="pending" class="text-center py-16">
      <USkeleton class="h-8 w-64 mx-auto mb-6" />
      <USkeleton class="h-6 w-80 mx-auto mb-4" />
      <USkeleton class="h-6 w-72 mx-auto" />
    </div>

    <!-- Part details -->
    <div v-else>
      <div class="flex flex-wrap">
        <div class="w-full p-2 text-left">
          <h1 class="text-[#304d6d] font-medium text-4xl mb-2">{{ safeTitle }}</h1>
          <hr class="alt border-0 border-b-4 border-gray-300 mb-4" />
        </div>

        <!-- Meta/Info -->
        <div class="w-full lg:w-1/2 p-2 text-left">
          <h2 v-if="manufacturerName">Manufacturer: <span class="text-[#2275b5]">{{ manufacturerName }}</span></h2>
          <h2>Part Number: <span class="text-[#2275b5]">{{ partNumber }}</span></h2>

          <div v-if="modalities && modalities.length" class="mb-4">
            <h3 class="mb-2 flex items-center gap-2 flex-wrap">
              <span>Modality:</span>
              <span v-for="(mod, i) in modalities" :key="i" class="text-[#2275b5]">{{ mod.modalities_id?.name || mod.name }}</span>
            </h3>
          </div>

          <hr class="border-0 border-b-2 border-gray-200 my-6" />

          <div class="space-y-3">
            <div>
              <h3>Condition: <span class="text-[#2275b5] capitalize">{{ partValue?.condition || 'New' }}</span></h3>
            </div>
            <div v-if="partValue?.warranty">
              <h3>Warranty: <span class="text-[#2275b5]">{{ partValue.warranty }}</span></h3>
            </div>
            <div v-if="returnableText !== null">
              <h3>Returnable: <span class="text-[#2275b5]">{{ returnableText }}</span></h3>
            </div>
            <div v-if="manufacturerName !== 'NXT Power'">
              <h3>OEM Quality Assurance: <span class="text-[#2275b5]">Passed</span></h3>
            </div>
            <div v-if="manufacturerName !== 'NXT Power'">
              <h3>Lead Times: <span class="text-[#2275b5]">Most parts shipped from inventory on the same day.</span></h3>
            </div>
            <div>
              <UButton
                color="secondary"
                variant="solid"
                :href="quoteUrl"
                target="_blank"
                as="a"
                class="rounded-full"
                size="xl"
              >Request a Quote</UButton>
            </div>
          </div>

          <hr class="border-0 border-b-2 border-gray-200 my-6" />

          <div v-if="partValue?.content" class="product-content prose max-w-none" v-html="partValue.content"></div>

          <div v-if="attributes && attributes.length" class="mt-6">
            <h3 class="mb-3">Other Attributes</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UCard v-for="(item, index) in attributes" :key="index">
                <template #header>
                  <span class="text-center w-full block">{{ item.name }}</span>
                </template>
                <div class="text-center text-xl font-bold">{{ item.value }}</div>
              </UCard>
            </div>
          </div>
        </div>

        <!-- Gallery -->
        <div class="w-full lg:w-1/2 lg:p-14 sm:p-10 p-4">
          <div class="gallery-wrapper">
            <UCarousel
              v-if="images && images.length"
              :items="images"
              :start-index="currentIndex"
              :arrows="true"
              :dots="false"
              class="mb-4"
              @select="onSelect"
            >
              <template #default="{ item }">
                <div class="flex items-center justify-center bg-gray-50">
                  <img :src="item.src" :alt="item.alt" class="max-h-[420px] object-contain w-full" />
                </div>
              </template>
            </UCarousel>

            <div v-else class="no-image-placeholder text-center py-16">
              <img :src="fallbackImageUrl" alt="MULTI, INC." class="mx-auto max-h-[300px] object-contain" />
            </div>

            <div v-if="images && images.length > 1" class="grid grid-cols-4 gap-2">
              <button
                v-for="(img, idx) in images"
                :key="img.id || idx"
                class="border-2 rounded overflow-hidden focus:outline-none"
                :class="idx === currentIndex ? 'border-[#2f4c6c]' : 'border-transparent'"
                @click="goTo(idx)"
              >
                <img :src="img.thumb || img.src" :alt="img.alt" class="w-full h-20 object-contain" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </template>

<script setup>
import { computed, ref } from 'vue';
import he from 'he';

const route = useRoute();
const manufacturer_slug = route.params.manufacturer_slug;
const part_slug = route.params.part_slug;

const runtimeConfig = useRuntimeConfig();

const { data: part, pending, error } = await usePart(part_slug, manufacturer_slug);
const { data: appSettings } = await useAppSettings();

const partValue = computed(() => part.value || null);

const manufacturerName = computed(() => {
  const p = partValue.value;
  if (!p?.manufacturer) return '';
  return typeof p.manufacturer === 'object' ? p.manufacturer.name : p.manufacturer;
});

const partNumber = computed(() => partValue.value?.part_number || '');

const safeTitle = computed(() => he.decode(partValue.value?.title || ''));

const fallbackImageUrl = computed(() => {
  const id = appSettings.value?.default_image;
  return id ? `${runtimeConfig.public.directus.url}/assets/${id}?fit=inside&width=600` : '';
});

// Normalize images from directus
const images = computed(() => {
  const p = partValue.value;
  if (!p) return [];
  const makeUrl = (id, w = 600) => `${runtimeConfig.public.directus.url}/assets/${id}?fit=inside&width=${w}`;
  const list = [];
  if (p.primary_image?.id) {
    list.push({ id: p.primary_image.id, src: makeUrl(p.primary_image.id, 600), thumb: makeUrl(p.primary_image.id, 180), alt: p.primary_image.title || safeTitle.value || 'Part Image' });
  }
  if (Array.isArray(p.gallery)) {
    for (const g of p.gallery) {
      const id = g?.directus_files_id?.id || g?.id;
      if (!id) continue;
      // avoid duplicate primary
      if (p.primary_image?.id && id === p.primary_image.id) continue;
      const alt = g?.directus_files_id?.title || g?.title || safeTitle.value || 'Part Image';
      list.push({ id, src: makeUrl(id, 600), thumb: makeUrl(id, 180), alt });
    }
  }
  return list;
});

const attributes = computed(() => partValue.value?.attributes || []);
const modalities = computed(() => partValue.value?.modalities || []);

const returnableText = computed(() => {
  if (manufacturerName.value === 'NXT Power') return null;
  const r = partValue.value?.returnable;
  if (r === null || typeof r === 'undefined') return null;
  return r ? 'Yes' : 'No';
});

// Gallery state
const currentIndex = ref(0);
function goTo(idx) {
  currentIndex.value = idx;
}
function onSelect(idx) {
  currentIndex.value = idx;
}

// Quote URL
const quoteUrl = computed(() => {
  const num = partNumber.value;
  if (manufacturerName.value === 'NXT Power') {
    return `https://www.multi-inc.com/request-a-quote-pqs?part_numbers=${encodeURIComponent(num)}&manufacturer=NXT+Power`;
  }
  return `https://www.multi-inc.com/request-a-quote-parts?part_numbers=${encodeURIComponent(num)}&manufacturer=${encodeURIComponent(manufacturerName.value)}`;
});

function goBack() {
  navigateTo('/parts');
}

// SEO
const metaTitle = computed(() => {
  if (!partValue.value) return 'Part Not Found';
  const m = manufacturerName.value;
  const num = partNumber.value;
  const title = safeTitle.value;
  return `${num}${m ? ' - ' + m : ''} - ${title}`;
});

const metaDescription = computed(() => {
  if (!partValue.value) return 'Part not found.';
  const m = manufacturerName.value;
  const num = partNumber.value;
  const title = safeTitle.value;
  return `${num}${m ? ' by ' + m : ''} -- ${title} -- High-quality parts for Healthcare Technology Management.`;
});

const defaultImageUrl = computed(() => {
  const img = images.value?.[0];
  return img?.src || fallbackImageUrl.value;
});

useHead(() => ({
  title: metaTitle.value,
  meta: [
    { name: 'description', content: metaDescription.value },
    { property: 'og:title', content: metaTitle.value },
    { property: 'og:description', content: metaDescription.value },
    { property: 'og:image', content: defaultImageUrl.value },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: metaTitle.value },
    { name: 'twitter:description', content: metaDescription.value },
    { name: 'twitter:image', content: defaultImageUrl.value },
    { name: 'robots', content: 'index, follow' }
  ],
  // canonical is set via useCanonical composable below
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: safeTitle.value,
        image: defaultImageUrl.value,
        description: metaDescription.value,
        sku: partValue.value?.part_number || '',
        brand: {
          '@type': 'Brand',
          name: manufacturerName.value || 'Unknown Manufacturer'
        },
        offers: {
          '@type': 'Offer',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: '0',
            priceCurrency: 'USD',
            valueAddedTaxIncluded: 'false',
            description: 'Call for pricing'
          },
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'MULTI, INC.',
            url: 'https://multi-inc.com'
          }
        }
      })
    }
  ]
}));

// Canonical via runtime-config siteUrl + route.path
const { setCanonicalHead } = useCanonical([]);
setCanonicalHead();

// BreadcrumbList JSON-LD
const siteUrl = (runtimeConfig.public?.siteUrl || 'https://parts.multi-inc.com').replace(/\/$/, '');
useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl + '/' },
    { '@type': 'ListItem', position: 2, name: 'Parts', item: siteUrl + '/parts' },
    { '@type': 'ListItem', position: 3, name: manufacturerName.value || 'Manufacturer', item: siteUrl + `/parts/manufacturer/${manufacturer_slug}` },
    { '@type': 'ListItem', position: 4, name: partNumber.value || 'Part', item: siteUrl + route.fullPath }
  ]
});
</script>

<style scoped>
ul {
    padding: 0;
    li {
      margin-left: 0;
    }
  }
  h1 {
    color: #304d6d;
    font-size: 38px;
    line-height: 40px;
    font-weight: 400;
    margin-bottom: 10px;
  }
  h2 {
    color: #304d6d;
    font-size: 32px;
    line-height: 36px;
    font-weight: 400;
    margin-bottom: 20px;
  }
  h3 {
    color: #304d6d;
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 20px;
    font-weight: 400;
  }
  .meta-value {
    color: #2275b5;
  }
  .modality {
    &:after {
      content: ', ';
    }
    &:last-of-type {
      &::after {
        content: '';
      }
    }
  }
  hr,
  .product-content:deep(hr) {
    border: none;
    border-bottom: solid 2px #dedede;
    margin: 25px 0;
    &.alt {
      border-bottom: solid 4px #dedede;
      margin-bottom: 15px;
    }
  }
  
  a.request-quote {
    margin: 0!important;
  }
  
  .other-attributes {
    .attributes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      @media screen and (max-width: 600px) {
        grid-template-columns: auto;
      }
      .attribute {
        background-color: #f2f2f2;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        h4 {
          margin: 0;
          padding-top: 20px;
          font-weight: bold;
        }
      }
    }
  }
  
  .product-content:deep(h3) {
    font-weight: 400;
    font-size: 33px;
    color: #304d6d;
    line-height: 36px;
  }
  
  .product-content:deep(*) {
    line-height: 32px;
    font-size: 18px;
  }
  
  .product-content:deep(ul) {
    padding-left: 25px;
    list-style: disc;
  }
  
  .title {
    text-transform: uppercase;
  }
  
  .button {
      border-radius: 50px;
      padding: 10px 15px;
      color: #fff;
      white-space: nowrap;
      transition: all .3s ease;
      &.go-back {
        background-color: #2275b5;
        border: solid 2px #2275b5;
        &:hover {
          color: #2275b5;
          background-color: #fff;
        }
      }
      &.request-quote {
        background-color: #dc602e;
        margin-bottom: 10px;
        display: inline-block;
        &:hover {
          background-color: #2275b5;
        }
      }
  }
</style>
