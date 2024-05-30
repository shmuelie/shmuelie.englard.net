
export interface Author {
    /**
     * @default 0
     * @example 217
     */
    readonly id?: number;
    /** @example Jason */
    readonly name?: string;
    /** @example jason */
    readonly slug?: string;
    /** @example https://dropinblog.net/34236460/authors/91ec7b998af85b554be184f7a9f62b28cec93c20.jpg */
    readonly photo?: string;
    /** @example <p><span style="font-size: 11pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Jason is a co-founder of <a href="https://dropinblog.com">DropInBlog</a>, and a bit of a coding geek. He just wants to make everyone&rsquo;s time on the web a little easier, and has over 10 years of experience building technical solutions to tough problems. When he&rsquo;s not coding out a new feature for DiB, you can find him tinkering with his own projects or reading up on the latest tech stack.</span></p> */
    readonly bio?: string;
}
