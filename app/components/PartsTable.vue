<template>
    <div>
        <!-- Responsive Grid -->
        <div class="mb-4">
            <!-- Header for larger screens -->
            <!-- <div class="hidden md:grid md:grid-cols-5 gap-4 font-bold p-2 border-b text-center">
                <div>Image</div>
                <div>Part Number</div>
                <div>Title</div>
                <div>Manufacturer</div>
                <div>Actions</div>
            </div> -->

            <!-- Parts List -->
            <div v-for="part in parts" :key="part.id" class="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center border-b border-gray-300 p-4">   
                <!-- Image -->
                <div class="flex justify-center">
                    <img v-if="part.primary_image" :src="`${runtimeConfig.public.directus.url}/assets/${part.primary_image.id}?fit=inside&width=360`" :alt="`Image of ${part.part_number}${(part.manufacturer?.name && part.manufacturer?.slug !== 'other') ? ' from ' + part.manufacturer.name : ''}`">
                    <img v-else :src="`${runtimeConfig.public.directus.url}/assets/${appSettings.default_image}?fit=inside&width=360`" alt="MULTI, INC.">
                </div>

                <div class="part-meta col-span-2">
                    <h4 class="text-2xl font-bold pb-2">
                        {{ part.part_number }}
                        <template v-if="part.manufacturer?.name && part.manufacturer?.slug !== 'other'"> - <span class="">{{ part.manufacturer.name }}</span></template>
                    </h4>
                    <p class="uppercase text-xl">{{ decodeHtmlEntities(part.title) }}</p>
                </div>

                <!-- Part Number -->
                <!-- <div class="flex justify-between md:justify-center">
                    <span class="font-bold md:hidden">Part Number:</span>
                    <span>{{ part.part_number }}</span>
                </div> -->

                <!-- Title -->
                <!-- <div class="flex justify-between md:justify-center">
                    <span class="font-bold md:hidden">Title:</span>
                    <span>{{ decodeHtmlEntities(part.title) }}</span>
                </div> -->

                <!-- Manufacturer -->
                <!-- <div class="flex justify-between md:justify-center">
                    <span class="font-bold md:hidden">Manufacturer:</span>
                    <span>{{ part.manufacturer.name }}</span>
                </div> -->

                <!-- Actions -->
                <div class="flex justify-center gap-2 flex-wrap">
                    <NuxtLink v-if="part.manufacturer?.slug" :to="`/part/${part.manufacturer.slug}/${part.slug}`" class="text-white bg-[#dc602e] px-4 py-2 rounded-full hover:bg-[#dc602e]/75 transition-colors">View Details</NuxtLink>
                    <NuxtLink v-else :to="{ path: '/parts', query: { search: part.part_number } }" class="text-white bg-[#dc602e] px-4 py-2 rounded-full hover:bg-[#dc602e]/75 transition-colors">View Details</NuxtLink>
                    <a v-if="part.manufacturer?.name !== 'NXT Power'" :href="`https://www.multi-inc.com/request-a-quote-parts?part_numbers=${part.part_number}`" target="_blank" class="text-white bg-[#2275b5] px-4 py-2 rounded-full hover:bg-[#2275b5]/75 transition-colors">Request a Quote</a>
                    <a v-else :href="`https://www.multi-inc.com/request-a-quote-pqs?part_numbers=${part.part_number}&manufacturer=NXT+Power`" target="_blank" class="text-white bg-[#2275b5] px-4 py-2 rounded-full hover:bg-[#2275b5]/75 transition-colors">Request a Quote</a>
                </div>
            </div>
        </div>
        <div v-if="!hasParts" class="py-16 text-center text-gray-600">
            <p class="text-xl font-medium mb-2">No products found</p>
            <p class="text-sm">Try adjusting your filters or search terms.</p>
        </div>
        
        <!-- Pagination -->
        <div v-if="hasParts" class="mb-4 flex justify-center">
            <UPagination
                v-model:page="currentPage"
                active-color="secondary"
                show-edges
                :sibling-count="siblingCount"
                :size="paginationSize"
                :total="totalPages"
                :per-page="perPage"
                @update:page="onPageChange"
            />
        </div>

        <!-- Parts per page selection -->
        <div v-if="hasParts" class="flex justify-end">
            <USelect v-model="perPage" :items="perPageOptions" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import he from 'he';

const emit = defineEmits(['update:currentPage', 'update:perPage']);

const props = defineProps({
    parts: {},
    meta: {},
    currentPage: Number,
    perPage: Number
});

const currentPage = ref(props.currentPage);
const perPage = ref(props.perPage);

// Whether there are any parts to display
const hasParts = computed(() => Array.isArray(props.parts) && props.parts.length > 0);

// Smooth scroll to the top of the page
const scrollToTop = () => {
    if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Handle page change from pagination
const onPageChange = (page) => {
    emit('update:currentPage', page);
    scrollToTop();
};

watch(() => perPage.value, () => {
    // Reset to page 1 when per-page changes
    if (currentPage.value !== 1) {
        currentPage.value = 1;
        emit('update:currentPage', 1);
    }
    emit('update:perPage', perPage.value);
    scrollToTop();
});

const runtimeConfig = useRuntimeConfig();

// Responsive pagination controls
let mediaQueryList;
let mediaQueryHandler;
const isMobile = ref(false);

onMounted(() => {
    if (typeof window !== 'undefined') {
        const mql = window.matchMedia('(max-width: 640px)'); // Tailwind 'sm' breakpoint
        const handler = (e) => {
            isMobile.value = e.matches;
        };
        isMobile.value = mql.matches;
        if (mql.addEventListener) mql.addEventListener('change', handler);
        else mql.addListener(handler);
        mediaQueryList = mql;
        mediaQueryHandler = handler;
    }
});

onBeforeUnmount(() => {
    if (mediaQueryList && mediaQueryHandler) {
        if (mediaQueryList.removeEventListener) mediaQueryList.removeEventListener('change', mediaQueryHandler);
        else mediaQueryList.removeListener(mediaQueryHandler);
    }
});

const siblingCount = computed(() => (isMobile.value ? 0 : 1));
const paginationSize = computed(() => (isMobile.value ? 'sm' : 'md'));

const perPageOptions = ref([
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
]);

const { data: appSettings } = await useAppSettings();

const totalPages = computed(() => {
    if (!props.meta || !props.meta.filter_count) return 1;
    return Math.ceil(props.meta.filter_count / perPage.value);
});

// Scroll to top when results or total change (e.g., filter/search updates)
watch(
    () => [props.parts, props.meta?.filter_count],
    () => {
        scrollToTop();
    }
);

// Keep local state in sync with incoming props
watch(() => props.currentPage, (val) => {
    if (typeof val === 'number') {
        currentPage.value = val;
        scrollToTop();
    } else {
        currentPage.value = 1;
    }
});

watch(() => props.perPage, (val) => {
    if (typeof val === 'number') {
        perPage.value = val;
    }
});

const decodeHtmlEntities = (text) => {
    return he.decode(text);
};
</script>
