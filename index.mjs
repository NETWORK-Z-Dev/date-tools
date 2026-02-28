export default class DateTools {
    static formatDate(date) {
        if (!(date instanceof Date)) {
            throw new Error("Invalid date: Please pass a valid Date object.");
        }

        const formatter = new Intl.DateTimeFormat("en-US", {
            month: "long",   // Full month name
            day: "numeric",  // Numeric day
            year: "numeric", // Full year
            hour: "numeric", // Hour
            minute: "numeric", // Minute
            hour12: false     // Use 12-hour format
        });

        let formattedDate = formatter.format(date);

        // Replace "at" with a comma, if present
        return formattedDate.replace(" at ", ", ");
    }

    static getReadableDuration(date) {
        let untilTimestamp = date.getTime();

        const remainingTime = untilTimestamp - Date.now();
        if (remainingTime <= 0) return "Expired";

        const seconds = Math.floor(remainingTime / 1000) % 60;
        const minutes = Math.floor(remainingTime / (1000 * 60)) % 60;
        const hours = Math.floor(remainingTime / (1000 * 60 * 60)) % 24;
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    static getDateFromOffset(offset, customDate = null) {
        if(!offset) throw new Error("No offset provided. Examples: -1 day, +2hours, ...");

        const units = {
            seconds: 1000,
            second: 1000,
            minutes: 1000 * 60,
            minute: 1000 * 60,
            hours: 1000 * 60 * 60,
            hour: 1000 * 60 * 60,
            days: 1000 * 60 * 60 * 24,
            day: 1000 * 60 * 60 * 24,
            months: "months",
            month: "months",
            years: "years",
            year: "years",
            perma: "perma"
        };

        const [amountStr, unit] = offset.split(" ");
        const amount = parseInt(amountStr, 10);

        if (unit === "perma") {
            return new Date("9999-12-31T23:59:59Z");
        }

        if (isNaN(amount) || !units[unit]) {
            throw new Error("Invalid offset format. Use '<number> <unit>' (e.g., '-1 day', '+2 hours').");
        }

        const now =  customDate ? customDate : new Date();

        if (units[unit] === "months") {
            now.setMonth(now.getMonth() + amount);
        } else if (units[unit] === "years") {
            now.setFullYear(now.getFullYear() + amount);
        } else {
            now.setTime(now.getTime() + amount * units[unit]);
        }

        return now;
    }
}