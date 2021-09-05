import { ContactPoint, EmployeeRole } from './schema'

export const contantPoints: ContactPoint[] = [
    {
        "@type": "ContactPoint",
        contactType: "Twitter",
        url: "https://twitter.com/Shmuelie",
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
    }
];
contantPoints.sort((a, b) => (a.contactType as string).localeCompare(b.contactType as string));

export const jobs: EmployeeRole[] = [
    {
        "@type": "EmployeeRole",
        startDate: "2021-04-19",
        endDate: "",
        roleName: "Senior Software Engineer",
        salaryCurrency: "USD",
        employer: {
            "@type": "Corporation",
            name: "Microsoft",
            address: "Redmon, Washington, United States",
            url: "https://www.microsoft.com",
            logo: "https://simple-icons.github.io/simple-icons-website/icons/microsoft.svg"
        },
        roleDescription: [ "Windows Inbox App Development" ]
    },
    {
        "@type": "EmployeeRole",
        startDate: "2014-08-04",
        endDate: "2020-12-31",
        roleName: "Software Engineer",
        salaryCurrency: "USD",
        employer: {
            "@type": "Corporation",
            name: "Lufthansa Systems",
            address: "Princeton, New Jersey, United States",
            url: "https://www.lhsystems.com/",
            logo: "https://simple-icons.github.io/simple-icons-website/icons/lufthansa.svg"
        },
        roleDescription: [
            {
                "@type": "CreativeWork",
                name: "Maps Project (data)",
                description: "Led the data integration part of this dynamic maps navigation project. Designed and implemented data integration systems to consolidate and move substantial amounts of aeronautical data (JSON, GeoJSON, XML, Google Protocol Buffers) between expert backend systems (SQL Server, PostgreSQL, other in-house tools) and in-cockpit navigation devices. Designed and implemented complex geometrical algorithms to manipulate this data to reduce their size and conform to the domain logic. Developed the entire system to be cross-playform, with most of it in .NET Core.",
                url: "https://www.lhsystems.com/article/lidompilot-30-first-step-towards-fully-dynamic-navigation-maps"
            },
            {
                "@type": "CreativeWork",
                name: "MAPS Project (web integration)",
                description: "Proposed and implemented a prototype for the Maps project (C++/OpenGL) as a Web Map Service (WMS). Developed using ASP.NET Core."
            },
            {
                "@type": "CreativeWork",
                name: "MAPS Project (system integration)",
                description: "Participated in design and development of the cross-platform interface to allow the external system to interface with the C++ MAPS library. Build bindings to JAVA and C# using SWIG technology. Built test applications to showcase the interface and cooperated with external teams to integrate the solution.",
                url: "https://www.lhsystems.com/solutions-services/flight-deck-solutions/lidonavigation/lidoeroutemanual"
            },
            {
                "@type": "CreativeWork",
                name: "Lido Tools (in-house GIS)",
                description: "Developed and maintained the aeronautical data production tools for a large globally distributed team of aeronautical specialists. The tools are an in-house GIS system, very specialized for the aeronautical domain, an involving big data. Technologies involved, .NET, .NET Core, C#, SQL Server, XAML and DevExpress.",
                url: "https://www.lhsystems.com/solutions-services/flight-deck-solutions/lidonavigation/lidoamdb"
            },
            {
                "@type": "CreativeWork",
                name: "BoardConnect MovingMap (flight tracking)",
                description: "Designed the architecture and implemented a web application for use by commercial airlines in their entertainment system. This jQuery/JavaScript map application interfaced with the aircraft navigation system to present to the user all the flight data.",
                url: "https://apex.aero/articles/lufthansa-systems-boardconnect-portable-and-mcabin-put-flight-management-first/"
            }
        ]
    },
    {
        "@type": "EmployeeRole",
        startDate: "2014-04-14",
        endDate: "2014-09-18",
        roleName: "Software Engineer",
        salaryCurrency: "USD",
        employer: {
            "@type": "Corporation",
            name: "UPS",
            address: "Edison, New Jersey, United States",
            url: "https://www.ups.com/",
            logo: "https://simple-icons.github.io/simple-icons-website/icons/ups.svg"
        },
        roleDescription: [ "Developing a website to allow auditing of servers, network equipment, and Windows services used in warehouses. The website is a modern web app, using progressive enhancement for those on new browsers. The site uses Signalr to allow for real time updates of the audits." ]
    },
    {
        "@type": "EmployeeRole",
        startDate: "2012-08-20",
        endDate: "2013-09-23",
        roleName: "Software Engineer",
        salaryCurrency: "USD",
        employer: {
            "@type": "Corporation",
            name: "Control Writer Software",
            url: "https://www.controlwriter.com/"
        },
        roleDescription: [ "Reengineered an application from the ground up. The original application was developed in Silverlight to allow for shared code between Windows and Mac. To allow for the same rapid development cycles a radical development technique using a cross-platform game development platform called MonoGame on top of the Common Language Infrastructure was used. Approximately 90% code sharing was achieved in the end with most features being developed for both platforms simultaneously." ]
    },
    {
        "@type": "EmployeeRole",
        startDate: "2011-05-01",
        endDate: "2012-08-17",
        roleName: "Software Engineer",
        salaryCurrency: "USD",
        employer: {
            "@type": "Corporation",
            name: "CheckM8",
            url: "https://www.linkedin.com/company/checkm8/"
        },
        roleDescription: [
            "My primary responsibilities were to maintain and enhance Linux/C++ based ad-severs, maintain ad-serving JavaScript, and to maintain system monitoring software. I would also research innovative technologies to help with ad serving and to break into new markets.",
            "As part of my responsibilities, I developed HTML5 and JavaScript versions of Flash based ads for consumption on devices that do not support flash like tablets and phones."
        ]
    }
];
