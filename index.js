const express = require('express')
const app = express()
var request = require("request");
const fs = require('fs');
var data;

init();


exports.login = function () {
  return new Promise(function (resolve, reject) {
    if (data.c === true) {
      resolve();
    }
    else if (data.app_id && data.secret_key && data.url) {
      app.get('/auth', function (req, res) {
        if (req.query.error_reason) {
          reject(req.query.error_reason);
        }
        if (req.query.code) {
          request('https://connect.deezer.com/oauth/access_token.php?app_id=' + data.app_id + '&secret=' + data.secret_key + '&code=' + req.query.code + '&output=json', function (error, response, body) {
            if (error) {
              reject(error);
            } else {
              try {
                var b = JSON.parse(body);
                data.t = b.access_token;
                data.c = true;
                push();
                resolve();
              } catch (e) {
                reject(e);
              }
            }
          });
        }
        res.send("OK");
      })

      app.get('/connect', function (req, res) {
        res.redirect("https://connect.deezer.com/oauth/auth.php?app_id=" + data.app_id + "&redirect_uri=" + data.url + "&perms=basic_access,offline_access,manage_library,delete_library");

      })

      app.listen(8765, function () {
        console.log('To connect to Deezer, please visit this url from a browser: http://127.0.0.1:8765/connect')
      })
    } else {
      reject("there is missing information in the configuration file, please check that app id, secret key and redirect url are filled in.");
    }
  });

}

