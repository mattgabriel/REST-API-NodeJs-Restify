import * as redis from "redis";
import * as conf from "../config/config";
const compress = require("compress-str");

/*
Singleton class
Usage:
	const redis = Redis.getInstance();
	redis.get("someKey");
*/
export class Redis {

	private client: any;

	constructor() {
		this.client = redis.createClient({host: conf.config.redis.host, port: parseInt(conf.config.redis.port)});
	}

	private static _instance: Redis;
	public static getInstance(): Redis {
		return this._instance || (this._instance = new this());
	}

	public set(key: string, value: string): Promise<boolean> {
		const _this = this;
		return new Promise( async (resolve, reject) => {
			compress.gzip(value, function (err: any, m: string) {
				if (err) {
					return resolve(false);
				} else {
					_this.client.set(key, m, function (err: any, reply: any) {
						if (err) {
							console.log(err);
						}
						return resolve(true);
					});
				}
			});
		});
	}

	// If the key is not found the data variable will be null
	public get(key: string): Promise<{e: boolean, data?: string}> {
		return new Promise( async (resolve, reject) => {
			this.client.get(key, function (err: any, data: any) {
				if (err) return reject({e: true});
				if (!data) return resolve({e: false});
				compress.gunzip(data, function (err: any, n: string) {
					if (err) {
						return reject({e: true});
					} else {
						return resolve({e: false, data: n});
					}
				});
			});
		});
	}

	// Delete a key
	public delete(key: string): Promise<{e: boolean, data?: string}> {
		return new Promise( async (resolve, reject) => {
			this.client.del(key, function (err: any, data: any) {
				if (err) return reject({e: true});
				return resolve({e: false});
			});
		});
	}
}