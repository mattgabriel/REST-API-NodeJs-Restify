import * as errors from "restify-errors";

/**
 *
 * All async methods should fail with 'throw IError'
 * ie.: throw { errorMsg: ErrorMsg.General_DatabaseError, errorCode: ErrorCode.InternalServerError }
 *
 */
export class Error {
	errorMsg: ErrorMsg;
	errorCode?: ErrorCode;

	constructor(errorMsg: ErrorMsg, errorCode?: ErrorCode) {
		this.errorMsg = errorMsg;
		this.errorCode = errorCode;
	}
}

export const errorHandler = (err: any, fallback: Error): Error => {
	if (err instanceof Error) {
		return new Error(err.errorMsg, err.errorCode || ErrorCode.InternalServerError);
	}
	return new Error(fallback.errorMsg, fallback.errorCode || ErrorCode.InternalServerError);
};

/**
 *
 * All possible error messages that will be returned in the error response
 *
 */
export enum ErrorMsg {

	Null = "",

	// General errors
	General_DatabaseError = "General_DatabaseError",
	General_NotFoundError = "General_NotFound",
	General_InternalServerError = "General_InternalServerError",
	General_MissingRequiredData = "General_MissingRequiredData",
	General_InsufficientPermissions = "General_InsufficientPermissions",
	General_InsufficientParameters = "General_InsufficientParameters",
	General_AccessDenied = "General_AccessDenied",
	General_NothingToDo = "General_NothingToDo",
	General_BadRequest = "General_BadRequest",

	// Authentication errors
	Auth_InvalidToken = "Auth_InvalidToken",
	Auth_MissingToken = "Auth_MissingToken",
	Auth_UnadaptableToken = "Auth_UnadaptableToken",
	Auth_ExpiredToken = "Auth_ExpiredToken",
	Auth_InsufficientParameters = "Auth_InsufficientParameters",
	Auth_InvalidCredentials = "Auth_InvalidCredentials",
	Auth_Forbidden = "Auth_Forbidden",
	Auth_InvalidPassword = "Auth_InvalidPassword",
	Auth_InvalidPasswordFormat = "Auth_InvalidPasswordFormat",
	Auth_InvalidEmailFormat = "Auth_InvalidEmailFormat",

	// User errors
	User_InvalidPasswordLength = "User_InvalidPasswordLength",
	User_InvalidEmailFormat = "User_InvalidEmailFormat",
	User_InvalidUserType = "User_InvalidUserType",
	User_EmailAddressExists = "User_EmailAddressExists",
	User_NotFoundError = "User_NotFoundError",
}


/**
 *
 * Needs to exist in restify-errors
 * Will be returned in the erorr response alongside
 * its corresponding error code (401, 402...)
 *
 */
export enum ErrorCode {
	BadRequestError,
	UnauthorizedError,
	ForbiddenError,
	NotFoundError,
	MethodNotAllowedError,
	InternalServerError,
	ServiceUnavailableError
}


/**
 *
 * ApiError is in charge or building the error responses for you
 * it simply takes restify error code and an error message.
 * when a controller receives a callback with success=false and error=ApiError()
 * it will pass it on to next() return the error response to the client
 *
 */
export class ApiError {

	static httpResponse(message: ErrorMsg, errorCode: ErrorCode): any {

		switch (errorCode) {
			case ErrorCode.BadRequestError:
				return new errors.BadRequestError(message);
			case ErrorCode.UnauthorizedError:
				return new errors.UnauthorizedError(message);
			case ErrorCode.ForbiddenError:
				return new errors.ForbiddenError(message);
			case ErrorCode.NotFoundError:
				return new errors.NotFoundError(message);
			case ErrorCode.MethodNotAllowedError:
				return new errors.MethodNotAllowedError(message);
			case ErrorCode.InternalServerError:
				return new errors.InternalServerError(message);
			case ErrorCode.ServiceUnavailableError:
				return new errors.ServiceUnavailableError(message);
			default:
				return new errors.InternalServerError("Unhandled");
		}
	}

}
