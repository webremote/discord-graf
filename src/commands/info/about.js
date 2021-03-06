'use babel';
'use strict';

import { version } from '../..';
import { stripIndents } from 'common-tags';
import Command from '../command';

export default class AboutCommand extends Command {
	constructor(bot) {
		super(bot, {
			name: 'about',
			module: 'info',
			memberName: 'about',
			description: 'Displays information about the bot.'
		});
	}

	async run(message) {
		const client = message.client;
		const config = this.bot.config.values;
		const owner = client.users.get(this.bot.config.values.owner);
		const guilds = client.guilds.size.toLocaleString(), users = client.users.size.toLocaleString();
		const guildsLabel = client.guilds.size !== 1 ? 'servers' : 'server', usersLabel = client.users.size !== 1 ? 'users' : 'user';
		const uptime = process.uptime();
		const days = Math.floor(uptime / 60 / 60 / 24), hours = Math.floor(uptime / 60 / 60 % 24), minutes = Math.floor(uptime / 60 % 60);
		const daysLabel = days !== 1 ? 'days' : 'day', hoursLabel = hours !== 1 ? 'hours' : 'hour', minutesLabel = minutes !== 1 ? 'minutes' : 'minute';
		const daysStr = `${days.toLocaleString()} ${daysLabel}`, hoursStr = `${hours.toLocaleString()} ${hoursLabel}`, minutesStr = `${minutes.toLocaleString()} ${minutesLabel}`;
		return {
			direct: stripIndents`
				${config.about || ''}

				This bot ${owner ? `is owned by ${owner.username}#${owner.discriminator}, and ` : ''}this shard is serving ${guilds} ${guildsLabel} with ${users} loaded ${usersLabel}.
				It has been running without interruption for ${days > 0 ? `${daysStr} ` : ''}${hours > 0 ? `${hoursStr} ` : ''}${minutesStr}.
				${config.invite ? `For bot feedback/help, use this invite: ${config.invite}` : ''}

				Based on Discord GRAF v${version}: https://github.com/Gawdl3y/discord-graf
			`,
			reply: 'Sent a DM to you with information.'
		};
	}
}
