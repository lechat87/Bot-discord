const Discord = require('discord.js');
const client = new Discord.Client();
const PREFIX = '+';
const TOKEN = 'MTIwMjI4MzI5NTcwMzA0NDE2OA.GNTcyK.CUvk5g-P_LT3TEfWX9vy9ICGFWsDdMX0d73e1E';

intents = discord.Intents.default()
intents.bans = True
intents.messages = True

@bot.event
async def on_message(message):
    if message.author == bot.user:
        return
    
    if message.content.startswith('+ban'):
        # Vérifier si l'utilisateur a la permission de bannir des membres
        if not message.author.guild_permissions.ban_members:
            return await message.channel.send('Vous n\'avez pas la permission de bannir des membres.')

        await message.channel.send('Qui voulez-vous bannir ?')

        def check(msg):
            return msg.author == message.author and msg.channel == message.channel

        try:
            member_msg = await bot.wait_for('message', check=check, timeout=60)
            member = message.guild.get_member(int(member_msg.content.replace('<@!', '').replace('>', '')))
            if not member:
                return await message.channel.send('Membre introuvable.')

            await message.channel.send('Pour quelle raison ? (envoyée en mp)')

            reason_msg = await bot.wait_for('message', check=check, timeout=60)

            await member.ban(reason=reason_msg.content)
            await message.channel.send(f'{member.mention} a été banni pour {reason_msg.content}.')
        except asyncio.TimeoutError:
            await message.channel.send('Temps écoulé. Veuillez réessayer.')

    await bot.process_commands(message)

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
