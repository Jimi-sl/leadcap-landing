import contentful from 'contentful';

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getAllPosts() {
  const entries = await contentfulClient.getEntries({
    content_type: 'blogPost',
    order: ['-fields.publishedDate'],
  });
  return entries.items;
}

export async function getPostBySlug(slug) {
  const entries = await contentfulClient.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  });
  return entries.items[0] ?? null;
}
