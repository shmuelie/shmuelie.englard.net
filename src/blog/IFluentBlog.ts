import { Post, PostSummary } from '../drop-in-blog/blog.js';

export interface IFluentBlog {
    /**
     * The component is loading the blog content.
     */
    loading: boolean;
    /**
     * The blog post summaries that are currently visible.
     */
    posts: PostSummary[];
    /**
     * The blog post currently visible or null if showing the blog listing.
     */
    post: Post | null;
    /**
     * The ID of the current blog post or null if showing the listing.
     */
    currentPost: number | null;
}