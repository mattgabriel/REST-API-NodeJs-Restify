export class FieldValidator {

	/**
	 *
	 * The password needs to be:
	 * 	- between 8 and 50 characters long
	 */
	static password(str: string): boolean {
		if (Validator.lengthBetween(str, 8, 50)) {
			return true;
		}
		return false;
	}

	static email(str: string): boolean {
		if (str.length == 0 || str.length >= 50) return false;
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
		return re.test(str);
	}

	static username(str: string): boolean {
		if (str.length == 0) return false;
		const re = /^[a-zA-Z]{1}[\w.-]{3,15}$/;
		return re.test(str.toLowerCase());
	}

	/*
	  Helps validating parameters such as gender, position, language, ...
	 */
	static existsInEnum(value: string, enumToCheck: any): boolean {
		for (const key in enumToCheck) {
			if (value === enumToCheck[key]) {
				return true;
			}
		}
		return false;
	}

	static stringLengthBetween(str: string, min: number, max: number): boolean {
		if (Validator.lengthBetween(str, min, max)) return true;
		return false;
	}

	static yyyymmdd(str: string): boolean {
		const re = /^\d{4}-\d{2}-\d{2}$/;
		if (!str.match(re)) return false;
		return true;
	}
}


class Validator {

	static lengthBetween(str: string, minLength: number, maxLength: number): boolean {
		if ( str.length >= minLength && str.length <= maxLength ) {
			return true;
		}
		return false;
	}
}
