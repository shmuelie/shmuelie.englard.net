declare namespace twttr {
    namespace widgets {
        function createFollowButton(username: string, targetEl: Element, options?: {
            showScreenName?: boolean,
            showCount?: boolean,
            size?: "large",
            lang?: string,
            dnt?: boolean
        }): Promise<Element>;
    }
}