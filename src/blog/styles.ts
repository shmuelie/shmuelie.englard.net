import { css } from 'https://unpkg.com/@microsoft/fast-element@1.13.0';

/**
 * FluentBlog styles.
 */
export const styles = css`
section.blog-loading {
    margin: 20px;
}

section.no-posts {
    margin: 20px;
}

section.blog-posts > div {
    display: flex;
    flex-wrap: wrap;
    padding-left: 10px;
}

section.blog-posts fluent-card {
    max-width: 300px;
    color: var(--neutral-foreground-rest);
    margin: 10px;
    width: 40vw;
    cursor: pointer;
}

section.blog-posts fluent-card img {
    max-width: 300px;
    width: 40vw;
}

section.blog-posts fluent-card div {
    padding: 0 10px 10px;
}

section.blog-posts fluent-card time {
    font-style: italic;
}

section.blog-posts fluent-card p {
    overflow-y: auto;
    height: 100px;
}

section.blog-posts fluent-card h2 {
    text-overflow: ellipsis;
    overflow-x: clip;
    white-space: nowrap;
}

section.blog-post {
    margin: 20px;
}

section.blog-post fluent-flipper {
    color: var(--accent-foreground-rest);
    width: calc(((var(--base-height-multiplier) + var(--density))* var(--design-unit) + var(--design-unit))* 1px)
}

section.blog-post fluent-flipper:hover {
    color: var(--accent-foreground-hover);
}

section.blog-post img {
    border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-layer-rest);
    border-radius: calc(var(--layer-corner-radius) * 1px);
    box-shadow: var(--elevation-shadow-card-rest);
    object-fit: cover;
    width: 100%;
    max-height: 300px;
}

section.blog-post a {
    color: var(--accent-foreground-rest);
}

section.blog-post a:hover {
    color: var(--accent-foreground-hover);
}

section.blog-post a:active {
    color: var(--accent-foreground-active);
}

section.blog-post a:focus {
    color: var(--accent-foreground-focus);
}

section.blog-post a.badge {
    text-decoration: none !important;
    display: block;
}

section.blog-post time {
    font-style: italic;
    display: block;
}
`;
