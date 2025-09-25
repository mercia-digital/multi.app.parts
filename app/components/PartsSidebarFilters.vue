<template>
  <aside id="sidebar-filters" class="p-6 rounded-lg">
    <div class="search">
      <input
        type="text"
        v-model="searchTerm"
        @keyup.enter="search"
        placeholder="Search by Keyword"
        class="px-4 py-2 w-full rounded-full"
      />
    </div>

    <div class="actions clear-search-wrapper flex flex-col gap-4 mb-4">
      <a @click="search" class="button">Search</a>
      <a href="/parts" class="button alt">Clear Filters</a>
    </div>

    <div class="filter mb-4">
      <DropDown
        @option-selected="selectManufacturer"
        ref="manufacturerDD"
        :selected-value="manufacturer"
        collection="manufacturers"
        placeholder="Filter by Manufacturer"
      ></DropDown>
    </div>

    <div class="filter mb-4">
      <DropDown
        @option-selected="selectModality"
        ref="modalityDD"
        :selected-value="modality"
        collection="modalities"
        placeholder="Filter by Modality"
      ></DropDown>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  initialSearchTerm: {
    type: String,
    default: ''
  },
  initialManufacturer: {
    type: String,
    default: ''
  },
  initialModality: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['search', 'clear']);

const route = useRoute();

const searchTerm = ref(props.initialSearchTerm);
const manufacturer = ref(props.initialManufacturer);
const modality = ref(props.initialModality);

const manufacturerDD = ref(null);
const modalityDD = ref(null);

// Search function that emits the search event
const search = () => {
  emit('search', {
    term: searchTerm.value,
    manufacturer: manufacturer.value,
    modality: modality.value
  });
};

// Clear all filters
const clearFilters = () => {
  searchTerm.value = '';
  manufacturer.value = '';
  modality.value = '';

  if (manufacturerDD.value) {
    manufacturerDD.value.clearFilters();
  }

  if (modalityDD.value) {
    modalityDD.value.clearFilters();
  }

  emit('clear');
};

// Select manufacturer from dropdown
const selectManufacturer = (option) => {
  manufacturer.value = option.slug;
  search();
};

// Select modality from dropdown
const selectModality = (option) => {
  modality.value = option.slug;
  search();
};

// Watch for changes in the route query to update the component state
watch(() => route.query, (newQuery) => {
  if (newQuery.term !== undefined && newQuery.term !== searchTerm.value) {
    searchTerm.value = newQuery.term;
  }

  if (newQuery.manufacturer !== undefined && newQuery.manufacturer !== manufacturer.value) {
    manufacturer.value = newQuery.manufacturer;
  }

  if (newQuery.modality !== undefined && newQuery.modality !== modality.value) {
    modality.value = newQuery.modality;
  }
}, { deep: true });

// Expose methods to parent components
defineExpose({
  clearFilters,
  search,
  getFilters: () => ({
    term: searchTerm.value,
    manufacturer: manufacturer.value,
    modality: modality.value
  })
});
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
  &.alt {
    background-color: #304d6d;
  }
  &:hover {
    opacity: 0.9;
  }
}

#sidebar-filters {
  background-color: #e0e4e9;
  max-width: 300px;
  width: 100%;
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
