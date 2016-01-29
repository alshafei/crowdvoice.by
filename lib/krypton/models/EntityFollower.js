K.EntityFollower = Class(K, 'EntityFollower').inherits(Krypton.Model)({
  tableName: 'EntityFollower',

  attributes: [
    'id',
    'followerId',
    'followedId',
    'createdAt',
    'updatedAt'
  ]
})

module.exports = new K.EntityFollower()