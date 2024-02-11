const Discord = require('discord.js');
const client = new Discord.Client();
const PREFIX = '+';
const TOKEN = 'MTIwMjI4MzI5NTcwMzA0NDE2OA.GNTcyK.CUvk5g-P_LT3TEfWX9vy9ICGFWsDdMX0d73e1E';

client.on('message', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'mute') {
        // Vérifier si l'utilisateur a la permission de mute
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return message.reply('Vous n\'avez pas la permission de mute des membres.');
        }

        // Extraire le membre à mute
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            return message.reply('Veuillez mentionner le membre à mute.');
        }

        // Vérifier si le membre peut être mute
        if (!member.manageable) {
            return message.reply('Je ne peux pas mute ce membre.');
        }

        // Extraire la durée du mute
        const duration = parseInt(args[1]);
        if (isNaN(duration)) {
            return message.reply('Veuillez spécifier une durée valide en secondes.');
        }

        // Extraire la raison du mute
        const reason = args.slice(2).join(' ');

        // Mute le membre
        member.voice.setMute(true, `Muted by ${message.author.tag} for ${duration} seconds. Reason: ${reason || 'No reason provided'}.`);

        message.reply(`Muted ${member.user.tag} for ${duration} seconds. Reason: ${reason || 'No reason provided'}.`);

        // Démuter le membre après la durée spécifiée
        setTimeout(() => {
            member.voice.setMute(false, 'Unmuted automatically after timeout.');
            member.send(`You have been unmuted in ${message.guild.name} automatically after timeout.`);
        }, duration * 1000);
    }
});

client.login('MTIwMjI4MzI5NTcwMzA0NDE2OA.GNTcyK.CUvk5g-P_LT3TEfWX9vy9ICGFWsDdMX0d73e1E');
