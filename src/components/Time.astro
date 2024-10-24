---
import { dateTime } from "../content/config.ts";

export class IsoDateTime {
    /// The ISO date time string.
    /// `YYYY-MM-DDTHH:MM:SS([+-]HH:MM|Z)`
    #string: string;
    /// The named time zone.
    /// Any member of `Intl.supportedValuesOf('timeZone')`.
    #timeZone: string;

    constructor(isoDateString: string, timeZone: string) {
        // Will error if incorrectly formatted.
        // Does this guarantee that there *will* be an offset or that there *will* be a time?
        dateTime.parse({ iso: isoDateString, timeZone });

        this.#string = isoDateString;
        this.#timeZone = timeZone;
    }

    /// The time and timezone offset portion of the datetime.
    /// Ex. `"2024-10-18T17:54:00-07:00"` => `"17:54:00-07:00"`.
    getTimeWithOffset(): string {
        // `!`: Constructor validates that it is present.
        return this.#string.split("T", 2)[1]!;
    }

    /// The date portion of the datetime.
    /// Ex. `"2024-10-18T17:54:00-07:00"` => `"2024-10-18"`.
    getDate(): string {
        // `!`: Constructor validates that it is present.
        return this.#string.split("T", 1)[0]!;
    }

    /// The year portion of the datetime.
    /// Ex. `"2024-10-18T17:54:00-07:00"` => `"2024"`.
    getYear(): number {
        return parseInt(this.#string.slice(0, 4));
    }

    /// Get the timezone offset portion of the datetime.
    /// Ex. `"2024-10-18T17:54:00-07:00"` => `"-07:00"`.
    getOffset(): string {
        const time = this.getTimeWithOffset();
        // Ex. `"17:54:00-07:00"` => `"07:00"`.
        const offset = time.split(/[-+]/, 2)[1];

        // `Z` is present instead of a numerical offset, indicates UTC.
        if (!offset) {
            return "Z";
        }

        // Ex. `"17:54:00-07:00"` => `"-"`.
        const sign = time[time.search(/[-+]/)]!;

        return `${sign}${offset}`;
    }

    /// Compare whether this datetimes shares the same date as another datetime.
    ///
    /// Not timezone aware!
    ///
    /// Ex.
    /// - `2024-10-20T10:30Z` and `2024-10-20T15:22Z` will return `true`
    /// - `2024-10-20T10:30Z` and `2023-10-20T10:30Z` will return `false`
    sameDay(date: IsoDateTime): boolean {
        return this.getDate() === date.getDate();
    }

    /// Format a datetime as either:
    /// - A date and time: `"on October 18"`
    /// - A date: `"on Fri, October 18, 2024 at 5:53 PM PDT"`
    /// - Just the hours: `"at 5:53 PM PDT"`
    format(type: "dateTime" | "date" | "hour"): string {
        const locale = "en-US";

        // Ex. `"Fri, October 18, 2024 at 5:53 PM PDT"`
        const long_options: Intl.DateTimeFormatOptions = {
            month: "long",
            day: "numeric",
            weekday: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            timeZoneName: "short",
            timeZone: this.#timeZone,
        };

        const short_date_options: Intl.DateTimeFormatOptions = {
            month: "long",
            day: "numeric",
            timeZone: this.#timeZone,
        };

        // Ex. `"5:54 PM"`
        const hour_options: Intl.DateTimeFormatOptions = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            timeZoneName: "short",
            timeZone: this.#timeZone,
        };

        switch (type) {
            case "date":
                return `on ${this.asDate().toLocaleString(locale, short_date_options)}`;
            case "dateTime":
                return `on ${this.asDate().toLocaleString(locale, long_options)}`;
            case "hour":
                return `at ${this.asDate().toLocaleString(locale, hour_options)}`;
        }
    }

    /// Formats it with `Date.toLocaleString()`.
    /// Injects the embedded time zone into `options` if `options.timeZone` is not already set.
    toLocaleString(locale: string, options: Intl.DateTimeFormatOptions) {
        if (!options.timeZone) options.timeZone = this.#timeZone;

        return this.asDate().toLocaleString(locale, options);
    }

    /// Returns a representation as a `Date` object.
    /// This does not include any time zone data.
    asDate(): Date {
        return new Date(this.#string);
    }

    toString(): string {
        return this.#string;
    }
}
---
