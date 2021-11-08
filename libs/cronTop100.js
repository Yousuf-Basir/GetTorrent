const cherio = require("cherio");
const parseTorrent = require('parse-torrent')
const TorrentSearchApi = require('torrent-search-api');
const request = require("request");
const fs = require("fs");

const getImage = (desc) => {
    return (
        new Promise((resolve) => {
            request(desc, (error, response, body) => {
                const $ = cherio.load(body);
                const src = $(".movie-detail .movie-img>img").attr("src");
                if (src) {
                    resolve(src);
                } else {
                    resolve(null)
                }
            })
        })
    )
}

const searchTorrent = () => (
    new Promise((resolve, reject) => {
        console.log("searching for Top100");

        TorrentSearchApi.search("", "Top100", 100).then((results) => {
            if (!results.length) {
                console.log("sending blank array")
                resolve([]);
            }

            // create array of torrent object that has magnet link
            let torrentFiles = [];
            results.forEach((t) => {
                TorrentSearchApi.getMagnet(t).then(magnet => {
                    getImage(t.desc).then((imageSrc) => {
                        torrentFiles.push({
                            ...t,
                            searchText: "Top100",
                            infoHash: parseTorrent(magnet).infoHash,
                            title: t.title,
                            thumbUrl: imageSrc
                        });
                        if (results.length === torrentFiles.length) {
                            console.log("caching search result");
                            resolve(torrentFiles);
                        }
                    });
                });
            });
        });
    }));

const cronTop100 = () => {
    // 1337x
    // TorrentSearchApi.enableProvider("Torrent9");
    TorrentSearchApi.enableProvider("Torrent9");
    

    searchTorrent().then(torrentArray => {
        fs.writeFile("top100.json", JSON.stringify(torrentArray), () => {
            console.log("Top100.json file written")
        });
    }).catch(err => {
        console.log("🔷 ERROR when in cronTop100 function");
        console.log(err);
    });
}

module.exports = cronTop100;