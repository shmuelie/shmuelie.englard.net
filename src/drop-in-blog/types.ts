import { operations } from '../../data/dropinblog.api';

export namespace posts {
    export type Options = operations['posts-list']['parameters']['query'];
    export type Response = operations['posts-list']['responses']['200']['content']['application/json'];
    export type Data = NonNullable<Response['data']>;
    export type Post = NonNullable<Data['posts']>[0];
    export type Author = NonNullable<NonNullable<Post>['author']>;
}

export namespace post {
    export type Response = operations['posts-retrieve']['responses']['200']['content']['application/json'];
    export type Data = NonNullable<Response['data']>;
    export type Post = NonNullable<Data['post']>;
    export type Author = NonNullable<NonNullable<Post>['author']>;
}

export type Post = posts.Post | post.Post;
export type Author = posts.Author | post.Author;

export function isFullPost(post: Post): post is post.Post {
    return 'content' in post;
}