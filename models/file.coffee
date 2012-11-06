mongodb = require 'mongodb'
ObjectID = mongodb.ObjectID
GridStore = mongodb.GridStore
Chunk = mongodb.Chunk
Server = mongodb.Server

db = new mongodb.Db 'nodejitsudb781130499355',
  new mongodb.Server('alex.mongohq.com', 10007), safe:true

exports.setupFiles = () ->
  db.open (err, db) ->
    if !err
      db.authenticate 'nodejitsu', 'e4f1505e6b587015b660a9b3d4a3364c', (err, data) ->
        if err
          console.log err
        else
          console.log 'database open'
    else
      console.log err

exports.upload = (user, file, cb) ->
  gs = new GridStore db, user.username+'/'+file.filename, 'w',
    'content_type': file.type
    'metadata':
      author: user.username
    'chunk_size': 1024*256 #256KB chunk size
  gs.writeFile file.path, (err, gs) ->
    if !err
      user.files.push file.filename
      user.save (err, doc) ->
        cb err
    else
      cb err

exports.read = (username, filename, cb) ->
  gs = new GridStore db, username+'/'+filename, 'r'
  gs.open (err, gs) ->
    gs.read cb