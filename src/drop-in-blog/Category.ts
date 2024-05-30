
export interface Category {
    /**
     * @default 0
     * @example 898924871
     */
    readonly id?: number;
    /** @example Announcements */
    readonly title?: string;
    /** @example announcements */
    readonly slug?: string;
}
