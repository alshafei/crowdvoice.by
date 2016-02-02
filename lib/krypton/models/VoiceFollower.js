K.VoiceFollower = Class(K, 'VoiceFollower').inherits(Krypton.Model)({
  tableName: 'VoiceFollowers',

  attributes: [
    'id',
    'entityId',
    'voiceId',
    'createdAt',
    'updatedAt'
  ]
})

module.exports = new K.VoiceFollower()