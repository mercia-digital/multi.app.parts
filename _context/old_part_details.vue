<template>
    <div class="container mx-auto p-4">
      <!-- Error state -->
      <div v-if="error" class="text-center">
        <h2 class="text-2xl font-bold text-red-600">Error Loading Part</h2>
        <p class="mt-4">{{ error.message || 'Unable to load part details. Please try again later.' }}</p>
        <button @click="goBack" class="button go-back mt-6">
          Back to List
        </button>
      </div>
      
      <!-- Part details -->
      <div v-else-if="partDetails">
        <!-- Breadcrumbs -->
        <Breadcrumbs :items="breadcrumbItems" class="mb-4" />
        
        <div class="text-right mb-10">
          <button @click="goBack" class="button go-back">
            Back to List
          </button>
        </div>
        <div class="flex flex-wrap">
          <div class="w-full p-2 text-left">
            <h1 class="text-2xl font-bold">{{ partTitle }}</h1>
            <hr class="alt">
          </div>
          <div class="w-full lg:w-1/2 p-2 text-left">        
            <h2 v-if="partDetails.manufacturer?.name">
              Manufacturer: <span class="meta-value">{{ partDetails.manufacturer?.name }}</span>
            </h2>
            <h2>Part Number: <span class="meta-value">{{ getPartNumber(partDetails) }}</span></h2>
            <h3 v-if="partDetails.modalities && partDetails.modalities.length">Modality: <span class="meta-value"><span v-for="mod in partDetails.modalities" class="modality">{{ mod.modalities_id.name }}</span></span></h3>
            <hr>
            <div>
              <ul>
                <li v-if="partDetails.condition"><h3>Condition: <span class="meta-value" style="text-transform: capitalize;">{{ partDetails.condition }}</span></h3></li>
                <li v-else><h3>Condition: <span class="meta-value">New</span></h3></li>
                <li v-if="partDetails.warranty"><h3>Warranty: <span class="meta-value">{{ partDetails.warranty }}</span></h3></li>
                <li v-if="returnableText !== null"><h3>Returnable: <span class="meta-value">{{ returnableText }}</span></h3></li>
                <li v-if="partDetails.manufacturer?.name !== 'NXT Power'"><h3>OEM Quality Assurance: <span class="meta-value">Passed</span></h3></li>
                <li v-if="partDetails.manufacturer?.name !== 'NXT Power'"><h3>Lead Times: <span class="meta-value">Most parts shipped from inventory on the same day.</span></h3></li>            
                <li v-if="partDetails.manufacturer?.name !== 'NXT Power'"><a :href="`https://www.multi-inc.com/request-a-quote-parts?part_numbers=${getPartNumber(partDetails)}&manufacturer=${partDetails.manufacturer?.name}`"
                target="_blank"
                class="button request-quote">
                Request a Quote
              </a></li>
                <li v-else><a :href="`https://www.multi-inc.com/request-a-quote-pqs?part_numbers=${getPartNumber(partDetails)}&manufacturer=NXT+Power`" target="_blank" class="button request-quote">Request a Quote</a></li>
              </ul>
            </div>
            <hr>        
            <div v-html="partContent" class="product-content"></div>
            <div class="other-attributes" v-if="partDetails.attributes && partDetails.attributes.length">
              <h3>Other Attributes</h3>
              <div class="attributes-grid">
                <div class="attribute" v-for="(item, index) in partDetails.attributes" :key="index">
                  <label>{{ item.name }}</label>
                  <h4>{{ item.value }}</h4>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full lg:w-1/2 p-2">
            <div class="gallery-wrapper">
              <div class="gallery-main">
                <img v-if="currentImage && currentImage.src" :src="currentImage.src" :alt="`Image of ${partTitle}`" />
                <div v-else class="no-image-placeholder">
                  <p>No image available</p>
                </div>
              </div>
              <div class="gallery-thumbs grid grid-cols-4 gap-2" v-if="partDetails.gallery && partDetails.gallery.length > 1">
                <img v-for="image in partDetails.gallery" 
                     :key="image.id" 
                     :src="image.src" 
                     :alt="`Image of ${partTitle}`" 
                     @click="updateCurrentSlide(image.id)"
                     class="w-full cursor-pointer border-2 border-[#2f4c6c] border-solid"/>
            </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No part found state -->
      <div v-else class="text-center">
        <h2 class="text-2xl font-bold">Part Not Found</h2>
        <p class="mt-4">The requested part could not be found.</p>
        <button @click="goBack" class="button go-back mt-6">
          Back to List
        </button>
      </div>
    </div>
  </template>
    
  <script setup>
  import { ref, computed } from 'vue'
  import { useRoute, navigateTo, useHead, useAsyncData } from '#imports'
  import { usePartsService } from '~/services/partsService'
  import { fixEncodingErrors } from '~/composables/fixEncodingErrors';
  // Optionally import UI components (e.g., Breadcrumbs) if they’re used in the template
  // import Breadcrumbs from '~/components/Breadcrumbs.vue'
  
  // --- Reactive References & Route Setup ---
  const partDetails = ref(null)
  const currentImage = ref(null)
  const error = ref(null)
  
  const route = useRoute()
  const partsService = usePartsService()
  
  // --- Helper Function ---
  const getPartNumber = (part) => {
    if (!part) return ''
    return part.display_part_number || part.part_number
  }
  
  // --- Computed Properties (Dependent on partDetails) ---
  const partTitle = computed(() => {
    return partDetails.value ? fixEncodingErrors(partDetails.value.title || '') : ''
  })
  
  const partContent = computed(() => {
    return partDetails.value && partDetails.value.content
      ? fixEncodingErrors(partDetails.value.content)
      : ''
  })
  
  const returnableText = computed(() => {
    if (partDetails.value?.manufacturer?.name === 'NXT Power') return null
    if (!partDetails.value) return null
    return partDetails.value.returnable === null
      ? null
      : partDetails.value.returnable
        ? 'Yes'
        : 'No'
  })
  
  const breadcrumbItems = computed(() => {
    if (!partDetails.value) return []
    
    // Safely extract manufacturer information
    let manufacturerName = 'Unknown Manufacturer'
    let manufacturerSlug = 'unknown'
    
    if (partDetails.value.manufacturer) {
      if (
        typeof partDetails.value.manufacturer === 'object' &&
        partDetails.value.manufacturer.name
      ) {
        manufacturerName = partDetails.value.manufacturer.name
      } else if (typeof partDetails.value.manufacturer === 'string') {
        manufacturerName = partDetails.value.manufacturer
      }
      manufacturerSlug = manufacturerName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }
    
    return [
      { name: 'Home', path: '/' },
      { name: 'Parts', path: '/parts' },
      { name: manufacturerName, path: `/manufacturer/${manufacturerSlug}` },
      {
        name: fixEncodingErrors(partDetails.value.title || 'Part Details'),
        path: `/part/${route.params.part_number}`
      }
    ]
  })
  
  // --- Data Fetching using useAsyncData with Transformation ---
  const { data: partData, error: partError } = await useAsyncData(
    `part-${route.params.part_number}`,
    () => partsService.fetchPartDetails(route.params.part_number),
    {
      default: () => null,
      key: `part-${route.params.part_number}`,
      transform: (data) => {
        if (!data) return null
        try {
          // Process primary image
          if (data.primary_image) {
            if (typeof data.primary_image === 'string') {
              data.primary_image = {
                id: data.primary_image,
                src: `https://order.multi-inc.com/assets/${data.primary_image}?fit=inside&width=600&height=600`,
                alt: data.title || 'Part Image'
              }
            } else if (data.primary_image.id) {
              data.primary_image = {
                id: data.primary_image.id,
                src: `https://order.multi-inc.com/assets/${data.primary_image.id}?fit=inside&width=600&height=600`,
                alt: data.primary_image.title || data.title || 'Part Image'
              }
            }
          }
          
          // Process gallery images
          if (data.gallery && Array.isArray(data.gallery) && data.gallery.length > 0) {
            data.gallery = data.gallery
              .map(img => {
                if (img && img.directus_files_id) {
                  // Handle both object and string ID forms
                  const id = typeof img.directus_files_id === 'object'
                    ? img.directus_files_id.id
                    : img.directus_files_id
                  return {
                    id: id,
                    src: `https://order.multi-inc.com/assets/${id}?fit=inside&width=600&height=600`,
                    alt: img.directus_files_id.title || data.title || 'Part Image'
                  }
                } else if (img && img.id) {
                  return {
                    id: img.id,
                    src: `https://order.multi-inc.com/assets/${img.id}?fit=inside&width=600&height=600`,
                    alt: img.title || data.title || 'Part Image'
                  }
                } else {
                  console.warn('Unexpected gallery image structure:', img)
                  return null
                }
              })
              .filter(Boolean) // Remove any null entries
            
            // Ensure primary image is included in the gallery if missing
            if (data.primary_image && data.primary_image.id) {
              const primaryImageExists = data.gallery.some(
                img => img.id === data.primary_image.id
              )
              if (!primaryImageExists) {
                data.gallery.unshift(data.primary_image)
              }
            }
          } else {
            // Create a gallery with the primary image if no gallery exists
            data.gallery = data.primary_image ? [data.primary_image] : []
          }
          
          // Safeguard additional fields
          data.modalities = data.modalities || []
          data.attributes = data.attributes || []
          
          // Normalize manufacturer structure
          if (data.manufacturer && typeof data.manufacturer === 'string') {
            data.manufacturer = { name: data.manufacturer }
          }
          
          return data
        } catch (err) {
          console.error('Error transforming part data:', err)
          return data // Return original data if transformation fails
        }
      }
    }
  )
  
  // --- Handle Errors and Assign Fetched Data ---
  if (partError.value) {
    error.value = partError.value
  } else if (partData.value) {
    partDetails.value = partData.value
    
    // Set the current image to the first image in the gallery (or to primary image)
    if (
      partDetails.value.gallery &&
      partDetails.value.gallery.length > 0
    ) {
      currentImage.value = partDetails.value.gallery[0]
    } else if (partDetails.value.primary_image) {
      currentImage.value = partDetails.value.primary_image
    }
  }
  
  // --- Compute Meta Values for SEO ---
  const metaTitle = computed(() => {
    if (!partDetails.value) return 'Part Not Found'
    const partNum = getPartNumber(partDetails.value)
    let manufacturer = ''
    if (partDetails.value.manufacturer) {
      manufacturer =
        typeof partDetails.value.manufacturer === 'object'
          ? partDetails.value.manufacturer.name || ''
          : partDetails.value.manufacturer
    }
    return `${partNum}${manufacturer ? ' - ' + manufacturer : ''} - ${partTitle.value}`
  })
  
  const metaDescription = computed(() => {
    if (!partDetails.value) return 'Part not found.'
    const partNum = getPartNumber(partDetails.value)
    let manufacturer = ''
    if (partDetails.value.manufacturer) {
      manufacturer =
        typeof partDetails.value.manufacturer === 'object'
          ? partDetails.value.manufacturer.name || ''
          : partDetails.value.manufacturer
    }
    return `${partNum}${manufacturer ? ' by ' + manufacturer : ''} -- ${partTitle.value} -- High-quality parts for Healthcare Technology Management.`
  })
  
  const defaultImageUrl = computed(() => {
    return partDetails.value && partDetails.value.primary_image
      ? partDetails.value.primary_image.src
      : ''
  })
  
  // --- SEO & Head Management (Unconditional) ---
  useHead({
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
    link: [
      {
        rel: 'canonical',
        href: `https://parts.multi-inc.com/part/${route.params.part_number}`
      }
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: partTitle.value,
          image: defaultImageUrl.value,
          description: metaDescription.value,
          sku: partDetails.value ? partDetails.value.part_number || '' : '',
          brand: {
            '@type': 'Brand',
            name:
              partDetails.value && partDetails.value.manufacturer
                ? typeof partDetails.value.manufacturer === 'object'
                  ? partDetails.value.manufacturer.name
                  : partDetails.value.manufacturer
                : 'Unknown Manufacturer'
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
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems.value.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `https://parts.multi-inc.com${item.path}`
          }))
        })
      }
    ]
  })
  
  // --- Navigation & Slide Update Helpers ---
  const goBack = () => {
    navigateTo('/parts')
  }
  
  const updateCurrentSlide = (imageId) => {
    if (!partDetails.value || !partDetails.value.gallery) return
    const image = partDetails.value.gallery.find(img => img && img.id === imageId)
    if (image && image.src) {
      currentImage.value = image
    }
  }
  </script>
  
  
  <style lang="less" scoped>
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
    font-weight: 500;
    margin-bottom: 10px;
  }
  h2 {
    color: #304d6d;
    font-size: 32px;
    line-height: 36px;
    font-weight: 500;
    margin-bottom: 20px;
  }
  h3 {
    color: #304d6d;
    font-size: 28px;
    line-height: 32px;
    margin-bottom: 20px;
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