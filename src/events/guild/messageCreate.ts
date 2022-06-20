import { MessageEmbed, Message } from 'discord.js';
import * as githubUtils from '../../utils/github';
import logger from '../../utils/logger';

import('colors');

export default async (message: Message) => {
  if (/#\d+/g.test(message.content)) {
    message.channel.sendTyping();
    const match = message.content.match(/#\d+/g)!; // cannot be null because tested above
    let data;
    try {
      data = await githubUtils.getIssue(null, null, Number(match[0].slice(1)));
    } catch (e: any) {
      logger.error(`[Github] ${e.toString()}`.red);
      return;
    }
    const embed = new MessageEmbed()
      .setTitle(data.title)
      .setURL(data.html_url)
      .setDescription(data.body ?? 'No description provided')
      .setThumbnail(data.user.avatar_url)
      .setColor('AQUA');
    message.reply({ embeds: [embed] });
  }
};
