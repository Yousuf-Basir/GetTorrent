const cherio = require("cherio");
const TorrentSearchApi = require('torrent-search-api');
const searchCache = require("../libs/searchCache");
const parseTorrent = require('parse-torrent')
const request = require("request");

const getImage = (desc) => {
    return (
        new Promise((resolve) => {
            request(desc, (error, response, body) => {
                const $ = cherio.load(body);
                const src = $("div.torrent-image img").attr("src");
                if (src) {
                    resolve(src.replace("//", "https://"));
                } else {
                    resolve(null)
                }
            })
        })
    )
}

const searchTorrent = (searchText) => (
    new Promise((resolve, reject) => {
    console.log("searching for ", searchText);
    const _searchCache = searchCache();

    if (_searchCache.length) {
        _searchCache.forEach(cache => {
            if (cache.find(item => item.searchText == searchText)) {
                console.log("search result sending from cache");
                return resolve(cache);
            }
        })
    }

    TorrentSearchApi.search(searchText, "", 10).then((results) => {
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
                        searchText: searchText,
                        infoHash: parseTorrent(magnet).infoHash,
                        title: t.title,
                        thumbUrl: imageSrc
                    });
                    if (results.length === torrentFiles.length) {
                        console.log("caching search result");
                        _searchCache.push(torrentFiles)
                        resolve(torrentFiles);
                    }
                });
            });
        });
    });
}));

const searchMiddleware = async (req, res, next) => {
    const { search } = req.query;
    try{
        if(!search){
            return res.status(500).send("error");
        }

        TorrentSearchApi.enableProvider("1337x");
    
        searchTorrent(search).then(torrentArray => {
            req.torrentArray = torrentArray;
            return next();
        }).catch(err => {
            console.log("🟥 Error from searchTorrent function");
            console.log(err);
            return res.status(500).send("error");
        });
    }catch(err){
        console.log(err);
        return res.status(500).send("error");
    }
}

module.exports = searchMiddleware;