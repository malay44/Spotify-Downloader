import axios from 'axios';
import express from 'express';
import client_secret from './client_secret.json' assert {type: 'json'}


const apiKey = client_secret.api_key
const baseUrl = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1"
const ytBaseUrl= "https://www.youtube.com/watch?v="

// Creating express application
const app = express()

app.get('/', (req, res)=>{
    res.send("hello priends", response.data.items)
})

app.listen(5000, ()=>{
    console.log("app runnin")
})

const songName = "bad vibes forever"

async function search(){
    var url = `${baseUrl}&q=${songName}&key=${apiKey}`
    var response = await axios.get(url)
    var videoId = await response.data.items[0].id.videoId
    var ytUrl = `${ytBaseUrl+videoId}` 
    console.log(ytUrl)
}
search()