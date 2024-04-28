const DIB_FALLBACK_SVG_IMG = `data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20WIDTH%20HEIGHT'%3E%3C/svg%3E`;
const DIB_LAZYLOAD_IMG_SRC = "data-lazy-load";

export function changeSrcToLazySrcInImgTag(content: string = ""): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    Array.from(doc.querySelectorAll(".dib-post-featured-image img, .dib-post-content img, img.dib-post-featured-image, .dib-author-photo img")).forEach((img)=>{
        img.setAttribute(DIB_LAZYLOAD_IMG_SRC, img.getAttribute("src") ?? "");
        img.setAttribute("loading", "dib-lazy");
        img.classList.add("dib-img-loading");
        img.setAttribute("src", DIB_FALLBACK_SVG_IMG);
    });

    return doc.body.innerHTML
}

export function lazyLoadImagesInit(): void {
    const lazyLoadOptions = {
        root: null,
        rootMargin: "500px 0%",
    };
    if ("IntersectionObserver" in window) {
        const lazyloadImages = document.querySelectorAll("img[loading='dib-lazy']");

        let imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                let img = entry.target as HTMLImageElement;
                if (entry.isIntersecting && !img.classList.contains("dib-lazy-loaded")) {
                    img.src = img.getAttribute(DIB_LAZYLOAD_IMG_SRC) || "";
                    img.onerror = img.onload = ()=>{
                        img.classList.add("dib-lazy-loaded");
                        img.classList.remove("dib-img-loading");
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, lazyLoadOptions);

        lazyloadImages.forEach(function(image) {
            imageObserver.observe(image);
        });
    }
}