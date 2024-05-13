import { BlogPosting, Person } from '../../data/schema';
import { Author as ListAuthor, Post as PostSummary } from './posts.js'
import { Author as SearchAuthor, Post as SearchPost } from './search.js'
import { Author as PostAuthor, Post as FullPost } from './post.js'

export type Post = PostSummary | FullPost | SearchPost;
export type Author = ListAuthor | PostAuthor | SearchAuthor;

export function isFullPost(post: Post): post is FullPost {
    return 'content' in post;
}

export function convertAuthor(author: Author | undefined) : Person | undefined {
    if (author) {
        const id = author.id?.toString() ?? '0';
        return {
            "@type": "Person",
            "@id": id,
            identifier: author.slug ?? id,
            name: author.name,
            image: author.photo,
            description: author.bio,
        };
    }
    return undefined;
}

export function convertPost(post: Post) : BlogPosting {
    const id = post.id?.toString() ?? '0';
    let blogPosting: BlogPosting = {
        "@type": "BlogPosting",
        "@id": id,
        identifier: post.slug ?? id,
        abstract: post.summary,
        image: post.featuredImage,
        headline: post.title,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        keywords: post.keyword,
        author: convertAuthor(post.author)
    };

    if (isFullPost(post)) {
        blogPosting.articleBody = post.content;
    }

    return blogPosting;
}