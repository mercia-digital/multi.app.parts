<template>
  <aside id="sidebar-filters" class="p-6 rounded-lg">
    <div v-if="(manufacturer && manufacturer !== '') || (modality && modality !== '') || (localSearchTerm && localSearchTerm !== '')" class="actions text-right mb-4">
      <button @click="onClear" class="text-[#2275b5] hover:text-[#dc602e] transition-all duration-300"><i class="fa-sharp fa-xmark"></i>Clear Filters</button>
    </div>
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
    <div class="filter mb-4">
      <FilterAccordion
        @option-selected="selectManufacturer"
        :selected-value="manufacturer"
        collection="manufacturers"
        placeholder="Manufacturer"
      />
    </div>
    <div class="filter mb-4">
      <FilterAccordion
        @option-selected="selectModality"
        :selected-value="modality"
        collection="modalities"
        placeholder="Modality"
      />
    </div>
    <div class="actions clear-search-wrapper flex flex-col gap-4 mb-4">
      <button type="button" @click="submitSearch" class="button">Search</button>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  search: { type: String, default: '' },
  manufacturer: { type: String, default: '' },
  modality: { type: String, default: '' }
});

const emit = defineEmits(['update:search', 'update:manufacturer', 'update:modality', 'submit', 'clear']);

const localSearchTerm = ref(props.search || '');

watch(() => props.search, (v) => {
  // keep local input in sync with parent when route changes externally
  localSearchTerm.value = v || '';
});

function submitSearch() {
  // keep parent route in sync via submit payload; also emit update:search for consumers who bind v-model:search
  emit('update:search', localSearchTerm.value || '');
  emit('submit', {
    search: localSearchTerm.value || '',
    manufacturer: props.manufacturer || '',
    modality: props.modality || ''
  });
}

function onClear() {
  emit('clear');
}

// Clear only the search term and immediately submit updated filters
function clearSearch() {
  localSearchTerm.value = '';
  emit('update:search', '');
  emit('submit', {
    search: '',
    manufacturer: props.manufacturer || '',
    modality: props.modality || ''
  });
}

// Select manufacturer from accordion
function selectManufacturer(option) {
  emit('update:manufacturer', option.slug || '');
}

// Select modality from accordion
function selectModality(option) {
  emit('update:modality', option.slug || '');
}
</script>

<style lang="less" scoped>
.button {
  display: inline-block;
  width: 100%;
  text-align: center;
  background-color: #2275b5;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  &.alt {
    background-color: #304d6d;
  }
  &:hover {
    opacity: 0.7;
  }
}

#sidebar-filters {
  background-color: #e0e4e9;
  width: 100%;
  min-width: 320px;
  position: sticky;
  top: 1rem;

  .search {
    margin-bottom: 1rem;

    input {
      background-color: #fff;
    }
  }

  .filter {
    margin-bottom: 1rem;
  }
}
</style>
