const searchCache = () => {
    if(!global.searchCache){
        const searchCache = [];
        global.searchCache = searchCache;
        return global.searchCache;
    }else{
        return global.searchCache;
    }
}

module.exports = searchCache;
