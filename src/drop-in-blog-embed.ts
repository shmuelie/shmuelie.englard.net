import { BlogPosting } from '../data/schema'

export interface EmbedData {
    content: string;
    customCss?: string;
    additional_head_code?: string;
    categories?: string;
    authors?: string;
    recent_posts?: string;
    recent_post_list?: string;
    specific_posts?: string;
    specific_posts_list?: string;
    search_form?: string;
    additional_js_files: string[];
    rssUrl?: string;
    rssTitle: string;
    headTitle?: string;
}

export interface EmbedResponse {
    data: EmbedData;
    status: string;
}

export interface EmbedOptions {
    categories?: string[];
    authors?: string[];
    baseUrl?: string;
}

export async function getEmbededBlogPosts(options: EmbedOptions = {}): Promise<EmbedResponse> {
    let urlBase = "https://api.dropinblog.com/v1/embed?b=f56590c5-56ae-4aab-8d55-df9c76db569c&blogurl=" + encodeURIComponent(location.toString().replace(location.search, "")) + "&domain=" + encodeURIComponent(window.location.host) + "&format=json";

    if (options.categories && options.categories.length > 0) {
        urlBase += "&categories=" + options.categories.join(",");
    }
    if (options.authors && options.authors.length > 0) {
        urlBase += "&authors=" + options.authors.join(",");
    }
    if (options.baseUrl && options.baseUrl.length > 0) {
        urlBase += "&baseurl=" + encodeURIComponent(options.baseUrl);
    }

    const response = await fetch(urlBase);
    return await response.json() as EmbedResponse;
}

export async function getEmbededRecentBlogPosts(count: number, options: EmbedOptions = {}): Promise<EmbedResponse> {
    let urlBase = "https://api.dropinblog.com/v1/embed?b=f56590c5-56ae-4aab-8d55-df9c76db569c&blogurl=" + encodeURIComponent(location.toString().replace(location.search, "")) + "&domain=" + encodeURIComponent(window.location.host) + "&format=json&recentposts=" + count;

    if (options.categories && options.categories.length > 0) {
        urlBase += "&recentpostscategories=" + options.categories.join(",");
    }
    if (options.authors && options.authors.length > 0) {
        urlBase += "&authors=" + options.authors.join(",");
    }
    if (options.baseUrl && options.baseUrl.length > 0) {
        urlBase += "&baseurl=" + encodeURIComponent(options.baseUrl);
    }

    const response = await fetch(urlBase);
    return await response.json() as EmbedResponse;
}

export function parseResponse(response: EmbedResponse): BlogPosting[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data.content, "text/html");
    let posts: BlogPosting[] = [];

    for (const postDiv of doc.querySelectorAll("div.dib-post")) {
        const textNode = postDiv.querySelector(".dib-post-content")?.firstChild as Text | null;
        const titleElement = postDiv.querySelector<HTMLElement>(".dib-post-title");
        const postUrl = new URL(titleElement?.querySelector<HTMLLinkElement>(".dib-post-title-link")?.href ?? "");
        posts.push({
            "@type": "BlogPosting",
            headline: titleElement?.innerText ?? "",
            dateCreated: (new Date(postDiv.querySelector<HTMLElement>(".dib-post-date")?.innerText ?? "")).toISOString(),
            abstract: textNode?.data.trim() ?? "",
            image: postDiv.querySelector<HTMLImageElement>(".dib-post-featured-image img")?.src ?? "",
            name: postUrl.searchParams.get("p") ?? ""
        });
    }

    return posts;
}