// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); // call express
var cors       = require('cors');
var app        = express();         // define our app using express
var bodyParser = require('body-parser');
var Comment    = require('./models/comment');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;    // set our port



// DATABASE SETUP (remote)
// =============================================================================
var mongoose = require('mongoose');
mongoose.connect('mongodb://okjim3ML:MLok3779@ds053080.mongolab.com:53080/reactjs-experiment');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('db success');
});



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();        // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /comments
// ----------------------------------------------------
router.route('/comments')

  // create a comment (accessed at POST http://localhost:8080/api/comments)
  .post(function(req, res) {
    
    var comment = new Comment();    // create a new instance of the Comment model
    comment.key = req.body.key;  // set the comments name (comes from the request)
    comment.author = req.body.author;
    comment.text = req.body.text;
    console.log(req);

    // save the comment and check for errors
    comment.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Comment created!' });
    });
    
  })
  .get(function(req, res) {
    Comment.find(function(err, comments) {
      if (err)
        res.send(err);

      res.json(comments);
    });
  });

  router.route('/comments/:comment_id')

  // get the comment with that id (accessed at GET http://localhost:8080/api/comments/:comment_id)
  .get(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err)
        res.send(err);
      res.json(comment);
    });
  })

  .put(function(req, res) {

    // use our comment model to find the comment we want
    Comment.findById(req.params.comment_id, function(err, comment) {

      if (err)
        res.send(err);
      
      // update the comments info
    
      if(req.body.author !== undefined){
        comment.author = req.body.author;
      }
      if(req.body.text !== undefined){
        comment.text = req.body.text;  // update the comments info
      }
      if(req.body.key !== undefined){
        comment.key = req.body.key;  // update the comments info
      }


      // save the comment
      comment.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'Comment updated!' });
      });

    });
  })

  .delete(function(req, res) {
    Comment.remove({
      _id: req.params.comment_id
    }, function(err, comment) {
      if (err)
        res.send(err);

      res.json({ message: 'Successfully deleted' });
    });
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
