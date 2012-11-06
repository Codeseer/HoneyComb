files = require '../models/file'

module.exports = (app) ->
  
  app.post '/files', (req, res) ->
    if !req.user
      return res.redirect '/login'
    else if req.files.uploadFile
      files.upload req.user, req.files.uploadFile, (err) ->
        if !err
          res.redirect '/member'
        else
          res.end 'Error Saving File: ' + err
    else
      return res.end "you didnt send me a file...."

  app.get '/files/:id', (req, res) ->
    files.read req.params.id, (err, fileData) ->
      console.log fileData