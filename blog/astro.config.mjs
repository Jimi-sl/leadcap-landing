import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// FIX: outDir was '../blog-dist', pointing outside this project entirely -
// Node resolves packages by walking up parent directories, so the
// prerendering subprocess (which runs from inside the output dir) could
// never find blog/node_modules from a sibling directory. Confirmed live:
// this broke every build with "Cannot find package 'piccolore'" (an
// internal Astro dependency, not a real content issue) before it even got
// to fetching Contentful data. Keeping the output inside the project fixes
// resolution; deploy.yml's assemble step now copies from blog/dist instead
// of blog-dist accordingly.
export default defineConfig({
  site: 'https://leadcap.guru',
  base: '/blog',
  outDir: './dist',
  integrations: [sitemap()],
});
