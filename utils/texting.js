const typing = async function (ctx, provider) {
  if (provider && provider?.vendor && provider.vendor?.sendPresenceUpdate) {
      const id = ctx.key.remoteJid
      await provider.vendor.sendPresenceUpdate('composing', id)
  }
}

module.exports = typing