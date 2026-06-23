import { z as zod } from "astro/zod";
import { rawDateTime } from "~/content.config.ts";

/**
 * Construct a new {@link IsoDateTime} from a raw result from Zod.
 *
 * @remarks
 *
 * It is safe to use `!` on this if you are certain you have valid, defined input.
 *
 * @param maybeRawDateTime - A {@link rawDateTime | date time from Zod} or `undefined`.
 *
 * @returns
 *
 * If provided `undefined`, it will return `undefined`.
 * Otherwise, it will return an {@link IsoDateTime}
 */
export function isoOrUndefined(
    maybeRawDateTime?: zod.infer<typeof rawDateTime>,
): IsoDateTime | undefined {
    if (!maybeRawDateTime) {
        return;
    }

    return new IsoDateTime(maybeRawDateTime.iso, maybeRawDateTime.timeZone);
}

/**
 * Stores a date time in a time zone-aware manner.
 *
 * @remarks
 *
 * Internally, it stores an {@link https://en.wikipedia.org/wiki/ISO_8601 | ISO-8601} string with a time and offset,
 * and a time zone string.
 *
 * The time zone is any member of {@link Intl.supportedValuesOf | `Intl.supportedValuesOf('timeZone')`}.
 */
export class IsoDateTime {
    /**
     * The ISO date time string.
     *
     * @remarks
     *
     * Formatted like so: `YYYY-MM-DDTHH:MM:SS([+-]HH:MM|Z)`.
     */
    #iso: string;
    /**
     * The named time zone.
     *
     * @remarks
     *
     * Any member of {@link Intl.supportedValuesOf | `Intl.supportedValuesOf('timeZone')`}.
     */
    #timeZone: string;

    /**
     * Constructions a new {@link IsoDateTime}.
     *
     * @param timeZone - Any member of {@link Intl.supportedValuesOf | `Intl.supportedValuesOf('timeZone')`}.
     * @param isoDateString - An ISO-8601 date time string: `YYYY-MM-DDTHH:MM:SS([+-]HH:MM|Z)`.
     *
     * @throws {@link ZodError}
     * Throws if provided an invalid format, as determined by {@link rawDateTime.parse}.
     */
    constructor(isoDateString: string, timeZone: string) {
        // Will error if incorrectly formatted.
        // Does this guarantee that there *will* be an offset or that there *will* be a time?
        rawDateTime.parse({ iso: isoDateString, timeZone });

        this.#iso = isoDateString;
        this.#timeZone = timeZone;
    }

    /**
     * The time and timezone offset portion of the date time.
     *
     * @remarks
     *
     * Ex. `"2024-10-18T17:54:00-07:00"` => `"17:54:00-07:00"`.
     *
     * @returns The portion of the ISO-8601 string following the `T`.
     */
    getTimeWithOffset(): string {
        // `!`: Constructor validates that it is present.
        return this.#iso.split("T", 2)[1]!;
    }

    /**
     * The date portion of the date time.
     *
     * @remarks
     *
     * Ex. `"2024-10-18T17:54:00-07:00"` => `"2024-10-18"`.
     *
     * @returns The portion of the ISO-8601 string preceding the `T`.
     */
    getDate(): string {
        // `!`: Constructor validates that it is present.
        return this.#iso.split("T", 1)[0]!;
    }

