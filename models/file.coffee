mongodb = require 'mongodb'
ObjectID = mongodb.ObjectID
GridStore = mongodb.GridStore
Chunk = mongodb.Chunk
Server = mongodb.Server

db = new mongodb.Db 'honeycomb',
  new mongodb.Server('ds037817.mongolab.com', 37817), safe:true

exports.setupFiles = () ->
  db.open (err, db) ->
    if !err
      db.authenticate 'admin', 'SPSU2012', (err, data) ->
        if err
          console.log err
        else
          console.log 'database open'
    else
      console.log err

exports.upload = (user, folder, file, cb) ->
  filename = file.filename
  named = false
  i = 0
  while !named
    if user.files.indexOf(folder+'~'+file.filename) == -1
      filename = file.filename
      named = true
    else
      if user.files.indexOf(folder+'~'+file.filename+'('+i+')') == -1
        filename = file.filename+'('+i+')'
        named = true
    i++
  gs = new GridStore db, user.username+'/'+folder+'~'+filename, 'w',
    'content_type': file.type
    'metadata':
      author: user.username
    'chunk_size': 1024*256 #256KB chunk size
  gs.writeFile file.path, (err, gs) ->
    if !err
      if user.files.indexOf(filename) == -1
        user.files.push folder+'~'+filename
        user.save (err, doc) ->
          cb err
      else
        cb null
    else
      cb err

exports.read = (username, filename, cb) ->
  gs = new GridStore db, username+'/'+filename, 'r'
  gs.open (err, gs) ->
    gs.read cb

exports.remove = (username, filename, cb) ->
  gs = new GridStore db, username+'/'+filename, 'r'
  gs.open (err, gs) ->
    gs.unlink cb