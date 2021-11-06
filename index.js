var express = require('express')
var cors = require('cors')
const searchMiddleware = require('./middlewares/search.middleware')
const app = express()

// routes
const searchRoute = require("./routes/search");


app.use(cors());
app.use(express.json());

app.use(searchRoute);

module.exports = app;

if(require.main === module) {
    const port = process.env.PORT || 3001

    app.listen(port, ()=> {
        console.log(`Server running on port: ${port}`);
    })
}