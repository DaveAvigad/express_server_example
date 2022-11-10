// init project
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const url = String(process.env.HOSTNAME).split('-');

const { MongoClient } = require('mongodb');
const { MONGO_URL, MONGO_USER, MONGO_PASS } = process.env;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_URL}`;
let result = {};

async function main () {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/drivers/node/ for more details
   */

  /**
   * The Mongo Client you will use to interact with your database
   * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
   * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
   * pass option { useUnifiedTopology: true } to the MongoClient constructor.
   * const client =  new MongoClient(uri, {useUnifiedTopology: true})
   */

  const client = new MongoClient(uri);
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('connected to mongo');

    // Make the appropriate DB calls
    result = await client.db('sample_airbnb').collection('listingsAndReviews').findOne();
    // async function createListing(client, newListing){
    // const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
    // console.log(`New listing created with the following id: ${result.insertedId}`);
    // }
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}

main().catch(console.error);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// This route processes GET requests to "/"`
app.get('/', function (req, res) {
  res.send(
    '<h1>REST API</h1><p>A REST API starter using Express and body-parser.<br /><br />To test, curl the following and view the terminal logs:<br /><br /><i>curl -H "Content-Type: application/json" -X POST -d \'{"username":"test","data":"1234"}\' https://' +
      url[2] +
      '.sse.codesandbox.io/update<i></p>'
  );
  console.log('Received GET');
});

app.get('/test', (req, res) => res.status(200).send('all good 🙏'));
app.get('/result', (req, res) => res.status(200).json(result));

// A route for POST requests sent to `/update`
app.post('/update', function (req, res) {
  if (!req.body.username || !req.body.data) {
    console.log('Received incomplete POST: ' + JSON.stringify(req.body));
    return res.send({ status: 'error', message: 'missing parameter(s)' });
  } else {
    console.log('Received POST: ' + JSON.stringify(req.body));
    return res.send(req.body);
  }
});

// A GET request handler for `/update`
app.get('/update', function (req, res) {
  const dummyData = {
    username: 'testUser',
    data: '1234'
  };
  console.log('Received GET: ' + JSON.stringify(req.body));
  if (!req.query.username) {
    return res.send({ status: 'error', message: 'no username' });
  } else if (!req.query.data) {
    return res.send({ status: 'error', message: 'no data' });
  } else if (req.query.username !== dummyData.username) {
    return res.send({ status: 'error', message: 'username does not match' });
  } else {
    return res.send(dummyData);
  }
});

// Listen on port 8080
var listener = app.listen(8080, function () {
  console.log('Listening on port ' + listener.address().port);
});
