

export class Random {

	static string(length: number): string {
		const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let result = "";
		for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}

	static stringWithoutNumbers(length: number): string {
		const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let result = "";
		for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}

	static number(length: number): number {
		const min = 10 ** (length - 1);
		const max = 10 ** (length) - 1 - min;
		return Math.floor(Math.random() * max) + min;
	}

}
