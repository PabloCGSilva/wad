import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import express from 'express';
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose')
import expressLayouts from 'express-ejs-layouts';
const app = express();
const PORT = 3000;
// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

import { join } from 'path';

var uri = "mongodb://localhost:27017/Directors";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

const directorSchema = new mongoose.Schema({
    name: String
});

/*const writterSchema = new mongoose.Schema({
    name: String
});*/

const Director = mongoose.model('Director', directorSchema);

/*const Writter = mongoose.model('Writter', writterSchema);*/

const quentin = new Director({ name: 'Quentin' });
console.log(quentin.name); // 'Quentin'

/*const boon = new Writter({ name: 'Boon' });
console.log(boon.name); // 'Boon'*/

  quentin.save(function (err, quentin) {
    if (err) return console.error(err);
  });
  
 /*boon.save(function (err, boon) {
    if (err) return console.error(err);
  });*/

const config = require('./config.cjs')
const twit = require('twit')

const T = new twit(config)

function retweet(searchText) {
    // Params to be passed to the 'search/tweets' API endpoint
    let params = {
        q: searchText + '',
        result_type: 'mixed',
        count: 25,
    }
    // Params to be passed to the 'search/tweets' API endpoint

    T.get('search/tweets', params, (err_search, data_search, response_search) => {

        let tweets = data_search.statuses;
        if (!err_search) {
            let tweetIDList = [];
            for (let tweet of tweets) {
                tweetIDList.push(tweet.id_str);

                //more code here later...
            }

            // Call the 'statuses/retweet/:id' API endpoint for retweeting EACH of the tweetID
            for (let tweetID of tweetIDList) {
                T.post('statuses/retweet/:id', { id: tweetID }, function (err_rt, data_rt, response_rt) {
                    if (!err_rt) {
                        console.log("\n\nRetweeted! ID - " + tweetID);
                    }
                    else {
                        console.log("\nError... Duplication maybe... " + tweetID);
                        console.log("Error = " + err_rt);
                    }
                });
            }
        }
        else {
            console.log("Error while searching" + err_search);
            process.exit(1);
        }
    })
}

// Run every 60 seconds
setInterval(function () { retweet('#Libery OR #Libertarian OR #Ancap OR #Cyclops OR #BadReligion OR #Metal OR #arts'); }, 60000)






app.get('/', (_req, res) => {
    res.render('../views/pages/home.html', {
        root: '.'
    });
});

app.get("/fetchdata",(_req, res) => {
  Director.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}!`);
});