    /**
     * The year portion of the date time.
     *
     * @remarks
     *
     * Ex. `"2024-10-18T17:54:00-07:00"` => `"2024"`.
     *
     * @returns The portion of the ISO-8601 string preceding the first `-`.
     */
    getYear(): number {
        return parseInt(this.#iso.slice(0, 4));
    }

    /**
     * The time zone offset portion of the date time.
     *
     * @remarks
     *
     * Ex. `"2024-10-18T17:54:00-07:00"` => `"-07:00"`.
     * Ex. `"2024-10-18T17:54:00Z"` => `"Z"`.
     *
     * @returns The portion of the ISO-8601 string following the `HH:MM:SS`.
     */
    getOffset(): string {
        const time = this.getTimeWithOffset();
        // Ex. `"17:54:00-07:00"` => `"07:00"`.
        const offset = time.split(/[-+]/, 2)[1];

        // `Z` is present instead of a numerical offset (indicates UTC).
        if (!offset) {
            return "Z";
        }

        // Ex. `"17:54:00-07:00"` => `"-"`.
        const sign = time[time.search(/[-+]/)]!;

        return `${sign}${offset}`;
    }

    /**
     * Compare whether this date time shares the same date as another date time.
     *
     * @remarks
     *
     * Not time zone-aware!
     *
     * Ex.
     * - `2024-10-20T10:30Z` and `2024-10-20T15:22Z` will return `true`
     * - `2024-10-20T10:30Z` and `2023-10-20T10:30Z` will return `false`
     *
     * @param date - The date time to compare against.
     * @returns Whether or not the date times share the same date.
     */
    sameDay(date: IsoDateTime): boolean {
        return this.getDate() === date.getDate();
    }

    /**
     * Format a date time for presentation.
     *
     * @remarks
     *
     * Format a date time as either:
     * - A date and time: `"on Fri, October 18, 2024 at 5:53 PM PDT"`
     * - A date: `"on October 18"`
     * - An American-style `mm/dd/yyyy` numeric date: `"on 4/18/2024"`
     * - Just the hours: `"at 5:53 PM PDT"`
     *
     * Uses the `"en-US"` {@link Intl.UnicodeBCP47LocaleIdentifier | locale}.
     *
     * @param type - The style of formatting to use.
     * @returns The formatted date time.
     */
    format(type: "dateTime" | "date" | "hour" | "usNumeric"): string {
        const fmt = (options: Intl.DateTimeFormatOptions, preposition: string = "on"): string => {
            return `${preposition} ${this.toLocaleString("en-US", options)}`;
        };

        /** Ex. `"Fri, October 18, 2024 at 5:53 PM PDT"` */
        const long_options: Intl.DateTimeFormatOptions = {
            month: "long",
            day: "numeric",
            weekday: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            timeZoneName: "short",
        };

        /** Ex. `"October 18"` */
        const short_date_options: Intl.DateTimeFormatOptions = {
            month: "long",
            day: "numeric",
        };

        /** Ex. `"5:54 PM"` */
        const hour_options: Intl.DateTimeFormatOptions = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            timeZoneName: "short",
        };

        /** Ex. `"4/18/2024"` */
        const us_numeric_options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        };

        switch (type) {
            case "dateTime":
                return fmt(long_options);
            case "date":
                return fmt(short_date_options);
            case "hour":
                return fmt(hour_options, "at");
            case "usNumeric":
                return fmt(us_numeric_options);
        }
    }

    /**
     * Directly format the date time with {@link Date.toLocaleString}.
     *
     * @remarks
     *
     * Defaults to using the embedded time zone if `options` if `options.timeZone` is not already
     * set.
     *
     * @param locale - The {@link Intl.UnicodeBCP47LocaleIdentifier | locale} to format the date with.
     * @param options - The {@link Intl.DateTimeFormatOptions | options} to format the date with.
     * @returns The formatted date.
     */
    toLocaleString(
        locale: Intl.UnicodeBCP47LocaleIdentifier,
        options: Intl.DateTimeFormatOptions,
    ): string {
        if (!options.timeZone) options.timeZone = this.#timeZone;

        return this.toDate().toLocaleString(locale, options);
    }

    /**
     * Convert to a {@link Date}.
     *
     * @remarks
     *
     * This does not include any time zone data.
     *
     * @returns Returns the date time as a {@link Date}.
     */
    toDate(): Date {
        return new Date(this.#iso);
    }

    /**
     * Get the internal ISO-8601 string representation.
     *
     * @remarks
     *
     * Does not include the time zone (does include the offset).
     *
     * @returns The date time formatted like so: `YYYY-MM-DDTHH:MM:SS([+-]HH:MM|Z)`.
     */
    toString(): string {
        return this.#iso;
    }
}
