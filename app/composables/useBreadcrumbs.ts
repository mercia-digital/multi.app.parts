import { useRoute } from 'vue-router';
import { useManufacturer } from '~/composables/useManufacturers';
import { useModality } from '~/composables/useModalities';

interface Breadcrumb {
  name: string;
  path: string;
}

export const useBreadcrumbs = () => {
  const route = useRoute();

  return useAsyncData('breadcrumbs-' + route.path, async () => {
    const crumbs: Breadcrumb[] = [{ name: 'Home', path: '/' }];
    const addCrumb = (name: string, path: string) => crumbs.push({ name, path });

    const pathSegments = route.path.split('/').filter(p => p);

    if (pathSegments[0] === 'profile') {
      addCrumb('Profile', '/profile');
    } else if (pathSegments[0] === 'parts' || pathSegments[0] === 'part') {
      addCrumb('Parts', '/parts');
    }

    // /parts/manufacturer/[slug]
    if (pathSegments[0] === 'parts' && pathSegments[1] === 'manufacturer' && pathSegments[2]) {
      const { data: manufacturer } = await useManufacturer(pathSegments[2]);
      if (manufacturer.value) {
        addCrumb(manufacturer.value?.name, route.path);
      }
    }
    // /parts/modality/[slug]
    else if (pathSegments[0] === 'parts' && pathSegments[1] === 'modality' && pathSegments[2]) {
      const { data: modality } = await useModality(pathSegments[2]);
      if (modality.value) {
        addCrumb(modality.value?.name, route.path);
      }
    }
    // /part/[manufacturer-slug]/[part-number]
    else if (pathSegments[0] === 'part' && pathSegments[1] && pathSegments[2]) {
      const manufacturerSlug = pathSegments[1];
      const partNumber = pathSegments[2];
      const { data: manufacturer } = await useManufacturer(manufacturerSlug);
      if (manufacturer.value) {
        addCrumb(manufacturer.value?.name, `/parts/manufacturer/${manufacturerSlug}`);
      }
      addCrumb(partNumber, route.path);
    }

    return crumbs;
  }, { watch: [() => route.path] });
};
