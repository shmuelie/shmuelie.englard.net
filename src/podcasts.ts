import { PodcastSeries } from './schema'

export const podcasts: PodcastSeries[] = [
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
    }
];