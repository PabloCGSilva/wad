import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
const PORT =3000;
const app = express();
import { join } from 'path';

const config = require('./config.cjs')
const twit =  require('twit')

const T = new twit(config)

function retweet(searchText) {
    // Params to be passed to the 'search/tweets' API endpoint
    let params = {
        q : searchText + 'Bolsonaro',
        result_type : 'mixed',
        count : 25,
    }

    T.get('search/tweets', params, function(err_search, data_search, response_search){

        let tweets = data_search.statuses
        if (!err_search)
        {
            let tweetIDList = []
            for(let tweet of tweets) {
                tweetIDList.push(tweet.id_str);

                //more code here later...
            }

            // Call the 'statuses/retweet/:id' API endpoint for retweeting EACH of the tweetID
            for (let tweetID of tweetIDList) {
                T.post('statuses/retweet/:id', {id : tweetID}, function(err_rt, data_rt, response_rt){
                    if(!err_rt){
                        console.log("\n\nRetweeted! ID - " + tweetID)
                    }
                    else {
                        console.log("\nError... Duplication maybe... " + tweetID)
                        console.log("Error = " + err_rt)
                    }
                })
            }
        }
        else {
            console.log("Error while searching" + err_search)
            process.exit(1)
        }
    })
}

// Run every 60 seconds
setInterval(function() { retweet('#melhorpresidente'); }, 60000)



app.set('view engine', 'ejs')
app.use(expressLayouts)


app.get('/', (_req, res) => {
  res.sendFile('./html/home.html', { root: '.' });
});

app.get("/hello", (_req, res) => {
  res.send("Hello world");
});


app.get("/name", (_req, res) => {
  res.send("name");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});