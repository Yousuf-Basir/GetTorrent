const parseTorrent = require("parse-torrent");
const WebTorrent = require("WebTorrent");
const formateByte = require("../libs/formateByte");

const parseMagnet = (req, res, next) => {
    const { search } = req.query;
    try {
        const magnetInfoHash = parseTorrent(search).infoHash;
        if (magnetInfoHash) {
            const client = new WebTorrent();
            client.add(magnetInfoHash, (torrent) => {
                let _torrentFile;
                _torrentFile = {
                    title: torrent.name,
                    desc: "",
                    infoHash: magnetInfoHash,
                    provider: "",
                    searchText: search,
                    size: formateByte(torrent.length),
                    thumbUrl: "",
                    time: "",
                    seeds: torrent.numPeers
                }
                console.log(_torrentFile)
                client.remove(torrent);
                res.status(200).json(([_torrentFile]));
            });

        } else {
            next()
        }
    } catch (err) { 
        console.log(err);
        next()
     }
}

module.exports = parseMagnet;