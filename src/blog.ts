import { ApplyOptions, apply, Thing } from 'https://unpkg.com/microdata-tooling@1.0.4'
import { getPosts, convertPost, isError } from './drop-in-blog.js'

export async function loadBlog(): Promise<void> {
    const response = await getPosts();

    if (isError(response)) {
        return;
    }

    const posts = response?.posts?.map(convertPost) ?? [];

    const applyOptions: ApplyOptions = {
    };
    const postsElement = document.querySelector('fluent-tab-panel.blog > section.blog-posts > div') as HTMLElement;
    apply(posts as unknown as Thing, postsElement, applyOptions);
}