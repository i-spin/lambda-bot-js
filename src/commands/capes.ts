import { CommandInteraction } from 'discord.js';
import capeUtils from '../utils/capes.js';
import embedUtils from '../utils/embed.js';
import uuidUtils from '../utils/uuid.js';

import('colors');

export default {
  name: 'capes',
  description: 'Edit capes',
  options: [
    {
      name: 'pull',
      description: 'Pull capes',
      type: 1,
      options: [
        {
          name: 'force',
          description: 'Force overwrite',
          type: 5,
        },
      ],
    },
    {
      name: 'push',
      description: 'Push capes',
      type: 1,
    },
    {
      name: 'add',
      description: 'Add capes',
      type: 1,
      options: [
        {
          name: 'user_id',
          description: 'User ID',
          type: 3,
          required: true,
        },
        {
          name: 'minecraft_username',
          description: 'Minecraft username',
          type: 3,
          required: true,
        },
        /* {
                    name: "cape",
                    description: "Cape",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "Contributor",
                            name: "Contributor cape",
                            value: ""
                        },
                    ]
                } */
      ],
    },
  ],

  run: async (interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;
    interaction.options.data.forEach(async (index) => {
      switch (index.name) {
        case 'pull': {
          const forced = interaction.options.getBoolean('force') ?? false;
          try {
            capeUtils.pull({ forced });
          } catch (e: any) {
            interaction.reply({ embeds: [embedUtils.error(e.toString())] })
          }
          return interaction.reply({ embeds: [embedUtils.success(`${forced ? 'Force' : ''}Pulled!`)] });
        }
        case 'push': {
          const pushResult = await capeUtils.push();
          if (!pushResult) { await capeUtils.pull(); await capeUtils.push(); }
          return interaction.reply({ embeds: [embedUtils.success('Pushed to remote.')] });
        }
        case 'add': {
          const minecraftUsername = interaction.options.getString('minecraft_username');
          const user = interaction.options.getString('user_id')!.split("'")[0];
          // if (!await checkuser(user)) return interaction.reply({ embeds: [embedUtils.error('Invalid user')] }); //need fix
          const minecraftUUID = await uuidUtils.usernameToUUID(minecraftUsername as string);
          if (!minecraftUUID) return interaction.reply({ embeds: [embedUtils.error('Invalid username or nonexistent player')] });
          const addResult = await capeUtils.add(user, minecraftUUID);
          if (!addResult) return interaction.reply({ embeds: [embedUtils.error('No local data found. Please pull first.')] });
          return interaction.reply({ embeds: [embedUtils.success(`Added <@${user}>, Info: \`\`\`Username: ${minecraftUsername}\nUUID: ${minecraftUUID}\`\`\``)] });
        }
        default: return interaction.reply({ embeds: [embedUtils.error('Please choose something.')] });
      }
    });
  },
};
