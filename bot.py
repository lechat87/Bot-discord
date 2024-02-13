import discord
from discord.ext import commands

# Intents
intents = discord.Intents.default()
intents.bans = True
intents.messages = True

# Initialisation du bot avec les intentions
bot = commands.Bot(command_prefix='', intents=intents)

@bot.event
async def on_ready():
    print(f'Connecté en tant que {bot.user}')

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

# Lancer le bot avec le token
bot.run('MTIwMjI4MzI5NTcwMzA0NDE2OA.GNTcyK.CUvk5g-P_LT3TEfWX9vy9ICGFWsDdMX0d73e1E')
