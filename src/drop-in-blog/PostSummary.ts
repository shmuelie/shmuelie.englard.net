import { Author } from "./Author";
import { Category } from "./Category";


export interface PostSummary {
    /**
       * @default 0
       * @example 42349488
       */
    readonly id?: number;
    /** @example How to Add Categories to Your Blog */
    readonly title?: string;
    /** @example how-to-add-categories-to-your-blog */
    readonly slug?: string;
    /** @example https://dropindemo.com/blog/how-to-add-categories-to-your-blog */
    readonly url?: string;
    /** @example Categories are important for search engine optimization and for organizing your content around themes. Website visitors will have a much easier time navigating your site if it is well organized – and when visitors have an easier time, visitors are happy! */
    readonly summary?: string;
    /** @example https://dropinblog.net/34236460/files/featured/how-to-add-categories.png */
    readonly featuredImage?: string;
    readonly featuredImageWebm?: string;
    readonly featuredImageMp4?: string;
    /** @example 12/06/2021 */
    readonly publishedAt?: string;
    /** @example 2021-12-06T15:57:00-06:00 */
    readonly publishedAtIso8601?: string;
    /** @example 02/22/2024 */
    readonly updatedAt?: string;
    /** @example 2024-02-22T18:52:10-06:00 */
    readonly updatedAtIso8601?: string;
    /** @example add categories to your blog */
    readonly keyword?: string;
    readonly secondaryKeywords?: unknown[];
    /** @example How to Add Categories to Your Blog */
    readonly seoTitle?: string;
    /** @example Help your website visitors find the info they're looking for and encourage them to keep browsing your site by learning how to add categories to your blog. */
    readonly seoDescription?: string;
    /** @example */
    readonly canonicalUrl?: string;
    /**
     * @default 0
     * @example 0
     */
    readonly pinned?: number;
    /** @example 2 minute read */
    readonly readtime?: string;
    /**
     * @default 0
     * @example 85
     */
    readonly seo_score?: number;
    /** @example published */
    readonly status?: string;
    /** @example public */
    readonly visibility?: string;
    /**
     * @default 0
     * @example 0
     */
    readonly noindex?: number;
    readonly author?: Author;
    readonly categories?: Category[];
}
