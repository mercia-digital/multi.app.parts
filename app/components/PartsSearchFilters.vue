<template>
  <div id="search-filters" class="p-6 mb-6 rounded-lg gap-4">
    <div class="search relative">
      <input 
        type="text" 
        v-model="localSearchTerm" 
        @keyup.enter="submitSearch" 
        placeholder="Search by Keyword"
        class="px-4 py-2 w-full rounded-full pr-10" 
      />
      <button
        v-if="localSearchTerm && localSearchTerm !== ''"
        type="button"
        @click="clearSearch"
        aria-label="Clear search"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        <i class="fa-sharp fa-xmark"></i>
      </button>
    </div>
    <div class="grid grid-cols-12 gap-4 mt-4">
      <div class="col-span-12 md:col-span-4 lg:col-span-5">
        <DropDown 
          @option-selected="selectManufacturer" 
          :selected-value="manufacturer"
          collection="manufacturers" 
          placeholder="Filter by Manufacturer"
        />
      </div>
      <div class="col-span-12 md:col-span-4 lg:col-span-5">
        <DropDown 
          @option-selected="selectModality" 
          :selected-value="modality"
          collection="modalities" 
          placeholder="Filter by Modality"
        />
      </div>
      <div class="col-span-12 md:col-span-4 lg:col-span-2 flex items-stretch">
        <button type="button" @click="submitSearch" class="button w-full">Search</button>
      </div>
    </div>
  </div>
 </template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  search: { type: String, default: '' },
  manufacturer: { type: String, default: '' },
  modality: { type: String, default: '' }
});

const emit = defineEmits(['update:search', 'update:manufacturer', 'update:modality', 'submit']);

const localSearchTerm = ref(props.search || '');
const manufacturer = ref(props.manufacturer || '');
const modality = ref(props.modality || '');


watch(() => props.search, (v) => {
  localSearchTerm.value = v || '';
});

function submitSearch() {
  emit('submit', {
    search: localSearchTerm.value || '',
    manufacturer: manufacturer.value || '',
    modality: modality.value || ''
  });
}


function clearSearch() {
  localSearchTerm.value = '';
  emit('update:search', '');
}

function selectManufacturer(option) {
  manufacturer.value = option.slug || '';
  emit('update:manufacturer', manufacturer.value);
}

function selectModality(option) {
  modality.value = option.slug || '';
  emit('update:modality', modality.value);
}
</script>

<style lang="less" scoped>
.button {
  display: inline-block;
  width: 100%;
  text-align: center;
  background-color: #dc602e;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    background-color: #dc602e;
  }
}

#search-filters {
  background-color: #e0e4e9;
  max-width: 900px;
  margin: 0 auto;

  input {
    background-color: #fff;
  }
}
</style> 