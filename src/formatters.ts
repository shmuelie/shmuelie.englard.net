import parsePhoneNumberFromString from 'https://unpkg.com/libphonenumber-js@1.9.8/min/index.js'
import { Month, LocalDate, DateTimeFormatter } from 'https://unpkg.com/@js-joda/core@3.2.0/dist/js-joda.esm.js'

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
        const monthName = Month.of(parseInt(monthYearMatch[2], 10)).name();
        return monthName.substr(0, 1).toUpperCase() + monthName.substr(1).toLowerCase() + ", " + monthYearMatch[1];
    }
    const localDateFormat = "eeee, MMMM dd, yyyy";
    if (/^\d{4}\-\d{2}-\d{2}$/.test(dt)) {
        return LocalDate.parse(dt).format(DateTimeFormatter.ofPattern(localDateFormat));
    }
    throw new Error("Unsupported DateTime string");
}