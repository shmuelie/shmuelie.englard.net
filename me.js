export const Me = {
    "@type": "Person",
    name: "Shmueli Yosef Englard",
    jobTitle: "Software Engineer",
    image: "https://avatars0.githubusercontent.com/u/1119883?s=460&u=ff3333cb5414fe0726c7b91226ccda3cd65d4a4a&v=4",
    email: "shmuelli.yosef@englard.net",
    telephone: "17177468354",
    address: "East Brunswick, New Jersey, United States",
    contactPoint: [
        {
            "@type": "ContactPoint",
            contactType: "Twitter",
            name: "@Shmuelie",
            url: "https://twitter.com/Schmuelie",
            identifier: "Shmuelie"
        },
        {
            "@type": "ContactPoint",
            contactType: "LinkedIn",
            name: "Shmueli Englard",
            url: "https://www.linkedin.com/in/shmuelienglard",
            identifier: "shmuelienglard"
        },
        {
            "@type": "ContactPoint",
            contactType: "GitHub",
            name: "Samuel Englard",
            url: "https://github.com/SamuelEnglard",
            identifier: "SamuelEnglard"
        }
    ],
    description: "Cutting my programming chops on the .NET 2.0 Betas in 2005, I grew to love developing software. I started out using VB.NET but moved on to C# quickly and never looked back. While most of my work is in C#, I have professional experience with cross platform development in Java, C++ (SWIG); web development in JavaScript, node.js and, database development with MS SQL Server, PostgreSQL and MySQL, and data integration services using different transport protocols using JSON, GeoJSON, XML and Google Protocol Buffers.",
    worksFor: [
        {
            "@type": "EmployeeRole",
            startDate: "2014-08",
            endDate: "2020-12",
            roleName: "Software Engineer",
            salaryCurrency: "USD",
            worksFor: {
                "@type": "Corporation",
                name: "Lufthansa Systems",
                address: "Princeton, New Jersey, United States"
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
            startDate: "2014-04",
            endDate: "2014-09",
            roleName: "Software Engineer",
            salaryCurrency: "USD",
            worksFor: {
                "@type": "Corporation",
                name: "UPS",
                address: "Edison, New Jersey, United States"
            },
            roleDescription: ["Developing a website to allow auditing of servers, network equipment, and Windows services used in warehouses. The website is a modern web app, using progressive enhancement for those on new browsers. The site uses Signalr to allow for real time updates of the audits."]
        },
        {
            "@type": "EmployeeRole",
            startDate: "2012-08",
            endDate: "2013-09",
            roleName: "Software Engineer",
            salaryCurrency: "USD",
            worksFor: {
                "@type": "Corporation",
                name: "Control Writer Software",
            },
            roleDescription: ["Reengineered an application from the ground up. The original application was developed in Silverlight to allow for shared code between Windows and Mac. To allow for the same rapid development cycles a radical development technique using a cross-platform game development platform called MonoGame on top of the Common Language Infrastructure was used. Approximately 90% code sharing was achieved in the end with most features being developed for both platforms simultaneously."]
        },
        {
            "@type": "EmployeeRole",
            startDate: "2011-05",
            endDate: "2012-08",
            roleName: "Software Engineer",
            salaryCurrency: "USD",
            worksFor: {
                "@type": "Corporation",
                name: "CheckM8"
            },
            roleDescription: [
                "My primary responsibilities were to maintain and enhance Linux/C++ based ad-severs, maintain ad-serving JavaScript, and to maintain system monitoring software. I would also research innovative technologies to help with ad serving and to break into new markets.",
                "As part of my responsibilities, I developed HTML5 and JavaScript versions of Flash based ads for consumption on devices that do not support flash like tablets and phones."
            ]
        }
    ]
};
export const ld = Object.assign({
    "@context": "https://schema.org"
}, Me);
