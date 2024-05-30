
export interface Pagination {
    /**
     * @default 0
     * @example 4
     */
    readonly total?: number;
    /**
     * @default 0
     * @example 10
     */
    readonly per_page?: number;
    /**
     * @default 0
     * @example 1
     */
    readonly current_page?: number;
    /**
     * @default 0
     * @example 1
     */
    readonly last_page?: number;
    readonly previous_page_url?: string;
    readonly next_page_url?: string;
}
