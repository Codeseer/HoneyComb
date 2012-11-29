mongoose = require 'mongoose'
Schema = mongoose.Schema
ObjectId = Schema.ObjectId
folder = require('./folder').Model

folderRoles = ['read', 'write', 'delete']

User = new Schema
  username:
    type: String
    unique: true
    required: true
  password: String
  uvid:
    type: String
    unique: true
  student:
    type: Boolean
    default: true
  admin:
    type: Boolean 
    default: true
  dpromotion:
    type: Boolean
    default: false
  suspend:
    type: Boolean
    default: false
  files: [String]
# password validation logic
User.methods.validPassword = (password, done) ->
  if this.password == password
    done null, this
  else
    done null, false, message: 'Invalid Password'
User.virtual('folders').get () ->
  tmpFiles = new Array
  for file in this.files
    tmpFiles.push file.split('~')
  returnFolders = new Array
  returnFiles = new Array
  for sFile in tmpFiles
    foldername = sFile[0] #the foldername
    returnFolders.push(foldername) if returnFolders.indexOf(foldername) == -1
    returnFiles[returnFolders.indexOf(foldername)] = new Array if typeof(returnFiles[returnFolders.indexOf(foldername)]) == 'undefined'
    returnFiles[returnFolders.indexOf(foldername)].push(sFile[1])
  console.log returnFiles
  returnVal = 
    folderMap: returnFolders
    fileMap: returnFiles
  return  returnVal
    
exports.Model = mongoose.model 'user', User
exports.Schema = User