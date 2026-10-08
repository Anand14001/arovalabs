/*
 * Blog data from the API.
 *
 * Shaped into what the existing blog components already render, for the same
 * reason the catalogue has a view model: the components want what a page needs
 * (a date string, a category name, an image URL), and the API returns what a
 * database holds. The translation happens once, here.
 */

import { useQuery } from '@tanstack/react-query';
import { api as catalogApi, BASE_URL } from './api';

const PREFIX = '/api/v1';

const request = async (path) => {
  const res = await fetch(`${BASE_URL}${PREFIX}${path}`, {
    headers: { Accept: 'application/json' },
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(body?.error?.message ?? `Request failed (${res.status}).`);
    err.status = res.status;
    throw err;
  }
  return body;
};

void catalogApi;

/** API post → the shape the blog components already expect. */
export const toPost = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? '',
    content: p.content ?? '',
    // The components render `date`, `category` and `categorySlug`.
    date: p.publishedAt,
    category: p.category?.name ?? null,
    categorySlug: p.category?.slug ?? null,
    author: p.author,
    readingMinutes: p.readingMinutes,
    // One image from the API fills all three slots the old data had.
    image: p.image,
    thumb: p.image,
    large: p.image,
    seo: p.seo,
  };
};

const STALE = 5 * 60_000;

export function usePosts({ category, limit = 24 } = {}) {
  const query = useQuery({
    queryKey: ['blog', 'posts', { category, limit }],
    queryFn: () =>
      request(
        `/posts?limit=${limit}${category ? `&category=${encodeURIComponent(category)}` : ''}`,
      ),
    staleTime: STALE,
  });

  return {
    ...query,
    posts: (query.data?.items ?? []).map(toPost),
    total: query.data?.pagination?.total ?? 0,
  };
}

export function usePost(slug) {
  const query = useQuery({
    queryKey: ['blog', 'post', slug],
    queryFn: () => request(`/posts/${encodeURIComponent(slug)}`),
    enabled: Boolean(slug),
    staleTime: STALE,
    // A missing article is an answer, not a failure worth retrying.
    retry: (count, error) => error?.status !== 404 && count < 2,
  });

  return {
    ...query,
    post: toPost(query.data?.post),
    prev: toPost(query.data?.prev),
    next: toPost(query.data?.next),
  };
}

export function useBlogCategories() {
  const query = useQuery({
    queryKey: ['blog', 'categories'],
    queryFn: () => request('/blog-categories'),
    staleTime: 10 * 60_000,
  });
  return { ...query, categories: query.data?.items ?? [] };
}

/**
 * Ask whether an unknown path has a redirect.
 *
 * Renaming a published article leaves one behind, so a link that was shared
 * before the rename still arrives somewhere useful instead of a 404.
 */
export function useRedirect(path) {
  const query = useQuery({
    queryKey: ['redirect', path],
    queryFn: () => request(`/redirects/lookup?path=${encodeURIComponent(path)}`),
    enabled: Boolean(path),
    retry: false,
    staleTime: STALE,
  });
  return query.data?.redirect ?? null;
}
