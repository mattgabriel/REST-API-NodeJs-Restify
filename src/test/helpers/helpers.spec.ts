import { expect } from "chai";
import "mocha";


/**
 *
 * Random class
 *
 */
import { Random } from "../../helpers/random";

describe("Random helper", () => {
	it("string() should return a random n-character string", () => {
		const result1 = Random.string(5);
		expect(result1).to.have.length(5);
		const result2 = Random.string(-5);
		expect(result2).to.have.length(0);
		const result3 = Random.string(5000);
		expect(result3).to.have.length(5000);
	});

	it("number() should return a random n-digit number", () => {
		const result1 = Random.number(1);
		expect(result1).to.be.above(-1);
		expect(result1).to.be.below(10);
		const result2 = Random.number(5);
		expect(result2).to.be.above(9999);
		expect(result2).to.be.below(100000);
		const result3 = Random.number(10);
		expect(result3).to.be.above(999999999);
		expect(result3).to.be.below(10000000000);
	});
});


/**
 *
 * Dates class
 *
 */
import { Dates } from "../../helpers/dates";

describe("Dates helper", () => {
	it("now() should return a date string", () => {
		const result = Dates.now();
		expect(result).to.match(/^\d+\/\d+\/\d+, \d+:\d+:\d+/);
	});

	it("nowPlusSeconds() should return a date string", () => {
		const result = Dates.nowPlusSeconds(3600);
		expect(result).to.match(/^\d+\/\d+\/\d+, \d+:\d+:\d+/);
	});

	it("nowUTC() should return a date in seconds since 1970", () => {
		const result = Dates.nowUTC();
		expect(result).to.be.above(1500000000);
		expect(result).to.be.below(2500000000);
	});

	it("nowUTCPlusSeconds() should return a date in seconds since 1970", () => {
		const result = Dates.nowUTC();
		expect(result).to.be.above(1500000000);
		expect(result).to.be.below(2500000000);
	});
});


/**
 *
 * ApiError class
 *
 */
import { ApiError, ErrorMsg, ErrorCode } from "../../helpers/apiErrors";
import * as errors from "restify-errors";

describe("ApiError", () => {
	it("should return an instance of restify-errors", () => {
		const result = ApiError.httpResponse(ErrorMsg.General_DatabaseError, ErrorCode.InternalServerError);
		expect(result).to.be.an.instanceof(errors.InternalServerError);
	});
});

import { FieldValidator } from "../../helpers/fieldValidator";
describe("FieldValidator", () => {
	it("should validate a password", () => {
		expect(FieldValidator.password("")).to.be.eq(false);
		expect(FieldValidator.password("bad")).to.be.eq(false);
		expect(FieldValidator.password("goodPassword")).to.be.eq(true);
		expect(FieldValidator.password("1234_$123goodPassword")).to.be.eq(true);
		expect(FieldValidator.password("ThisPasswordIsTooLongAndItShouldFailBecauseTheMaxLengthIs50")).to.be.eq(false);
	});

	it("should validate an email address", () => {
		expect(FieldValidator.email("")).to.be.eq(false);
		expect(FieldValidator.email("a@")).to.be.eq(false);
		expect(FieldValidator.email("a@err")).to.be.eq(false);
		expect(FieldValidator.email("a@err.")).to.be.eq(false);
		expect(FieldValidator.email("a@err.com")).to.be.eq(true);
		expect(FieldValidator.email("a. bad@err.com")).to.be.eq(false);
		expect(FieldValidator.email("a.name@sub.domain.com")).to.be.eq(true);
		expect(FieldValidator.email("a.long.name_suranme@sub.domain.co.uk")).to.be.eq(true);
		expect(FieldValidator.email("a.special.ß.char@domain.com")).to.be.eq(true);
		expect(FieldValidator.email("a.special.áàâåäã.char@domain.com")).to.be.eq(true);
	});
});




