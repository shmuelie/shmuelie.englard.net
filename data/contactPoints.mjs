/**
 * @typedef {import('./schema').ContactPoint} ContactPoint
 */

/**
 * Collection of ways to contact me.
 * @type {ContactPoint[]}
 */
export const contactPoints = [
    {
        "@type": "ContactPoint",
        contactType: "X",
        url: "https://x.com/Shmuelie",
        identifier: "Shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "LinkedIn",
        url: "https://www.linkedin.com/in/shmuelienglard",
        identifier: "shmuelienglard"
    },
    {
        "@type": "ContactPoint",
        contactType: "GitHub",
        url: "https://github.com/shmuelie",
        identifier: "SamuelEnglard"
    },
    {
        "@type": "ContactPoint",
        contactType: "Stack-Overflow",
        url: "https://stackoverflow.com/users/1082492/shmuelie",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "Facebook",
        url: "https://www.facebook.com/Shmuelie/",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "NuGet",
        url: "https://www.nuget.org/profiles/shmuelie",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "npm",
        url: "https://www.npmjs.com/~shmuelie",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "Instagram",
        url: "https://www.instagram.com/shmuelienglard",
        identifier: "shmuelienglard"
    },
    {
        "@type": "ContactPoint",
        contactType: "Twitch",
        url: "https://twitch.com/shmuelie",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "Tumblr",
        url: "https://www.tumblr.com/blog/shmuelie",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "Keybase",
        url: "https://keybase.io/shmuelie",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "Steam",
        url: "https://steamcommunity.com/id/shmueli_e/",
        identifier: "shmueli_e"
    },
    {
        "@type": "ContactPoint",
        contactType: "YouTube",
        url: "http://www.youtube.com/channel/UCeWZRExZngloGBB9ZPXAkJg",
        identifier: "UCeWZRExZngloGBB9ZPXAkJg"
    },
    {
        "@type": "ContactPoint",
        contactType: "GreasyFork",
        url: "https://greasyfork.org/en/users/787382-shmuelie",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "Anime-Planet",
        url: "https://www.anime-planet.com/users/shmuelie",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "Disqus",
        url: "http://disqus.com/by/shmuelie",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "Pinterest",
        url: "https://www.pinterest.com/shmuelie",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "Microsoft",
        url: "https://docs.microsoft.com/en-us/users/shmuelie/",
        identifier: "shmuelie"

    },
    {
        "@type": "ContactPoint",
        contactType: "XDA-Developers",
        url: "https://forum.xda-developers.com/m/shmuelie.9862379/",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "Reddit",
        url: "https://www.reddit.com/user/ShmueliEnglard",
        identifier: "ShmueliEnglard"
    },
    {
        "@type": "ContactPoint",
        contactType: "World Anvil",
        url: "https://www.worldanvil.com/author/shmuelie",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "Mastodon",
        url: "https://mastodon.social/@shmuelie",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "Discord",
        url: "https://discordapp.com/users/288693161390505986",
        identifier: "shmuelie#3989"
    },
    {
        "@type": "ContactPoint",
        contactType: "Yelp",
        url: "https://www.yelp.com/user_details?userid=8zoM85ingaMtzbtK-mlNjQ",
        identifier: "8zoM85ingaMtzbtK-mlNjQ"
    },
    {
        "@type": "ContactPoint",
        contactType: "UserBenchmark",
        url: "https://www.userbenchmark.com/User?id=shmuelie&tab=PProfile",
        identifier: "shmuelie"
    },
    {
        "@type": "ContactPoint",
        contactType: "Bluesky",
        url: "https://bsky.app/profile/shmuelie.bsky.social",
        identifier: "shmuelie.bsky.social"
    },
    {
        "@type": "ContactPoint",
        contactType: "Threads",
        url: "https://www.threads.net/@shmuelienglard",
        identifier: "shmuelienglard"
    }
];

// Collection is sorted by contact type.
contactPoints.sort(function (a, b) {
    return a.contactType.localeCompare(b.contactType);
});