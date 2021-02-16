import parsePhoneNumberFromString from 'https://unpkg.com/libphonenumber-js@1.9.8/min/index.js'

/**
 * Results from @see formatPhone.
 */
interface PhoneResults {
    /**
     * A phone number formatted according to E.123.
     */
    display: string;
    /**
     * A phone number made as a 'tel' link.
     */
    link: string;
}

/**
 * Format a phone number.
 * @param tel The phone number to format.
 */
export function formatPhone(tel: string): PhoneResults | null {
    const phoneNumber = parsePhoneNumberFromString(tel, "US");
    if (phoneNumber && phoneNumber.isPossible()) {
        return {
            display: phoneNumber.formatInternational(),
            link: phoneNumber.getURI()
        };
    }
    return null;
}

type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
const monthName = {
    1: "January",
    2: "Febuary",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "Novembeer",
    12: "December"
};

const dayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

function convert(nb: number): string {
    const nbString = nb.toString();
    const nMod100 = nb % 100;

    if (nMod100 >= 11 && nMod100 <= 13) {
        return nbString + "th";
    }

    switch (nb % 10) {
        case 1:
            return nbString + "st";
        case 2:
            return nbString + "nd";
        case 3:
            return nbString + "rd";
        default:
            return nbString + "th";
    }
}

/**
 * Formats a ISO-8601 date.
 *
 * @param dt ISO-8601 date
 */
export function formatDateTime(dt: string): string {
    if (/^\d{4}$/.test(dt)) {
        return dt;
    }
    const monthYearMatch = /^(\d{4})\-(\d{2})$/.exec(dt);
    if (monthYearMatch !== null) {
        return monthName[parseInt(monthYearMatch[2], 10) as MonthNumber] + ", " + monthYearMatch[1];
    }
    const fullDate = /^(\d{4})\-(\d{2})-(\d{2})$/.exec(dt);
    if (fullDate) {
        const fd = new Date(parseInt(fullDate[3], 10), parseInt(fullDate[2], 10), parseInt(fullDate[1], 10));
        return dayName[fd.getDay()] + ", " + monthName[fd.getMonth() + 1 as MonthNumber] + convert(fd.getDate()) + ", " + fd.getFullYear();
    }
    throw new Error("Unsupported DateTime string");
}