import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
	statusCode = 400;
	constructor(msg = "Bad request error") {
		super(msg);
	}
}
