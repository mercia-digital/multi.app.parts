<template>
    <div>
        <!-- Responsive Grid -->
        <div class="container mx-auto mb-4">
            <!-- Header for larger screens -->
            <div class="hidden md:grid md:grid-cols-7 gap-4 font-bold p-2 border-b text-center">
                <div>Image</div>
                <div>Part Number</div>
                <div>Title</div>
                <div>Manufacturer</div>
                <div>List Price</div>
                <div>Your Price</div>
                <div>Actions</div>
            </div>

            <!-- Parts List -->
            <div v-for="part in parts" :key="part.id" class="grid grid-cols-1 md:grid-cols-7 gap-4 items-center border-b p-2 text-center">
                <!-- Image -->
                <div class="flex justify-center">
                    <img v-if="part.primary_image" :src="`${runtimeConfig.public.directus.url}/assets/${part.primary_image.id}?fit=inside&width=360`" :alt="'Image of ' + part.part_number + ' from ' + part.manufacturer.name" class="w-72 h-72 md:w-24 md:h-24 object-contain">
                    <img v-else :src="`${runtimeConfig.public.directus.url}/assets/${appSettings.default_image}?fit=inside&width=360`" alt="MULTI, INC." class="w-72 h-72 md:w-24 md:h-24 object-contain">
                </div>

                <!-- Part Number -->
                <div class="flex justify-between md:justify-center">
                    <span class="font-bold md:hidden">Part Number:</span>
                    <span>{{ part.part_number }}</span>
                </div>

                <!-- Title -->
                <div class="flex justify-between md:justify-center">
                    <span class="font-bold md:hidden">Title:</span>
                    <span>{{ decodeHtmlEntities(part.title) }}</span>
                </div>

                <!-- Manufacturer -->
                <div class="flex justify-between md:justify-center">
                    <span class="font-bold md:hidden">Manufacturer:</span>
                    <span>{{ part.manufacturer.name }}</span>
                </div>

                <!-- List Price -->
                <div class="flex justify-between md:justify-center">
                    <span class="font-bold md:hidden">List Price:</span>
                    <span>{{ formatCurrency(part.list_price) }}</span>
                </div>

                <!-- Your Price -->
                <div class="flex justify-between md:justify-center">
                    <span class="font-bold md:hidden">Your Price:</span>
                    <span>{{ formatCurrency(part.your_price) }}</span>
                </div>

                <!-- Actions -->
                <div class="flex justify-between md:justify-center">
                     <span class="font-bold md:hidden">Actions:</span>
                    <NuxtLink :to="`/part/${part.manufacturer.slug}/${part.slug}`" class="text-blue-500 hover:underline">View Details</NuxtLink>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div class="mb-4">
            <UPagination v-model:page="currentPage" active-color="secondary" show-edges :sibling-count="1" :total="totalPages" :per-page="perPage" @update:page="emit('update:currentPage', $event)"/>
        </div>

        <!-- Parts per page selection -->
        <div>
            <USelect v-model="perPage" :items="perPageOptions" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
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

watch(() => perPage.value, () => {
    emit('update:perPage', perPage.value);
});

const runtimeConfig = useRuntimeConfig();

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

const formatCurrency = (value) => {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
};

const decodeHtmlEntities = (text) => {
    return he.decode(text);
};
</script>
