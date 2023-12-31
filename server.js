const express = require("express");
const fs = require("fs");

const app = express();


app.get("/", (req, res, next) => {
    res.sendFile(__dirname + "/index.html");
});


app.get("/video", (req, res, next) => {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
        return;
    }
    const videoPath = "./HowToStudyHard.mp4";
    const videoSize = fs.statSync(videoPath).size;


    const CHUNK_SIZE = 10 ** 6; // 1M
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);


    // headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });

    videoStream.pipe(res);

});


app.listen(5000, () => {
    console.log("Listening port :5000");
})
