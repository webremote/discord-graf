'use babel';
'use strict';

import Module from '../commands/module';

/** Contains methods to test whether a user has permissions in a guild */
export default class BotPermissions {
	/**
	 * @param {Client} client - The Client to use
	 * @param {ModRoleStorage} modRoles - The mod role storage to use
	 * @param {SettingStorage} settings - The setting storage to use
	 * @param {BotConfig} config - The bot config to use
	 */
	constructor(client, modRoles, settings, config) {
		if(!client || !modRoles || !settings || !config) throw new Error('A client, modRoles, settings, and config must be specified.');

		/** @type {Client} */
		this.client = client;
		/** @type {ModRoleStorage} */
		this.modRoles = modRoles;
		/** @type {SettingStorage} */
		this.settings = settings;
		/** @type {BotConfig} */
		this.config = config;
	}

	/**
	 * @param {Guild|string} guild - The Guild or the guild ID
	 * @param {User|string} user - The User or the user ID
	 * @return {boolean} Whether or not the user is considered a moderator
	 * @see {@link Permissions.isMod}
	 */
	isMod(guild, user) {
		return this.constructor.isMod(this.client, this.modRoles, this.settings, this.config, guild, user);
	}

	/**
	 * Tests to see if a user is a moderator on a guild using a specified client and config.
	 * If the guild has not set any moderator roles, then they will be a moderator if any of their assigned roles contain the "Manage messages" permission.
	 * If the guild has set moderator roles, then they will be a moderator if they have any of the moderator roles assigned.
	 * The bot owner and users with the "Administrate" permission are always moderators.
	 * @param {Client} client - The Client to use
	 * @param {ModRoleStorage} modRoles - The mod role storage to use
	 * @param {SettingStorage} settings - The setting storage to use
	 * @param {BotConfig} config - The bot config to use
	 * @param {Guild|string} guild - The Guild or the guild ID
	 * @param {User|string} user - The User or the user ID
	 * @return {boolean} Whether or not the user is considered a moderator
	 * @see {@link Permissions#isMod}
	 */
	static isMod(client, modRoles, settings, config, guild, user) {
		[guild, user] = this.resolve(client, guild, user);
		if(user.id === config.values.owner) return true;
		const userRoles = guild.rolesOfUser(user);
		if(userRoles.some(role => role.hasPermission('administrator'))) return true;
		if(!Module.isEnabled(settings, guild, 'mod-roles') || modRoles.isEmpty(guild)) return userRoles.some(role => role.hasPermission('manageMessages'));
		return modRoles.find(guild).some(role => userRoles.some(role2 => role.id === role2.id));
	}

	/**
	 * @param {Guild|string} guild - The Guild or the guild ID
	 * @param {User|string} user - The User or the user ID
	 * @return {boolean} Whether or not the user is considered an administrator
	 * @see {@link Permissions.isAdmin}
	 */
	isAdmin(guild, user) {
		return this.constructor.isAdmin(this.client, this.config, guild, user);
	}

	/**
	 * Tests to see if a user is an administrator on a guild with a specified client.
	 * If the user is the bot owner or has any roles assigned with the "Administrate" permission, they are considered an administrator.
	 * @param {Client} client - The Client to use
	 * @param {BotConfig} config - The bot config to use
	 * @param {Guild|string} guild - The Guild or the guild ID
	 * @param {User|string} user - The User or the user ID
	 * @return {boolean} Whether or not the user is considered an administrator
	 * @see {@link Permissions#isAdmin}
	 */
	static isAdmin(client, config, guild, user) {
		[guild, user] = this.resolve(client, guild, user);
		if(user.id === config.values.owner) return true;
		return guild.rolesOfUser(user).some(role => role.hasPermission('administrator'));
	}

	/**
	 * @param {User|string} user - The User or the user ID
	 * @return {boolean} Whether or not the user is the bot owner
	 * @see {@link Permissions.isOwner}
	 */
	isOwner(user) {
		return this.constructor.isOwner(this.config, user);
	}

	/**
	 * Tests to see if a user is the owner of the bot
	 * @param {BotConfig} config - The bot config to use
	 * @param {User|string} user - The User or the user ID
	 * @return {boolean} Whether or not the user is the bot owner
	 * @see {@link Permissions#isOwner}
	 */
	static isOwner(config, user) {
		if(!user) throw new Error('A user must be specified.');
		return (user.id ? user.id : user) === config.values.owner;
	}

	/**
	 * @param {Guild|string} guild - The Guild or the guild ID
	 * @param {User|string} user - The User or the user ID
	 * @return {[guild, user]} The Guild and User instance pair
	 * @see {@link Permissions.resolve}
	 */
	resolve(guild, user) {
		if(!guild || !user) throw new Error('A guild and user must be specified.');
		return this.constructor.resolve(this.client, guild, user);
	}

	/**
	 * Resolves a guild and user to Discord.js instances with a specified client
	 * @param {Client} client - The Client to use
	 * @param {Guild|string} guild - The Guild or the guild ID
	 * @param {User|string} user - The User or the user ID
	 * @return {[guild, user]} The Guild and User instance pair
	 * @see {@link Permissions#resolve}
	 */
	static resolve(client, guild, user) {
		if(!client || !guild || !user) throw new Error('A client, guild, and user must be specified.');
		if(typeof guild === 'string') guild = client.guilds.get(guild);
		if(!guild || !guild.id) throw new Error('Unable to identify guild.');
		if(typeof user === 'string') user = guild.members.get(user);
		if(!user || !user.id) throw new Error('Unable to identify user.');
		return [guild, user];
	}
}
