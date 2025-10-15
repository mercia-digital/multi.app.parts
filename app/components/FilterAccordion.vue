<template>
  <div class="filter-accordion">
    <button class="accordion-header" @click="toggle">
      <span class="header-text">{{ selectedOption ? selectedOption.name : placeholder }}</span>
      <span class="icons">
        <button
          v-if="selectedOption"
          type="button"
          class="clear-btn"
          aria-label="Clear selection"
          @click.stop="clearSelection"
        >
          <i class="fa-sharp fa-xmark"></i>
        </button>
        <i :class="['fa-sharp', isOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
      </span>
    </button>

    <transition name="accordion">
      <div v-show="isOpen" class="accordion-panel">
        <div v-if="showSearch" class="panel-search">
          <input
            type="text"
            v-model="localSearch"
            class="px-3 py-2 w-full rounded"
            :placeholder="`Search ${placeholder.toLowerCase()}`"
          />
        </div>
        <div class="options">
          <button
            v-for="option in filteredOptions"
            :key="option.id"
            class="option"
            @click="select(option)"
          >
            <span v-html="highlightMatches(option.name)"></span>
          </button>
          <div v-if="filteredOptions.length === 0" class="no-results">
            No results
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';

const props = defineProps({
  collection: { type: String, required: true },
  placeholder: { type: String, default: 'Filter' },
  selectedValue: { type: String, default: '' }
});

const emit = defineEmits(['option-selected']);

const isOpen = ref(false);
const options = ref([]);
const localSearch = ref('');
const selectedOption = ref(null);

const showSearch = computed(() => options.value.length > 15);

const filteredOptions = computed(() => {
  const q = localSearch.value.trim().toLowerCase();
  if (!q) return options.value;
  return options.value.filter(o => o.name.toLowerCase().includes(q));
});

function toggle() {
  isOpen.value = !isOpen.value;
}

function select(option) {
  selectedOption.value = option;
  emit('option-selected', option);
  isOpen.value = false;
}

function clearSelection() {
  selectedOption.value = null;
  emit('option-selected', { name: '', slug: '' });
}

function highlightMatches(text) {
  if (!localSearch.value) return text;
  const matchRegex = new RegExp(localSearch.value, 'gi');
  return text.replace(matchRegex, (m) => `<strong>${m}</strong>`);
}

watch(() => props.selectedValue, (newVal) => {
  if (!newVal) {
    selectedOption.value = null;
    return;
  }
  const found = options.value.find(o => o.slug === newVal || o.name === newVal);
  if (found) selectedOption.value = found;
});

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

    // initialize selection from selectedValue
    if (props.selectedValue) {
      const found = options.value.find(o => o.slug === props.selectedValue || o.name === props.selectedValue);
      if (found) selectedOption.value = found;
    }
  } catch (e) {
    console.error('Error fetching collection:', e);
  }
});
</script>

<style scoped lang="less">
.filter-accordion {
  margin-bottom: 1rem;
}

.accordion-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  font-weight: 600;
  color: #1f2d3d;
  border: 1px solid #d9e1e8;
  transition: background-color .2s ease;
}

.header-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icons {
  display: inline-flex;
  gap: 10px;
  align-items: center;
}

.clear-btn {
  background: transparent;
  border: none;
  color: #9aa8b2;
  cursor: pointer;
}
.clear-btn:hover {
  color: #dc602e;
}

.accordion-header:hover {
  background-color: #f6f8fa;
}


.accordion-panel {
  margin-top: 10px;
  background: #fff;
  border: 1px solid #d9e1e8;
  border-radius: 8px;
  overflow: hidden;
}

.panel-search {
  padding: 8px;
  border-bottom: 1px solid #eef2f6;
}

.options {
  max-height: 320px;
  overflow: auto;
}

.option {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #f3f6f9;
  cursor: pointer;
}

.option:hover {
  background-color: #f6f8fa;
}

.no-results {
  padding: 12px;
  color: #666;
  text-align: center;
}

.accordion-enter-active, .accordion-leave-active {
  transition: all .2s ease;
}
.accordion-enter-from, .accordion-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
