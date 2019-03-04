import { serialize, serializeAs, deserialize, deserializeAs, inheritSerialization } from "cerialize";

class Basics {
	@serialize @deserialize private userId?: string;
	@serialize @deserialize private email?: string;
	@serialize @deserialize private username?: string;
	@serialize @deserialize private firstName?: string;
	@serialize @deserialize private lastName?: string;
	@serialize @deserialize private language: UserLanguage = UserLanguage.en;

	set _userId(userId: string) {
		this.userId = userId;
	}
	get _userId(): string {
		return this.userId as string;
	}

	set _email(email: string) {
		this.email = email.trim().toLowerCase();
	}
	get _email(): string {
		return this.email as string;
	}

	set _firstName(firstName: string) {
		this.firstName = firstName;
	}
	get _firstName(): string {
		return this.firstName as string;
	}

	set _lastName(lastName: string) {
		this.lastName = lastName;
	}
	get _lastName(): string {
		return this.lastName as string;
	}

	set _username(username: string) {
		this.username = username;
	}
	get _username(): string {
		return this.username as string;
	}

	set _language(language: UserLanguage) {
		this.language = language;
	}
	get _language(): UserLanguage {
		return this.language;
	}
}

export class CropCoordinates {
	@serialize @deserialize private x: number;
	@serialize @deserialize private y: number;
	@serialize @deserialize private w: number;
	@serialize @deserialize private h: number;

	constructor(x: number, y: number, w: number, h: number) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	get _x(): number {
		return this.x;
	}
	get _y(): number {
		return this.y;
	}
	get _w(): number {
		return this.w;
	}
	get _h(): number {
		return this.h;
	}
}

export class ImagePaths {
	@serialize @deserialize private original?: string;
	@serialize @deserialize private x1?: string;
	@serialize @deserialize private x2?: string;
	@serialize @deserialize private x3?: string;
	@serializeAs(CropCoordinates) @deserializeAs(CropCoordinates) private cropCoordinates?: CropCoordinates;

	set _original(original: string) {
		this.original = original;
	}
	get _original(): string {
		return this.original!;
	}

	set _x1(x1: string) {
		this.x1 = x1;
	}
	get _x1(): string {
		return this.x1!;
	}

	set _x2(x2: string) {
		this.x2 = x2;
	}
	get _x2(): string {
		return this.x2!;
	}

	set _x3(x3: string) {
		this.x3 = x3;
	}
	get _x3(): string {
		return this.x3!;
	}

	set _cropCoordinates(cropCoordinates: CropCoordinates) {
		this.cropCoordinates = cropCoordinates;
	}
	get _cropCoordinates(): CropCoordinates {
		return this.cropCoordinates!;
	}
}

class Images {
	@serializeAs(ImagePaths) @deserializeAs(ImagePaths) private profilePhoto: ImagePaths = new ImagePaths();

	set _profilePhoto(profilePhoto: ImagePaths) {
		this.profilePhoto = profilePhoto;
	}
	get _profilePhoto(): ImagePaths {
		return this.profilePhoto;
	}
}

class Notifications {
	@serialize @deserialize private newsletter: boolean = true;

	set _newsletter(newsletter: boolean) {
		this.newsletter = newsletter;
	}
	get _newsletter(): boolean {
		return this.newsletter;
	}
}

class Subscription {
	@serialize @deserialize public type: string;
	@serializeAs(Date) @deserializeAs(Date) public startDate: Date;
	@serializeAs(Date) @deserializeAs(Date) public endDate: Date;

	constructor(type: string, startDate: Date, endDate: Date) {
		this.type = type;
		this.startDate = startDate;
		this.endDate = endDate;
	}
}

// class Access {
// 	@serialize @deserialize private roleName?: string;
// 	@serialize @deserialize private roleId?: number;
// 	@serializeAs(Subscription) @deserializeAs(Subscription) private subscriptions?: [Subscription];

// 	set _roleName(roleName: string) {
// 		this.roleName = roleName;
// 		this.roleId = UserRoles.getRoleId(roleName);
// 	}
// 	get _roleName(): string {
// 		return this.roleName as string;
// 	}

// 	set _roleId(roleId: number) {
// 		this.roleId = roleId;
// 		this.roleName = UserRoles.getRoleName(roleId);
// 	}
// 	get _roleId(): number {
// 		return this.roleId as number;
// 	}
// }

/**
 *
 * Types
 *
 */

export enum UserRoles {
	type1 = 100,
	type2 = 200
}

export class UserRole {
	static getRole(role: string): UserRoles {
		switch (role) {
			case "type1":
			default:
				return UserRoles.type1;
			case "type2":
				return UserRoles.type2;
		}
	}
}

export enum UserLanguage {
	en = "en",
	de = "de"
}

/**
 *
 * This is the only class you will ever need to set and get user
 * details. It contains pretty much everything we know about a user
 *
 */
export class User {

	@serializeAs(Basics) @deserializeAs(Basics) public basics: Basics = new Basics();
	@serializeAs(Images) @deserializeAs(Images) public images: Images = new Images();
	// @serializeAs(Access) @deserializeAs(Access) public access: Access = new Access();
	@serializeAs(Notifications) @deserializeAs(Notifications) public notifications: Notifications = new Notifications();
}
