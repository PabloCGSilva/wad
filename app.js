const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const PORT =3000;
const app = express();

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (_req, res) => {
  res.send('home.html');
});


app.get("/hello", (_req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
}); 

