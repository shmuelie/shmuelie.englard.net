import { operations } from '../../data/dropinblog.api';

export type PostsOptions = operations['posts-list']['parameters']['query'];
export type PostsResponse = operations['posts-list']['responses']['200']['content']['application/json'];
export type PostsResponseData = NonNullable<PostsResponse['data']>;
export type PostsResponsePost = NonNullable<NonNullable<PostsResponse['data']>['posts']>[0];
export type PostsResponseAuthor = NonNullable<NonNullable<PostsResponsePost>['author']>;
export type PostResponse = operations['posts-retrieve']['responses']['200']['content']['application/json'];
export type PostResponsePost = NonNullable<NonNullable<PostResponse['data']>['post']>;
export type PostResponseAuthor = NonNullable<NonNullable<PostResponsePost>['author']>;
export type Post = PostsResponsePost | PostResponsePost;
export type Author = PostsResponseAuthor | PostResponseAuthor;

export function isFullPost(post: Post): post is PostResponsePost {
    return 'content' in post;
}