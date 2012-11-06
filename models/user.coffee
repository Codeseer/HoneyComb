mongoose = require 'mongoose'
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

User = new Schema
  username:
    type: String
    unique: true
    required: true
  password: String
  uvid:
    type: String
    unique: true
  files: [
    fid: ObjectId
    filename: String
  ]

# password validation logic
User.methods.validPassword = (password, done) ->
  if this.password == password
    done null, this
  else
    done null, false, message: 'Invalid Password'

exports.Model = mongoose.model 'user', User
exports.Schema = User