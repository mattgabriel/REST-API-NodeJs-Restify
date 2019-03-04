import * as moment from "moment";

export class Dates {

	static now(): string {
		return Dates.formatDate(new Date(Date.now()));
	}

	// Server date should have been set to UTC for this to be valid
	static nowUTC(): number {
		return Math.floor(Date.now() / 1000);
	}

	static nowPlusSeconds(numberOFSeconds: number): string {
		let timeObject = new Date();
		timeObject = new Date(timeObject.getTime() + 1000 * numberOFSeconds);
		return Dates.formatDate(timeObject);
	}

	static nowUTCPlusSeconds(numberOfSeconds: number): number {
		return Math.floor((Date.now() + numberOfSeconds) / 1000);
	}

	/* We want dates formatted like: yyyy/mm/dd, hh:mm:ss */
	static formatDate(date: Date): string {
		return this.formatDateString(date.toISOString());
	}

	static formatDateString(date: String): string {
		return date
			.replace(/T/, ", ")
			.replace(/\..+/, "")
			.replace(/-/g, "/");
	}

	// strFormat example: YYYY-MM-DD
	static dateFromattedAs(date: Date, strFormat: string): string {
		return moment(date).format(strFormat);
	}

	// strFormat example: YYYY-MM-DD
	static daysAgo(days: number, strFormat: string): string {
		return moment.utc().subtract(days, "days").format(strFormat);
	}

	// strFormat example: YYYY-MM-DD
	static monthsAgo(months: number, strFormat: string): string {
		return moment.utc().subtract(months, "months").format(strFormat);
	}

	static endOfThisMonthUTC(): number {
		return moment.utc().endOf("month").unix();
	}

	static startOfThisMonthUTC(): number {
		return moment.utc().startOf("month").unix();
	}

	static endOfLastMonthUTC(): number {
		return moment.utc().subtract(1, "month").endOf("month").unix();
	}

	static startOfLastMonthUTC(): number {
		return moment.utc().subtract(1, "month").startOf("month").unix();
	}

	static endOfThisWeekUTC(): number {
		return moment.utc().endOf("week").unix();
	}

	static startOfThisWeekUTC(): number {
		return moment.utc().startOf("week").unix();
	}

	static endOfLastWeekUTC(): number {
		return moment.utc().subtract(1, "week").endOf("week").unix();
	}

	static startOfLastWeekUTC(): number {
		return moment.utc().subtract(1, "week").startOf("week").unix();
	}

	static startOfTrackticsUTC(): number {
		return 1420070400;
	}
}