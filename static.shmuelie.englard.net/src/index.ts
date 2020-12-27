import { styleProcess } from './winjs.js'
import { dataBind } from './micro-data.js'

const experience = [
    {
        name: "Lufthansa Systems",
        duration: {
            startDate: {
                dateTime: "2014-08",
                content: "August 2014"
            },
            endDate: {
                dateTime: "2020-12",
                content: "December 2020"
            }
        },
        subEvents: [
            {
                name: "MAPS Project (data)",
                about: "Led the data integration part of this dynamic maps navigation project. Designed and implemented data integration systems to consolidate and move substantial amounts of aeronautical data (JSON, GeoJSON, XML, Google Protocol Buffers) between expert backend systems (SQL Server, PostgreSQL, other in-house tools) and in-cockpit navigation devices. Designed and implemented complex geometrical algorithms to manipulate this data to reduce their size and conform to the domain logic. Developed the entire system to be cross-playform, with most of it in .NET Core.",
                associatedMedia: {
                    href: "https://www.lhsystems.com/article/lidompilot-30-first-step-towards-fully-dynamic-navigation-maps",
                    content: "Link"
                }
            },
            {
                name: "MAPS Project (web integration)",
                about: "Proposed and implemented a prototype for the Maps project (C++/OpenGL) as a Web Map Service (WMS). Developed using ASP.NET Core."
            },
            {
                name: "MAPS Project (system integration)",
                about: "Participated in design and development of the cross-platform interface to allow the external system to interface with the C++ MAPS library. Build bindings to JAVA and C# using SWIG technology. Built test applications to showcase the interface and cooperated with external teams to integrate the solution.",
                associatedMedia: {
                    href: "https://www.lhsystems.com/solutions-services/flight-deck-solutions/lidonavigation/lidoeroutemanual",
                    content: "Link"
                }
            },
            {
                name: "Lido Tools (in-house GIS)",
                about: "Developed and maintained the aeronautical data production tools for a large globally distributed team of aeronautical specialists. The tools are an in-house GIS system, very specialized for the aeronautical domain, an involving big data. Technologies involved, .NET, .NET Core, C#, SQL Server, XAML and DevExpress.",
                associatedMedia: {
                    href: "https://www.lhsystems.com/solutions-services/flight-deck-solutions/lidonavigation/lidoamdb",
                    content: "Link"
                }
            },
            {
                name: "BoardConnect MovingMap (flight tracking)",
                about: "Designed the architecture and implemented a web application for use by commercial airlines in their entertainment system. This jQuery/JavaScript map application interfaced with the aircraft navigation system to present to the user all the flight data.",
                associatedMedia: {
                    href: "https://apex.aero/articles/lufthansa-systems-boardconnect-portable-and-mcabin-put-flight-management-first/",
                    content: "Link"
                }
            }
        ]
    },
    {
        name: "UPS",
        duration: {
            startDate: {
                dateTime: "2014-04",
                content: "April 2014"
            },
            endDate: {
                dateTime: "2014-09",
                content: "September 2014"
            }
        },
        description: [ "Developing a website to allow auditing of servers, network equipment, and Windows services used in warehouses. The website is a modern web app, using progressive enhancement for those on new browsers. The site uses Signalr to allow for real time updates of the audits." ]
    },
    {
        name: "Control Writer Software",
        duration: {
            startDate: {
                dateTime: "2012-08",
                content: "August 2012"
            },
            endDate: {
                dateTime: "2013-09",
                content: "September 2013"
            }
        },
        description: [ "Reengineered an application from the ground up. The original application was developed in Silverlight to allow for shared code between Windows and Mac. To allow for the same rapid development cycles a radical development technique using a cross-platform game development platform called MonoGame on top of the Common Language Infrastructure was used. Approximately 90% code sharing was achieved in the end with most features being developed for both platforms simultaneously." ]
    },
    {
        name: "CheckM8",
        duration: {
            startDate: {
                dateTime: "2011-05",
                content: "May 2011"
            },
            endDate: {
                dateTime: "2012-08",
                content: "August 2012"
            }
        },
        description: [
            "My primary responsibilities were to maintain and enhance Linux/C++ based ad-severs, maintain ad-serving JavaScript, and to maintain system monitoring software. I would also research innovative technologies to help with ad serving and to break into new markets.",
            "As part of my responsibilities, I developed HTML5 and JavaScript versions of Flash based ads for consumption on devices that do not support flash like tablets and phones."
        ]
    }
];

const experienceElement = document.querySelector<HTMLElement>("section.experience");
if (experienceElement) {
    dataBind(experienceElement, experience);
}

styleProcess(document.body);