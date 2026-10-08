import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, Clock, Link2, Phone } from 'lucide-react';
import { usePost } from '../lib/blog';
import { quickActions } from '../data/homepage';
import useArticleContent from '../components/blog/useArticleContent';
import TableOfContents from '../components/blog/TableOfContents';
import ArticleIndex from '../components/blog/ArticleIndex';
import Reveal from '../components/motion/Reveal';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

/*
 * A single article — /:slug/
 *
 * The reference page was a breadcrumb, a title, a date, a full-width image and
 * an undifferentiated column of text: a document, not a reading experience.
 *
 * It is now laid out like a publication:
 *
 *   A masthead that leads with the title and sets the article's opening
 *   paragraph as a standfirst — lifted out of the body rather than repeated, so
 *   the same sentence is never printed twice.
 *
 *   A sticky rail on wide screens carrying the contents, the reading time and
 *   the share actions. Long-form diagnostics writing is scanned as much as it
 *   is read, and a contents list is the difference between finding "Preparation
 *   is Key to Precision" and scrolling for it.
 *
 *   A body held to a reading measure at 17px, with headings that bind to the
 *   text they introduce.
 *
 * The body HTML is the reference site's own block markup, rendered verbatim —
 * static authored content, never user input.
 */
export default function BlogPost() {
  const { slug } = useParams();
  const { post, prev, next, isLoading, isError, error } = usePost(slug);

  // Hooks must run before any early return, so this is called unconditionally.
  const { lead, html, headings, minutes } = useArticleContent(post?.content ?? '');
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="shell py-20" aria-busy="true" aria-label="Loading article">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="h-4 w-32 animate-pulse rounded bg-ink/[0.06]" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-ink/[0.06]" />
          <div className="h-64 animate-pulse rounded-2xl bg-ink/[0.04]" />
        </div>
      </div>
    );
  }

  // A real 404 redirects; anything else is the API being unreachable, which
  // must not be presented as "this article does not exist".
  if (isError && error?.status === 404) return <Navigate to="/404" replace />;

  if (isError || !post) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="display-md text-ink">We couldn’t load this article.</h1>
        <p className="section-sub mx-auto mt-2 max-w-md">
          This is usually temporary — please try again in a moment.
        </p>
      </div>
    );
  }

  // The API gives the neighbouring articles rather than everything else.
  const related = [prev, next].filter(Boolean);
  const [, call] = quickActions;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context, denied permission) — the address
      // bar still has the URL, so there is nothing useful to report here.
    }
  };

  return (
    <>
      {/* ----------------------------------------------------- masthead */}
      <header className="border-b border-ink/10">
        <div className="shell py-12 sm:py-16">
          <Reveal className="max-w-3xl">
            <Link
              to={`/category/${post.categorySlug}/`}
              className="label-section text-accent transition-colors hover:text-accent-dark"
            >
              {post.category}
            </Link>

            <h1 className="display-lg mt-6">{post.title}</h1>

            {lead && <p className="prose-lead mt-7 max-w-2xl">{lead}</p>}

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-body">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="flex items-center gap-1.5">
                <Clock size={13} aria-hidden="true" />
                {minutes} min read
              </span>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ------------------------------------------------- lead image */}
      {post.large && (
        <Reveal y={20}>
          <figure className="shell pt-10 sm:pt-14">
            <img
              src={post.large}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="aspect-[16/7] w-full rounded-2xl object-cover"
            />
          </figure>
        </Reveal>
      )}

      {/* ------------------------------------------------- the article */}
      <div className="shell py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Rail: contents, then the ways to take the article with you. */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <TableOfContents headings={headings} />

              <div className={headings.length > 0 ? 'mt-10 border-t border-ink/12 pt-8' : ''}>
                <p className="label mb-4 text-ink/35">Share</p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold text-ink ring-1 ring-inset ring-ink/15 transition-all duration-300 hover:bg-ink hover:text-white hover:ring-ink"
                  >
                    {copied ? <Check size={14} /> : <Link2 size={14} />}
                    {copied ? 'Copied' : 'Copy link'}
                  </button>
                </div>

                {/* A reader convinced by the article needs somewhere to act. */}
                <div className="mt-8 border-t border-ink/12 pt-8">
                  <Link to="/tests/" className="link-arrow">
                    Browse tests
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                  <a
                    href={call.href}
                    className="mt-3 flex items-center gap-2 text-[13px] text-body transition-colors hover:text-brand"
                  >
                    <Phone size={13} />
                    {call.title}
                  </a>
                </div>
              </div>
            </Reveal>
          </aside>

          {/*
            The body. `dangerouslySetInnerHTML` is deliberate and safe here: the
            content is the reference site's authored block markup held in the
            repository, with no path from user input to this string.
          */}
          <Reveal
            as="div"
            y={16}
            className="prose-arova lg:col-span-8 lg:col-start-5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      {/* ---------------------------------------------------- read next */}
      {related.length > 0 && (
        <section className="section-lg rule-top">
          <div className="shell">
            <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
              <div className="max-w-xl">
                <p className="label-section mb-6 text-ink/35">Read next</p>
                <h2 className="display-lg">More Health Blogs</h2>
              </div>

              <Link to={`/category/${post.categorySlug}/`} className="link-arrow shrink-0">
                <ArrowLeft size={16} aria-hidden="true" />
                {post.category}
              </Link>
            </Reveal>

            <div className="mt-12">
              <ArticleIndex posts={related} playOnMount={false} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
