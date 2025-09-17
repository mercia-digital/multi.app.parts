<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
        <NuxtLink :to="crumb.path" :class="{ 'active': index === breadcrumbs.length - 1 }">
          {{ crumb.name }}
        </NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { useBreadcrumbs } from '~/composables/useBreadcrumbs';

const { data: breadcrumbs } = await useBreadcrumbs();
</script>

<style scoped>
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  list-style: none;
  background-color: #e9ecef;
  border-radius: 0.25rem;
}

.breadcrumb-item + .breadcrumb-item::before {
  display: inline-block;
  padding-right: 0.5rem;
  color: #6c757d;
  content: ">";
}

.breadcrumb-item a {
  color: #007bff;
  text-decoration: none;
  padding-right: 0.5rem;
}

.breadcrumb-item a.active {
  color: #6c757d;
  pointer-events: none;
}
</style>