<template>
  <div>
    <template v-for="(block, idx) in blocks" :key="block.id || idx">
      <p v-if="block.type === 'paragraph'" :class="paragraphClass(block)" v-html="block.data?.text || ''" class="max-w-[900px] mx-auto"></p>

      <component
        v-else-if="block.type === 'header'"
        :is="`h${block.data?.level || 2}`"
        v-html="block.data?.text || ''"
      />

      <ul v-else-if="block.type === 'list' && block.data?.style === 'unordered'">
        <li v-for="(item, i) in block.data?.items" :key="i" v-html="item"></li>
      </ul>

      <ol v-else-if="block.type === 'list' && block.data?.style === 'ordered'">
        <li v-for="(item, i) in block.data?.items" :key="i" v-html="item"></li>
      </ol>

      <blockquote v-else-if="block.type === 'quote'">
        <div v-html="block.data?.text || ''"></div>
        <cite v-if="block.data?.caption" v-html="block.data.caption"></cite>
      </blockquote>

      <hr v-else-if="block.type === 'delimiter'" />

      <div v-else-if="block.type === 'raw'" v-html="block.data?.html || ''"></div>

      <figure v-else-if="block.type === 'image'" class="mx-auto max-w-[640px]">
        <img :src="imageSrc(block)" :alt="block.data?.caption || block.data?.file?.name || 'Image'" class="max-w-full h-auto object-contain" />
        <figcaption v-if="block.data?.caption" class="text-sm text-gray-500 mt-2" v-html="block.data.caption"></figcaption>
      </figure>

      <pre v-else-if="block.type === 'code'"><code>{{ block.data?.code }}</code></pre>

      <!-- Unknown block types are ignored to avoid rendering raw JSON -->
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  content: { type: [Object, String], required: true },
});

const runtimeConfig = useRuntimeConfig();

function parseContent(content) {
  if (!content) return { blocks: [] };
  if (typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch (e) {
      console.warn('EditorBlocks: failed to parse content JSON');
      return { blocks: [] };
    }
  }
  return content;
}

const editor = computed(() => parseContent(props.content));
const blocks = computed(() => (Array.isArray(editor.value?.blocks) ? editor.value.blocks : []));

function paragraphClass(block) {
  const align = block?.tunes?.alignment?.alignment || block?.data?.alignment;
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  if (align === 'left') return 'text-left';
  return '';
}

function toFullUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = runtimeConfig.public.directus.url || '';
  return base.replace(/\/$/, '') + (url.startsWith('/') ? url : '/' + url);
}

function imageSrc(block) {
  const d = block?.data || {};
  const url = d.file?.url || d.file?.fileURL || d.url;
  let src = toFullUrl(url || '');
  if (src.includes('/assets/')) {
    const hasQuery = src.includes('?');
    src = src + (hasQuery ? '&' : '?') + 'fit=inside&width=1200';
  }
  return src;
}
</script>

<style lang="less">
/* Minimal styling hooks if needed */
.sections {
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 64px;
    .section {
        display: flex;
        gap: 32px;
        align-items: center;
        padding: 32px 10px;
        .content {
            flex: 1;
            order: 1;
            .title {
                color: #2275b5;
                font-size: 36px;
                margin-bottom: 16px;             
            }
            .description {
                font-size: 18px;
                line-height: 24px;
            }
            .button {
                margin-top: 16px;
                a {
                    display: inline-block;
                    padding: 8px 32px;
                    background-color: #dc602e;
                    color: white;
                    text-decoration: none;
                    border-radius: 50px;
                    transition: all 0.3s ease;
                    &:hover {
                        opacity: 0.6;
                    }
                }
            }
        }
        .image {
            order: 2;
            flex: 1;
            img {
                width: 360px;
                height: auto;
                display: block;
                margin: 0 auto;
            }
        }
        &:nth-of-type(odd) {
            background-color: #F3F8FB;
            position: relative;
            &:before {
                content: '';
                display: block;
                width: 200%;
                height: 100%;
                background-color: #F3F8FB;
                position: absolute;
                left: 50%;
                top: 0;
                transform: translateX(-50%);
                z-index: -1;
            }
            .content {
                order: 2;
            }
            .image {
                order: 1;
            }
        }
    }
    @media (max-width: 768px) {
        .section {
            flex-direction: column;
            &:nth-of-type(even) {
                .content {
                    order: 2;
                }
                .image {
                    order: 1;
                }
            }
        }
    }
}
</style>
