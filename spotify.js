import express from "express";
import fetch from "node-fetch";
import ytdl from "ytdl-core";
import cors from 'cors';
import * as yt from 'youtube-search-without-api-key';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

// import axios from 'axios';
// import api from './client_secret.json' assert {type: 'json'}


// only for es6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static('static'));
app.use(cors())

// Rate limit

const limiter = rateLimit({
  windowMs: 300000,
  max: 50, 
})
app.use(limiter)
app.set('trust proxy', 1)


const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
console.log(client_id);
console.log(client_secret);
var AccessToken;





var ArtistName;
var SongName;
var CoverArtLink;

async function GetTrackDetails(Trackid) {

  var url = "https://api.spotify.com/v1/tracks/" + Trackid + "?market=ES";
  // --------------------------------------//token request\\----------------------------------------
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(client_id + ":" + client_secret),
    },
    body: "grant_type=client_credentials",
  });

  const data = await result.json();
  AccessToken = await data.access_token;
//   console.log("Access token is " + AccessToken); //access token   // for development purposes

  // --------------------------------------\\token request//----------------------------------------

  // --------------------------------------//Track request\\----------------------------------------

  const resulttrack = await fetch(url, {
    method: "GET",
    headers: { Authorization: "Bearer " + AccessToken },
  });

  const datatrack = await resulttrack.json();
//   console.log(datatrack);   // for development purposes
  let a = datatrack;
  ArtistName = a.artists[0].name;
  SongName = a.name;
  CoverArtLink = a.album.images[1].url;
  search()

  // --------------------------------------\\Track request//----------------------------------------
}

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname+'/static/index.html'));

});

app.get("/details",async function (req, res) {

  console.log(req.query.id);

  var songLink = req.query.id

  if (songLink.substring(25,30) == "track"){
     var Trackid = songLink.substring(31,53);
     await GetTrackDetails(Trackid);
     res.json({ 
       ArtistName: ArtistName, 
       SongName: SongName, 
       CoverArtLink: CoverArtLink,
     })
  }
  else if(songLink.substring(8,23) == "www.youtube.com"){
    ytUrl = songLink;
}

});

app.listen(3000, () => console.log(`Example app listening on 3000`));


/////////////////
//-------------------------------- youtube------------------------------------//
////////////////

var ytUrl;
var videoId;
const ytBaseUrl= "https://www.youtube.com/watch?v="

async function search(){
    const videos = await yt.search(SongName);
    videoId = await videos[0].id.videoId;
    ytUrl = `${ytBaseUrl+videoId}`
  }

// const apiKey = api.api_key;
// const baseUrl = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1"
// const ytBaseUrl= "https://www.youtube.com/watch?v="

// async function search(){
//     var url = `${baseUrl}&q=${SongName}&key=${apiKey}`
//     var response = await axios.get(url)
//     videoId = await response.data.items[0].id.videoId
//     ytUrl = `${ytBaseUrl+videoId}` 
//   }


/////////////////
//-------------------------------- downloader------------------------------------//
////////////////
var extension;

app.get('/download', async (req,res) => {

  extension = req.query.ext;
  console.log(extension)
  
  console.log(ytUrl)
  res.header('Content-Disposition', `attachment; filename="${SongName}.${extension}"`);
  ytdl(ytUrl, {
      filter: 'audioonly',
      quality: 'highest'
      }).pipe(res);
});