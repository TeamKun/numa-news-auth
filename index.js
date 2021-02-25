const axios = require('axios')

const serverId = 'numalauncher-news'

async function validatePlayer(serverId, username, uuid) {
  const mc = await axios.get('https://sessionserver.mojang.com/session/minecraft/hasJoined', {
    params: {
      username,
      serverId,
    }
  })
  if (!mc.data || !(mc.data.id === uuid && mc.data.name === username)) {
    console.log('Auth failed')
    return false
  }

  const allowlist = await axios.get('https://raw.githubusercontent.com/TeamKun/SankaKidsAllowlist/master/whitelist.json')
  if (!allowlist.data) {
    console.log('Failed to load whitelist')
    return false
  }

  const whitelist = Array.from(allowlist.data)
  if (!whitelist.some(e => e.uuid.split('-').join('') === uuid)) {
    console.log('Not in whitelist')
    return false
  }

  return true
}

exports.news = async (req, res) => {
  const {username, uuid} = req.body;
  const valid = await validatePlayer(serverId, username, uuid)
  const url = valid
    ? 'https://example.com/ok'
    : 'https://example.com/ng'
  res.status(200).send(JSON.stringify({url}, null, '\t'))
}
