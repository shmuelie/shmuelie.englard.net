import { changeSrcToLazySrcInImgTag, lazyLoadImagesInit } from './dib-lazy-load.js'

interface DibData {
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
    canonicalUrl?: string;
    headTitle?: string;
    headDescription?: string;
    og_image?: string;
}

interface DibEmbed {
    data: DibData;
    status: string;
}

function isInIframe(): boolean {
    return window.self !== window.top;
}

export interface DibOptions {
    categories?: string[];
    authors?: string[];
    baseUrl?: string;
}

export async function loadRecentBlog(count: number, options: DibOptions = {}): Promise<void> {
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
    parseData(await response.json() as DibEmbed);
}

export async function loadBlog(options: DibOptions = {}): Promise<void> {
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
    parseData(await response.json() as DibEmbed);
}

function parseData(json: DibEmbed): void {
    appendElements(json.data);
    setTimeout(()=>{
        lazyLoadImagesInit();
        categoryDropdownChange();
    });
}

function createLinkTag(src: string, rel: string, type?: string, title?: string): HTMLLinkElement {
    let link = document.createElement("link");
    link.href = src;
    link.rel = rel;
    if (type) {
        link.type = type;
    }
    if (title) {
        link.title = title;
    }
    appendTo("head", link);

    return link;
}

function addScript(src: string): void {
    const s = document.createElement("script");
    s.setAttribute("src", src);
    document.body.appendChild(s);
}

function addStyle(css: string): void {
    const style = document.createElement("style");
    style.textContent = css;
    appendTo("head", style);
}

function appendTo(root: string, ele: Node): void {
    document.getElementsByTagName(root)[0].appendChild(ele);
}

function addContent(divId: string, content: string, process: boolean): void {
    try {
        let el = document.getElementById(divId) as HTMLElement;
        el.innerHTML = content;

        if (process) {
            const scripts = el.getElementsByTagName("script");
            for (const element of scripts) {
                let script = document.createElement("script") as HTMLScriptElement & { [key: string]: string; };
                if (element.text) {
                    script.text = element.text;
                } else {
                    for (const attribute of element.attributes) {
                        if (attribute.name in HTMLScriptElement.prototype) {
                            script[attribute.name] = attribute.value;
                        } else if (attribute.name.startsWith("data-")) {
                            script.setAttribute(attribute.name, attribute.value);
                        }
                    }
                }
                element.parentNode?.replaceChild(script, element);
            }
        }
    } catch (e) {
    }
}

function appendElements(data: DibData): void {
    data.content = changeSrcToLazySrcInImgTag(data.content)
    if (data.customCss) {
        addStyle(data.customCss);
    }
    if (data.additional_head_code) {
        appendTo("head", document.createRange().createContextualFragment(data.additional_head_code));
    }
    if (data.content) {
        addContent("dib-posts", data.content, true);
    }
    if (data.categories) {
        addContent("dib-categories", data.categories, false);
    }
    if (data.authors) {
        addContent("dib-authors", data.authors, false);
    }
    if (data.recent_posts) {
        addContent("dib-recent-posts", data.recent_posts, false);
    }
    if (data.recent_post_list) {
        addContent("dib-recent-post-list", data.recent_post_list, false);
    }
    if (data.specific_posts) {
        addContent("dib-specific-posts", data.specific_posts, false);
    }
    if (data.specific_posts_list) {
        addContent("dib-specific-posts-list", data.specific_posts_list, false);
    }
    if (data.search_form) {
        addContent("dib-search-form", data.search_form, false);
    }

    if (isInIframe()) {
        document.querySelectorAll("#dib-posts a").forEach((a)=>{
            a.setAttribute("target", "_top");
        });
    }

    if (data.additional_js_files) {
        data.additional_js_files.forEach(function(jsfile) {
            addScript(jsfile);
        });
    }

    if (data.rssUrl) {
        createLinkTag(data.rssUrl, "alternate", "application/rss+xml", data.rssTitle);
    }

    readProgressIndicator();
}

function categoryDropdownChange(iframe: boolean = false): void {
    const dropdown = document.getElementById('dib-cat-dropdown') as HTMLSelectElement;
    if (dropdown) {
        dropdown.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const url = selectedOption.getAttribute('data-url') ?? "";
            if (url) {
                if (iframe && top) {
                    top.window.location.href = url;
                } else {
                    window.location.href = url;
                }
            }
        });
    }
}

function readProgressIndicator(): boolean {
    const dib_pie = document.getElementById("dib-pie");
    if (dib_pie == undefined || !dib_pie) {
        return true;
    }

    appendTo("body", dib_pie);

    const containers = ["#dib-audio", ".dib-post-featured-image", ".dib-post-title", ".dib-meta-text", ".dib-sharing-top", ".dib-post-content", ".dib-sharing-bottom"].map((c)=>{
        return document.querySelector(c);
    }).filter((c)=>c);
    const containersTotalHeight = containers.reduce((acc,c)=>{
        return acc + (<HTMLElement>c).offsetHeight;
    }, 0);

    const containerHeight = containersTotalHeight - window.innerHeight;

    const dib_pie_fill = document.getElementById("dib-pie-fill") as HTMLElement;

    window.onscroll = function() {
        let containerPos = containers[0]!.getBoundingClientRect();
        let diff = containerHeight + containerPos.top;
        let progressPercentage = (diff / containerHeight) * 100;
        let cssWidth = 100 - progressPercentage;
        let cssRotate = (360 * cssWidth) / 100;
        dib_pie_fill.style.transform = "rotate(" + cssRotate + "deg)";
        if (cssWidth > 50) {
            dib_pie.classList.add("dib-pie-50");
        } else {
            dib_pie.classList.remove("dib-pie-50");
        }
        if (cssWidth < 0 || cssWidth > 100) {
            dib_pie_fill.style.display = "none";
            dib_pie.style.opacity = "0";
        } else {
            dib_pie_fill.style.display = "block";
            dib_pie.style.opacity = "1";
        }
    };

    return false;
}
