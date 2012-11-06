files = require '../models/file'
User = require '../models/user'
module.exports = (app) ->
  
  app.post '/files', (req, res) ->
    if !req.user
      return res.redirect '/login'
    else if req.files.uploadFile      
      files.upload req.user, req.files.uploadFile, (err) ->
        if !err
          res.redirect '/account'
        else
          res.end 'Error Saving File: ' + err
    else
      return res.end "you didnt send me a file...."

  app.get '/files/:username/:filename', (req, res) ->
    if !req.user
      res.redirect('/login');
    else if req.user.username == req.params.username
      files.read req.params.username, req.params.filename, (err, fileData) ->
        res.end(fileData, "binary");
    else
      res.end("Dude, you don't have access to "+req.user.username+"'s files.");

  app.delete '/files/:username/:filename', (req, res) ->
    if !req.user
      res.redirect('/login');
    else if req.user.username == req.params.username
      files.remove req.params.username, req.params.filename, (err, result) ->
        if !err
          req.user.files.splice req.user.files.indexOf(req.params.filename), 1
          req.user.save (err) ->
            if !err
              res.redirect('/account');
    else
      res.end("Dude, you don't have access to "+req.params.username+"'s files.");