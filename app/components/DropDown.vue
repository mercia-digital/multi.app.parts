<template>
    <div class="dropdown">
        <div class="arrow">
            <i class="fa-sharp fa-chevron-down"></i>
        </div>
        <button
            v-if="selectedOption"
            type="button"
            class="clear text-gray-500 hover:text-gray-700"
            aria-label="Clear selection"
            @click="closeAndClear"
        >
            <i class="fa-sharp fa-xmark"></i>
        </button>
        <div class="close-big" v-if="showOptions" @click="showOptions = false">
        </div>
        <input :id="collection + '-dropdown'" type="text" v-model="searchTerm" @focus="showOptions = true" @input="updateFilteredOptions" class="input px-4 py-2 pr-12 rounded-full" :placeholder="placeholder" />
        <div :class="{ active: showOptions }" class="options rounded shadow">
            <div v-for="option in filteredOptions" :key="option.id" class="option" v-html="highlightMatches(option.name)" @click="selectOption(option)"></div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
//import { useCollectionService } from '~/services/collectionService';

const props = defineProps({
    collection: String,
    placeholder: String,
    selectedValue: String
});

const emit = defineEmits(['option-selected']);

const searchTerm = ref(props.selectedValue || '');
const showOptions = ref(false);
const options = ref([]);
const selectedOption = ref(null);
const filteredOptions = ref([]);

// Function to update filteredOptions based on options and searchTerm
const updateFilteredOptions = () => {
    filteredOptions.value = options.value.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
};

// Watch options and searchTerm to update filteredOptions
watch([options, searchTerm], updateFilteredOptions, { immediate: true });

function selectOption(option) {
    selectedOption.value = option;
    searchTerm.value = option.name;
    showOptions.value = false;
    emit('option-selected', option);
}

function closeAndClear() {
    selectedOption.value = null;
    searchTerm.value = '';
    emit('option-selected', { name: '', slug: '' });
}

defineExpose({
  clearFilters() {
    selectedOption.value = null;
    searchTerm.value = '';

    emit('option-selected', { name: '', slug: '' });
  }
});

function highlightMatches(text) {
    if (!searchTerm.value) return text; // Return unmodified text if searchTerm is empty
    const matchRegex = new RegExp(searchTerm.value, 'gi');
    return text.replace(matchRegex, (match) => `<strong>${match}</strong>`);
}

// Keep dropdown open/close behavior consistent
watch(showOptions, (newValue) => {
    if (!newValue) return;
    const handler = (e) => {
        if (!e.target.closest('.dropdown')) {
            showOptions.value = false;
            window.removeEventListener('click', handler);
        }
    };
    window.addEventListener('click', handler);
});

// Sync input and selection from incoming selectedValue (slug or name) whenever
// props.selectedValue or options change (e.g., after async fetch)
function syncFromProp() {
    const val = props.selectedValue || '';
    if (!val) {
        selectedOption.value = null;
        searchTerm.value = '';
        return;
    }
    const found = options.value.find(o => o.slug === val || o.name === val);
    if (found) {
        selectedOption.value = found;
        searchTerm.value = found.name;
    } else {
        selectedOption.value = null;
        // do not show slug in the input; keep empty until user opens/selects
        searchTerm.value = '';
    }
}
watch([() => props.selectedValue, options], syncFromProp, { immediate: true });

onMounted(async () => {
    try {
        const response = await fetch(`/api/data/get-collection?collection=${props.collection}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        // Exclude the synthetic 'other' manufacturer from options
        if (props.collection === 'manufacturers') {
            options.value = (json || []).filter(o => o?.slug !== 'other');
        } else {
            options.value = json || [];
        }
        // ensure initial sync when options arrive
        syncFromProp();
    } catch (error) {
        console.error("Error fetching collection:", error);
    }
});
</script>

<style lang="less" scoped>
.dropdown {
    position: relative;
    .arrow {
        pointer-events: none;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
    }
    .clear {
        cursor: pointer;
        position: absolute;
        right: 40px;
        top: 50%;
        font-size: 16px;
        transform: translateY(-50%);
        z-index: 1;
    }
    .close-big {
        background-color: #fff;
        opacity: .3;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
}

.input {
    width: 100%;
    background-color: #fff;
}

.options {
    position: absolute;
    width: 100%;
    background-color: #fff;
    max-height: 320px;
    overflow-y: auto;
    z-index: 10;

    pointer-events: none;

    transition: all .3s ease;
    opacity: 0;
    top: calc(~"100% - 10px");
    &.active {
        opacity: 1;
        top: calc(~"100% + 10px");
        pointer-events: all;
    }
}

.option {
    padding: 8px;
    cursor: pointer;
}

.option:hover,
.option:active {
    background-color: #f0f0f0;
}
</style>