import { ApplyOptions, apply, Thing } from 'https://unpkg.com/microdata-tooling@1.0.4'
import { getPosts, convertPost } from './drop-in-blog.js'

export async function loadBlog(): Promise<void> {
    const response = await getPosts();
    const posts = response?.data?.posts?.map(convertPost) ?? [];

    const applyOptions: ApplyOptions = {
    };
    const postsElement = document.querySelector('fluent-tab-panel.blog > section.blog-posts > div') as HTMLElement;
    apply(posts as unknown as Thing, postsElement, applyOptions);
}