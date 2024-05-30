import { PostSummary } from "./PostSummary";


export interface Post extends PostSummary {
    /**
       * @example <h2>Congrats on Finding Us &ndash; We're Happy You're Here!</h2>
       * <p>DropInBlog aims to be the simplest blogging solution for existing websites. Our primary goal is to help you get a stylish blog up and running on your site in minutes.</p>
       * <p>But because we are geeks at heart, we also want to help you boost your website's SEO and offer you loads of useful features along the way.</p>
       * <p><img class="dib-img-loading" loading="dib-lazy" data-lazy-load="https://io.dropinblog.com/assets/img/samples/embed/blogging-made-easy.webp" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20WIDTH%20HEIGHT'%3E%3C/svg%3E" alt="DropInBlog - Blogging Made Easy" width="1253" height="705" /></p>
       * <h3>How Do I Start?</h3>
       * <p>Integrating DropInBlog onto your site is easy ... just click the Code &amp; Layout tab in your admin panel and follow Steps 1 &amp; 2. <strong>That's it!</strong></p>
       * <p><strong><img class="dib-img-loading" loading="dib-lazy" data-lazy-load="https://io.dropinblog.com/assets/img/samples/embed/dropinblog-integration-codes.jpeg" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20WIDTH%20HEIGHT'%3E%3C/svg%3E" alt="Code and Layout - Step 1 and Step 2 code example" width="1253" height="398" /></strong><strong></strong></p>
       * <p>For more detailed instructions, watch our <a href="https://vimeo.com/248082632">integration video</a> ... or <a href="https://m.me/dropinblog">shoot us a message</a>. We're here to help in any way we can. We love all things blog related and we want you to as well. If you run into any snags while using DropInBlog, just let us know. Your success is our success!</p>
       * <h3>What's next?</h3>
       * <p>Once you're rolling, there are plenty of features you can implement. You can <a href="https://dropinblog.com/blog/how-to-add-authors-to-your-blog/">create authors</a> for each of your posts, organize them in <a href="https://dropinblog.com/blog/how-to-add-categories-to-your-blog/">categories</a>, <a href="https://dropinblog.com/blog/how-to-get-better-search-engine-rankings-with-the-dropinblog-seo-analyzer/">optimize your post's SEO</a> ... and tweak a bunch of other settings.</p>
       * <p>Play around, go crazy. We understand not everyone finds blogging as enjoyable as we do, but we hope we're at least making the process simple and pain-free!</p>
       * <p><img class="dib-img-loading" loading="dib-lazy" data-lazy-load="https://io.dropinblog.com/assets/img/samples/embed/Integration.png" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20WIDTH%20HEIGHT'%3E%3C/svg%3E" alt="" width="700" height="394" /></p>
       * <h3>And what's this about SEO?</h3>
       * <p>Search engine optimization is complicated &ndash; we're not going to try and deny that. Our goal is to help walk you through it step by step. We want each blog post you write to have the best shot at making its way to the top of search results.</p>
       * <p>Our SEO Analyzer guides you through the process of optimizing your posts. As you create posts you'll see your SEO score increase as each benchmark is hit. Follow the suggested tips and try to get your SEO score as close to 100 as you can. There's a surprise waiting for you if you make it. ;)</p>
       * <p><img class="dib-img-loading" loading="dib-lazy" data-lazy-load="https://io.dropinblog.com/assets/img/samples/embed/SEO.png" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20WIDTH%20HEIGHT'%3E%3C/svg%3E" alt="" width="1400" height="788" /></p>
       * <p class="clear">With these best practices in place, Google will start to take notice. This in turn means you'll start seeing an increase in your website's search ranking and ultimately more visitors to your website. Win, win, win!</p>
       * <h2>Thank You!</h2>
       * <p>We're thrilled you chose DropInBlog to fulfill your blogging needs. We hope we can meet all of your expectations and help you succeed on your blogging journey. So, for real, just <a href="https://m.me/dropinblog">drop us a line</a> if there's <em>anything</em> we can do to assist you along the way.<br /><br />Happy blogging!</p>
       */
    readonly content?: string;
    /**
     * @example <script type="application/ld+json">
     * {
     *   "@context": "http://schema.org",
     *   "@type": "BlogPosting",
     *   "mainEntityOfPage": {
     *     "@type": "WebPage",
     *     "@id": "https://dropindemo.com/blog/welcome-to-dropinblog"
     *   },
     *   "url": "https://dropindemo.com/blog/welcome-to-dropinblog",
     *   "headline": "Welcome to DropInBlog ~ Blogging Made Easy",
     *   "datePublished": "2024-03-16T16:44:00-05:00",
     *   "dateModified": "2024-03-16T16:45:06-05:00",
     *     "author": {
     *     "@type": "Person",
     *     "name": "Jason",
     *     "url": "https://dropindemo.com/blog/author/jason"
     *   },
     *       "image": ["https://dropinblog.net/34236460/files/featured/welcome-dib.png"],
     *     "wordCount": "415",
     *   "description": "Built to make embedding a blog into your website fast &amp; easy. Be up and blogging in minutes. Feature rich &amp; SEO friendly. Javascript, PHP or JSON integration.",
     *   "articleBody": "CONGRATS ON FINDING US – WE&#039;RE HAPPY YOU&#039;RE HERE! DropInBlog aims to be the simplest blogging solution for existing websites. Our primary goal is to help you get a stylish blog up and running on your site in minutes. But because we are geeks at heart, we also want to help you boost your website&#039;s SEO and offer you loads of useful features along the way. [DropInBlog - Blogging Made Easy] HOW DO I START? Integrating DropInBlog onto your site is easy ... just click the Code &amp; Layout tab in your admin panel and follow Steps 1 &amp; 2. THAT&#039;S IT! [CODE AND LAYOUT - STEP 1 AND STEP 2 CODE EXAMPLE] For more detailed instructions, watch our integration video ... or shoot us a message. We&#039;re here to help in any way we can. We love all things blog related and we want you to as well. If you run into any snags while using DropInBlog, just let us know. Your success is our success! WHAT&#039;S NEXT? Once you&#039;re rolling, there are plenty of features you can implement. You can create authors for each of your posts, organize them in categories, optimize your post&#039;s SEO ... and tweak a bunch of other settings. Play around, go crazy. We understand not everyone finds blogging as enjoyable as we do, but we hope we&#039;re at least making the process simple and pain-free! AND WHAT&#039;S THIS ABOUT SEO? Search engine optimization is complicated – we&#039;re not going to try and deny that. Our goal is to help walk you through it step by step. We want each blog post you write to have the best shot at making its way to the top of search results. Our SEO Analyzer guides you through the process of optimizing your posts. As you create posts you&#039;ll see your SEO score increase as each benchmark is hit. Follow the suggested tips and try to get your SEO score as close to 100 as you can. There&#039;s a surprise waiting for you if you make it. ;) With these best practices in place, Google will start to take notice. This in turn means you&#039;ll start seeing an increase in your website&#039;s search ranking and ultimately more visitors to your website. Win, win, win! THANK YOU! We&#039;re thrilled you chose DropInBlog to fulfill your blogging needs. We hope we can meet all of your expectations and help you succeed on your blogging journey. So, for real, just drop us a line if there&#039;s _anything_ we can do to assist you along the way. Happy blogging! "
     * }
     * </script>
     */
    readonly schema_article?: string;
    readonly related_posts?: PostSummary[];
}
