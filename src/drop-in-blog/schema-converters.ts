import { BlogPosting, Person } from '../../data/schema';
import { Author, Post, isFullPost } from './types.js'

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
        datePublished: post.publishedAtIso8601,
        dateModified: post.updatedAtIso8601,
        keywords: post.keyword,
        author: convertAuthor(post.author)
    };

    if (isFullPost(post)) {
        blogPosting.articleBody = post.content;
    }

    return blogPosting;
}