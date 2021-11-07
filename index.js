var express = require('express')
var cors = require('cors')
const cronTop100 = require('./libs/cronTop100');
const app = express()

// routes
const searchRoute = require("./routes/search");
const top100 = require("./routes/top100");



app.use(cors());
app.use(express.json());

app.use(searchRoute);
app.use(top100);

setTimeout(()=>{
    cronTop100();
}, 10000);

// run after every 12 hours
setInterval(() => {
    cronTop100();
}, 1000*60*60*12);

module.exports = app;

if(require.main === module) {
    const port = process.env.PORT || 3001

    app.listen(port, ()=> {
        console.log(`Server running on port: ${port}`);
    })
}