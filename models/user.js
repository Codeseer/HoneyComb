// Generated by CoffeeScript 1.4.0
(function() {
  var ObjectId, Schema, User, folder, folderRoles, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ObjectId = Schema.ObjectId;

  folder = require('./folder').Model;

  folderRoles = ['read', 'write', 'delete'];

  User = new Schema({
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: String,
    uvid: {
      type: String,
      unique: true
    },
    student: {
      type: Boolean,
      "default": true
    },
    admin: {
      type: Boolean,
      "default": true
    },
    dpromotion: {
      type: Boolean,
      "default": false
    },
    suspend: {
      type: Boolean,
      "default": false
    },
    files: [String]
  });

  User.methods.validPassword = function(password, done) {
    if (this.password === password) {
      return done(null, this);
    } else {
      return done(null, false, {
        message: 'Invalid Password'
      });
    }
  };

  User.virtual('folders').get(function() {
    var file, foldername, returnFiles, returnFolders, returnVal, sFile, tmpFiles, _i, _j, _len, _len1, _ref;
    tmpFiles = new Array;
    _ref = this.files;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      file = _ref[_i];
      tmpFiles.push(file.split('~'));
    }
    returnFolders = new Array;
    returnFiles = new Array;
    for (_j = 0, _len1 = tmpFiles.length; _j < _len1; _j++) {
      sFile = tmpFiles[_j];
      foldername = sFile[0];
      if (returnFolders.indexOf(foldername) === -1) {
        returnFolders.push(foldername);
      }
      if (typeof returnFiles[returnFolders.indexOf(foldername)] === 'undefined') {
        returnFiles[returnFolders.indexOf(foldername)] = new Array;
      }
      returnFiles[returnFolders.indexOf(foldername)].push(sFile[1]);
    }
    console.log(returnFiles);
    returnVal = {
      folderMap: returnFolders,
      fileMap: returnFiles
    };
    return returnVal;
  });

  exports.Model = mongoose.model('user', User);

  exports.Schema = User;

}).call(this);
