
export interface SearchQuery {
    /** @description The search string. */
    search: string;
    /** @description Post status filter (draft, published, scheduled) with a comma separated list. Defaults to published. */
    statuses?: string;
}
