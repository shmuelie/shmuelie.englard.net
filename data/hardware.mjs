/**
 * Desktop and server configurations.
 */
export const desktops = [
    {
        name: "Personal",
        items: [
            { type: "Motherboard", name: "ASUS PRIME Z790-P WIFI D4", url: "https://www.asus.com/us/motherboards-components/motherboards/prime/prime-z790-p-wifi-d4/" },
            { type: "Case", name: "be quiet! Dark Base PRO 901 Black", url: "https://www.bequiet.com/en/case/4425" },
            { type: "PSU", name: "Corsair HX1000i", url: "https://www.corsair.com/us/en/p/psu/cp-9020074-na/hxi-series-hx1000i-high-performance-atx-power-supply-1000-watt-80-plus-platinum-certified-psu-cp-9020074-na" },
            { type: "CPU", name: "Intel Core i9-13900K", url: "https://ark.intel.com/content/www/us/en/ark/products/230496/intel-core-i913900k-processor-36m-cache-up-to-5-80-ghz.html" },
            { type: "Memory", name: "128GB (4 x Team T-FORCE ZEUS 32GB) DDR4-3200", url: "https://www.teamgroupinc.com/en/product/zeus-ddr4" },
            { type: "Storage", name: "2x Rocket NVMe 4.0 SSD 2TB in RAID 0", url: "https://sabrent.com/products/sb-rocket-nvme4-2tb" },
            { type: "Video Card", name: "Dell GeForce RTX 3090" },
            { type: "Operating System", name: "Windows 11 Pro 64-bit" },
            { type: "Monitor", name: "2x V7 L27HAS2K-2NR and 27\" ViewFinity S60UA", url: "https://www.v7world.com/us/27-2k-qhd-2560x1440-ads-led-monitor.html" },
            { type: "Mouse", name: "Kensington Expert Mouse® Wired Trackball", url: "https://www.kensington.com/p/products/electronic-control-solutions/trackball-products/expert-mouse-wired-trackball/" },
            { type: "Keyboard", name: "Everest Max", url: "https://mountainggshop.com/products/everest-max" },
            { type: "Headphones", name: "SteelSeries Arctis Nova Pro", url: "https://steelseries.com/gaming-headsets/arctis-nova-pro-wireless-xbox-pc" },
            { type: "Webcam", name: "Logitech 4K Pro Webcam", url: "https://www.logitech.com/en-us/products/webcams/4kprowebcam.960-001390.html" },
            { type: "Wi-Fi/Bluetooth", name: "Intel® Wi-Fi 6E AX210", url: "https://ark.intel.com/content/www/us/en/ark/products/204836/intel-wi-fi-6e-ax210-gig.html" },
            { type: "MIDI Controller", name: "MPK Mini 2", url: "https://www.akaipro.com/mpk-mini-mkii" }
        ]
    },
    {
        name: "Intel® NUC 10 Performance Kit",
        items: [
            { type: "Base", name: "PPNUC10i3FNB", url: "https://ark.intel.com/content/www/us/en/ark/products/195503/intel-nuc-10-performance-kit-nuc10i3fnk.html" },
            { type: "Memory", name: "8GB (2 x Crucial 4GB DDR4-2400 SODIMM)", url: "https://www.crucial.com/memory/ddr4/ct4g4sfs824a" },
            { type: "Storage", name: "128GB Intel SSD 760p" }
        ]
    },
    {
        name: "Intel® NUC Kit NUC6i7KYK",
        items: [
            { type: "Base", name: "NUC6i7KYK", url: "https://ark.intel.com/content/www/us/en/ark/products/89187/intel-nuc-kit-nuc6i7kyk.html" },
            { type: "Memory", name: "8GB (2 x Crucial 4GB DDR4-2400 SODIMM)", url: "https://www.crucial.com/memory/ddr4/ct4g4sfs824a" },
            { type: "Storage", name: "128GB M.2 SSD 830S", url: "https://www.transcend-info.com/Products/No-982" }
        ]
    },
    {
        name: "Lenovo ThinkPad X1 Yoga Gen 8",
        items: [
            { type: "Base", name: "ThinkPad X1 Yoga Gen 8 (14\" Intel)", url: "https://www.lenovo.com/us/en/p/laptops/thinkpad/thinkpadx1/thinkpad-x1-yoga-gen-8-(14-inch-intel)/" },
            { type: "CPU", name: "Intel Core i7-1370P", url: "https://ark.intel.com/content/www/us/en/ark/products/232146/intel-core-i71370p-processor-24m-cache-up-to-5-20-ghz.html" },
            { type: "Memory", name: "64GB LPDDR5X 5200MHz" },
            { type: "Screen", name: "14\" WQUXGA OLED (3840 x 2400) HDR400, touchscreen" },
            { type: "Storage", name: "1TB NVMe" }
        ]
    }
];

export const servers = [
    {
        name: "Home Server",
        items: [
            { type: "Base", name: "HP Z8 G4 Workstation", url: "https://support.hp.com/us-en/product/details/hp-z8-g4-workstation/2399192" },
            { type: "CPU", name: "2x Intel® Xeon® Silver 4108", url: "https://ark.intel.com/content/www/us/en/ark/products/123544/intel-xeon-silver-4108-processor-11m-cache-1-80-ghz.html" },
            { type: "Memory", name: "216GB DDR4-2400 ECC RDIMM" },
            { type: "Storage (NVMe)", name: "4x Samsung 970 EVO Plus 1TB, 2x WDC PC SN730 1TB, 2x Samsung PM981 1TB, Samsung PM981a 1TB, Samsung PM9A1 1TB, Samsung 960 EVO 1TB, Samsung PM981 256GB" },
            { type: "Storage (SATA)", name: "2x Micron 1100 1TB, Samsung PM871b 1TB, Crucial MX500 1TB" },
            { type: "Storage (HDD)", name: "Toshiba Enterprise 18TB, Seagate IronWolf Pro 20TB" },
            { type: "AI Accelerator", name: "Qualcomm Cloud AI 100", url: "https://www.qualcomm.com/products/technology/processors/cloud-artificial-intelligence/cloud-ai-100" },
            { type: "Video Card", name: "MSI GeForce RTX 2060 SUPER VENTUS, NVIDIA GeForce GTX 1080" },
            { type: "Operating System", name: "Proxmox Virtual Environment 9.1", url: "https://www.proxmox.com/en/proxmox-ve" }
        ]
    }
];