exports.get = function (endpoint, options) {
  return new Promise(function (resolve, reject) {
    var u = "";
    switch (endpoint) {
      case 'album':
        u = "https://api.deezer.com/album/" + options.id;
        if (options.method) {
          u += "/" + options.method
        }
        u += "?access_token=" + data.t
        break;
      case 'artist':
        u = "https://api.deezer.com/artist/" + options.id;
        if (options.method) {
          u += "/" + options.method
        }
        u += "?access_token=" + data.t
        break;
      case 'chart':
        u = "https://api.deezer.com/chart/";
        if (options.method) {
          u += "/0/" + options.method
        }
        u += "?access_token=" + data.t
        break;
      case 'comment':
        u = "https://api.deezer.com/comment/" + options.id;
        u += "?access_token=" + data.t
        break;
      case 'editorial':
        u = "https://api.deezer.com/editorial/"
        if (options.method) {
          u += "/0/" + options.method
        }
        u += "?access_token=" + data.t
        break;
      case 'genre':
        u = "https://api.deezer.com/genre/0"
        if (options.method) {
          u += "/" + options.method
        }
        u += "?access_token=" + data.t
        break;
      case 'infos':
        u = "https://api.deezer.com/infos/";
        u += "?access_token=" + data.t
        break;
      case 'options':
        u = "https://api.deezer.com/options/";
        u += "?access_token=" + data.t
        break;
      case 'playlist':
        u = "https://api.deezer.com/playlist/" + options.id;
        if (options.method) {
          u += "/" + options.method
        }
        u += "?access_token=" + data.t
        break;
      case 'podcast':
        u = "https://api.deezer.com/podcast/" + options.id;
        if (options.method) {
          u += "/" + options.method
        }
        u += "?access_token=" + data.t
        break;
      case 'radio':
        u = "https://api.deezer.com/radio/" + options.id;
        if (options.method) {
          u += "/" + options.method
        }
        u += "?access_token=" + data.t
        break;
      case 'search':
        u = "https://api.deezer.com/search?q=" + options.query;
        if (options.method) {
          u = "https://api.deezer.com/search/" + options.method + "?q=" + options.query;
        }
        u += "&access_token=" + data.t
        break;
      case 'track':
        u = "https://api.deezer.com/track/" + options.id;
        u += "?access_token=" + data.t
        break;
      case 'user':
        u = "https://api.deezer.com/user/me"
        if (options.method) {
          u += "/" + options.method
        }
        u += "?access_token=" + data.t
        break;
    }
    request(u, function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        try {
          var b = JSON.parse(body);
          resolve(b);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

exports.post = function (endpoint, options) {
  return new Promise(function (resolve, reject) {
    var u = "";
    switch (endpoint) {
      case 'album':
        u = "https://api.deezer.com/album/" + options.id + "/?request_method=POST&note=" + options.note + "&access_token=" + data.t;
        if (options.method == "comments") {
          u = "https://api.deezer.com/album/" + options.id + "/comments?request_method=POST&comment=" + options.comment + "&access_token=" + data.t;
        }
        break;
      case 'user':
        u = "https://api.deezer.com/user/me/";
        if (options.method == "albums") {
          u += "albums?request_method=POST&album_id=" + options.album_id + "&access_token=" + data.t;
        }
        else if (options.method == "artists") {
          u += "artists?request_method=POST&artist_id=" + options.artist_id + "&access_token=" + data.t;
        } else if (options.method == "playlists") {
          if (options.title) u += "playlists?request_method=POST&title=" + options.title + "&access_token=" + data.t;
          else if (options.playlist_id) u += "playlists?request_method=POST&playlist_id=" + options.playlist_id + "&access_token=" + data.t;
        } else if (options.method == "podcasts") {
          u += "podcasts?request_method=POST&podcast_id=" + options.podcast_id + "&access_token=" + data.t;
        } else if (options.method == "radios") {
          u += "radios?request_method=POST&radio_id=" + options.radio_id + "&access_token=" + data.t;
        } else if (options.method == "tracks") {
          u += "tracks?request_method=POST&track_id=" + options.track_id + "&access_token=" + data.t;
        }
        break;
      case "artist":
        u = "https://api.deezer.com/artist/";
        if (options.method == "comments") {
          u += options.id + "/comments?request_method=POST&comment=" + options.comment + "&access_token=" + data.t;
        }
        break;
      case "playlist":
        u = "https://api.deezer.com/playlist/" + options.id + "/?request_method=POST&note=" + options.note + "&access_token=" + data.t;
        if (options.method == "comments") {
          u = "https://api.deezer.com/playlist/" + options.id + "/comments?request_method=POST&comment=" + options.comment + "&access_token=" + data.t;
        } else if (options.method == "tracks") {
          if (options.songs) u = "https://api.deezer.com/playlist/" + options.id + "/tracks?request_method=POST&songs=" + options.songs + "&access_token=" + data.t;
          else if (options.order) u = "https://api.deezer.com/playlist/" + options.id + "/tracks?request_method=POST&order=" + options.order + "&access_token=" + data.t;
        }
        break;
    }
    request(u, function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        try {
          var b = JSON.parse(body);
          resolve(b);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

exports.delete = function (endpoint, options) {
  return new Promise(function (resolve, reject) {
    var u = "";
    switch (endpoint) {
      case 'user':
        u = "https://api.deezer.com/user/me/";
        if (options.method == "albums") {
          u += "albums?request_method=DELETE&album_id=" + options.album_id + "&access_token=" + data.t;
        } else if (options.method == "artists") {
          u += "artists?request_method=DELETE&artist_id=" + options.artist_id + "&access_token=" + data.t;
        }else if (options.method == "playlists") {
          u += "playlists?request_method=DELETE&playlist_id=" + options.playlist_id + "&access_token=" + data.t;
        }else if (options.method == "podcasts") {
          u += "podcasts?request_method=DELETE&podcast_id=" + options.podcast_id + "&access_token=" + data.t;
        }else if (options.method == "radios") {
          u += "radios?request_method=DELETE&radio_id=" + options.radio_id + "&access_token=" + data.t;
        }else if (options.method == "tracks") {
          u += "tracks?request_method=DELETE&track_id=" + options.track_id + "&access_token=" + data.t;
        }
        break;
      case 'comment':
        u = "https://api.deezer.com/comment/" + options.id + "?request_method=DELETE&access_token=" + data.t;
        break;
      case 'playlist':
          u = "https://api.deezer.com/playlist/" + options.id + "?request_method=DELETE&access_token=" + data.t;
          if(options.method == "tracks"){
            u = "https://api.deezer.com/playlist/" + options.id +"/tracks?request_method=DELETE&songs="+options.songs+"&access_token=" + data.t;
          }
          break;
    }
  });
}


function init() {
  try {
    if (fs.existsSync("./config.json")) {
      data = JSON.parse(fs.readFileSync('./config.json'));
    } else {
      fs.writeFileSync('./config.json', "{}");
    }
  } catch (err) {
    console.error(err)
  }
}

function push() {
  try {
    fs.writeFileSync('./config.json', JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}