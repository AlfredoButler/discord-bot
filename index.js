async function play(voiceChannel) {
    const connection = await voiceChannel.join();
    connection.play('audio.mp3');
}

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', async message => {
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;

    if (message.content === '/leave') {
        console.log('trying to leave');
        if (message.member.voice.channel) {
            console.log('leaving');
            message.member.voice.channel.leave();
            console.log('left');
        }
    }

    if (message.content === '/join') {
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voice.channel) {
            console.log('joining channel');
            const connection = await message.member.voice.channel.join();
            console.log('joined channel');

            // Create a ReadableStream of s16le PCM audio

            console.log('created audio stream')
            let i = 0;

            const dispatcher = connection.play('dist/sampleaudio.mp3', {
                volume: 0
            });

            dispatcher.on('finish', async () => {
                const audio = await connection.receiver.createStream(message.member, { mode: 'pcm', end: 'silence' });

                // audio.on('error', (err) => {
                //     console.log(err);
                // });

                // audio.on('pause', () => {
                //     console.log('pause');
                // });

                // audio.on('readable', () => {
                //     console.log('readable');
                // });

                // audio.on('resume', () => {
                //     console.log('resume');
                // });

                // audio.on('close', () => {
                //     console.log('closed');
                // });

                // audio.on('end', () => {
                //     console.log('end');
                // });

                audio.on('data', (chunk) => {
                    console.log(`Received ${chunk.length} bytes of data.`);
                });
                audio.pipe(fs.createWriteStream('./dist/raw/user_audio_' + i + '_' + message.member.user.id));
            });

        } else {
            message.channel.send('You need to join a voice channel first!');
        }
    }
});

// client.on('message', async message => {
//     // Join the same voice channel of the author of the message
//     if (message.member.voice.channel) {
//         const connection = await message.member.voice.channel.join();
//         console.log(message.member.voice.channel.members);

//         // Create a ReadableStream of s16le PCM audio
//         const audio = connection.receiver.createStream(message.member.user, { mode: 'pcm' });

//         audio.pipe(fs.createWriteStream('./user_audio'));

//         setTimeout(() => {
//             audio.
//         }, 1000)
//     }
// });

//260163449517113346

client.login('');