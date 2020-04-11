require('dotenv').config();

const Discord = require('discord.js');
const fs = require('fs');
const async = require('async');

const client = new Discord.Client();

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));
client.once('reconnecting', () => console.log('Reconnecting!'));
client.once('disconnect', () => console.log('Disconnect!'));

client.on('message', async message => {

    if (message.author.bot) return;

    if (!message.content.startsWith(process.env.BOT_PREFIX)) return;

    if (message.content.startsWith(`${process.env.BOT_PREFIX}alert`)) {
        broadcastAlert(message);
    } else {
        message.channel.send(`You need to enter a valid command ( ${process.env.BOT_PREFIX}alert )`);
    }

});


async function broadcastAlert(message) {

    // if (message.member.permissions.missing('ADMINISTRATOR')) return;

    const channels = message.guild.channels.cache.filter(channel => channel.type == 'voice');

    try {

        for await (channel of channels) {

            channel = channel[1];

            client.on('debug', console.log);

            let connection = await channel.join();

            connection.on('debug', console.log);

            await playFile(connection);

            // await connection.disconnect();

            // await channel.leave();
        }

    } catch (e) {
        console.error(e);
    }

}

async function playFile(connection) {

    return new Promise(function (resolve, reject) {

        const dispatcher = connection.play('./sounds/alerte.mp3');

        dispatcher.on('finish', () => {
            console.log('finished');

            // dispatcher.destroy();

            resolve();
        });

        dispatcher.on('error', (error) => {
            console.log('error');

            // dispatcher.destroy();

            reject(error)
        });

    });


}

client.login(process.env.DISCORD_SECRET);
