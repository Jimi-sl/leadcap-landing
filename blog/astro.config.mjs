import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// FIX: outDir was '../blog-dist', pointing outside this project entirely -
// Node resolves packages by walking up parent directories, so the
// prerendering subprocess (which runs from inside the output dir) could
// never find blog/node_modules from a sibling directory. Confirmed live:
// this broke every build with "Cannot find package 'piccolore'" (an
// internal Astro dependency, not a real content issue) before it even got
// to fetching Contentful data. Keeping the output inside the project fixes
// resolution; deploy.yml's assemble step now copies from blog/dist instead
// of blog-dist accordingly.
// FIX: `base: '/blog'` was redundant with (and actively conflicted with) the
// fact that routes already live under /blog/ purely because the source
// files sit at src/pages/blog/... - Astro's file-based routing puts them
// there regardless of `base`. With `base` set, every asset reference (CSS/
// JS in the shared _astro/ folder, which always sits at the dist root
// unaffected by page routing) got prefixed with an extra /blog/ that didn't
// match where those files actually land - confirmed live, the deployed CSS
// link 404'd because of exactly this mismatch. Canonical URLs already
// hardcode `/blog/` explicitly where needed (see [slug].astro), so nothing
// depends on this config.
// The sitemap this generates covers the whole domain, not just the blog -
// deploy.yml assembles this project's dist/ together with the static
// landing site (index.htm, waitlist.htm, PrivacyPolicy/, TermsOfService/)
// into one _site/, so the sitemap output lands at the real site root too.
// Blog posts are picked up automatically as Astro's own routes (dynamic -
// new Contentful posts appear here on their own, no manual edits needed);
// the static landing pages live outside this Astro project entirely, so
// they're listed explicitly via customPages. Excludes pricing-section.htm
// deliberately - it's an orphaned fragment, not a real navigable page, and
// its content duplicates index.htm's own pricing section.
export default defineConfig({
  site: 'https://leadcap.guru',
  outDir: './dist',
  integrations: [
    sitemap({
      customPages: [
        'https://leadcap.guru/',
        'https://leadcap.guru/waitlist.htm',
        'https://leadcap.guru/PrivacyPolicy/',
        'https://leadcap.guru/TermsOfService/',
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
