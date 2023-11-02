/**
 * @typedef {import('./schema').PodcastSeries} PodcastSeries
 */

/**
 * Podcasts I listen to.
 * @type {PodcastSeries[]}
 */
export const podcasts = [
    {
        "@type": "PodcastSeries",
        name: "Accidental Tech Podcast",
        description: "Three nerds discussing tech, Apple, programming, and loosely related matters.",
        genre: "Technology",
        inLanguage: "en-us",
        isFamilyFriendly: true,
        thumbnailUrl: "https://cdn.atp.fm/artwork",
        url: "https://atp.fm/",
        webFeed: "https://atp.fm/rss",
        author: "Marco Arment, Casey Liss, John Siracusa"
    },
    {
        "@type": "PodcastSeries",
        name: "Cortex",
        description: "CGP Grey and Myke Hurley are both independent content creators. Each episode, they get together to discuss their working lives. Hosted by CGP Grey and Myke Hurley.",
        genre: "Technology",
        keywords: "cgp, grey, myke, hurley, work, time, technology, productivity, getting, things, done",
        inLanguage: "en-us",
        isFamilyFriendly: true,
        thumbnailUrl: "http://relayfm.s3.amazonaws.com/uploads/broadcast/image/17/cortex_artwork.png",
        url: "https://www.relay.fm/cortex",
        webFeed: "https://www.relay.fm/cortex/feed",
        author: "Relay FM"
    },
    {
        "@type": "PodcastSeries",
        name: "Under the Radar",
        description: "From development and design to marketing and support, Under the Radar is all about independent app development. It's never longer than 30 minutes.  Hosted by Marco Arment and David Smith.",
        genre: "Technology",
        keywords: "Development, iOS, Mac, Marco Arment, Underscore, David Smith, Apple, Web, Apps",
        inLanguage: "en-us",
        isFamilyFriendly: true,
        thumbnailUrl: "http://relayfm.s3.amazonaws.com/uploads/broadcast/image/23/radar_artwork.png",
        url: "https://www.relay.fm/radar",
        webFeed: "https://www.relay.fm/radar/feed",
        author: "Relay FM"
    },
    {
        "@type": "PodcastSeries",
        name: "Upgrade",
        description: "Upgrade looks at how technology shapes our lives, from the devices in our hands and pockets to the streaming services that keep us entertained. Hosted by Jason Snell and Myke Hurley.",
        genre: "Technology",
        keywords: "Jason, Snell, Myke, Hurley, Apple, Tech, Technology, Streaming, Media, Amazon",
        inLanguage: "en-us",
        isFamilyFriendly: true,
        thumbnailUrl: "http://relayfm.s3.amazonaws.com/uploads/broadcast/image/11/upgrade_artwork.png",
        url: "https://www.relay.fm/upgrade",
        webFeed: "https://www.relay.fm/upgrade/feed",
        author: "Relay FM"
    },
    {
        "@type": "PodcastSeries",
        name: "Ask Iliza Anything",
        description: "Everyone deserves that best friend who delivers blunt advice with impunity. Comedian, writer, and actor Iliza Shlesinger is that friend. She has built a cult-like following of listeners seeking her hilarious take on their problems. Every week, people submit their burning questions to the show, with topics ranging from bad coworkers, psychotic bridesmaids, and a mother-in-law who won't move out to faking an accent and diarrhea etiquette. Iliza's answers range from wise and heart-felt to rage-fueled and off-the-wall. She enjoys nothing more than giving incisive life advice to total strangers, sometimes with a celebrity guest in tow. It's always entertaining, so go ahead: Ask Iliza Anything.",
        genre: "Comedy",
        inLanguage: "en-us",
        isFamilyFriendly: false,
        thumbnailUrl: "https://image.simplecastcdn.com/images/2e970d8d-719d-4665-b4cd-6a3c82c2cca6/443e2d4e-902b-46ec-93cd-853a25b389a1/3000x3000/2723cde9f8edd92b68353640e5a2b16989532ab027e154a6cf651a57ddfbb8dbddb1e0a331a49261000784cd85de5b4d6d7ad6811494ab178780e21134ddec15.jpeg?aid=rss_feed",
        url: "https://ask-iliza-anything.simplecast.com",
        webFeed: "https://feeds.simplecast.com/5Rl5K29L",
        author: "Ask Iliza Anything"
    }
];