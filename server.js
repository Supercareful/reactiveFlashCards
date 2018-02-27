'use strict'

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Flashcard = require('./model/flashcard');

var app = express();
var router = express.Router();

var port = process.env.API_PORT || 5001;

//db config
mongoose.connect('removed credentials');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

 res.setHeader('Cache-Control', 'no-cache');
 next();
});

router.get('/', function(req, res) {
 res.json({ message: 'API Initialized!'});
});

router.route('/flashcards')
  .post(function(req, res) {
    var flashcard = new Flashcard();
	flashcard.userKey = req.body.userKey;
	flashcard.question = req.body.question;
	flashcard.answer = req.body.answer;

    flashcard.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Flashcard added!' });
    });
});

router.route('/flashcards/:flashcard_id')
	.get(function(req, res) {
	    Flashcard.find({'userKey': req.params.flashcard_id }, function(err, flashcards) {
	      if (err)
	        res.send(err);
	      res.json(flashcards);
	    });
	  })
	.put(function(req, res){
		Flashcard.findById(req.params.flashcard_id, function(err, flashcard) {
			if(err)
				res.send(err);
			flashcard.userKey = req.body.userKey;
			flashcard.question = req.body.question;
			flashcard.answer = req.body.answer;

			flashcard.save(function(err){
				if(err)
					res.send(err);
				res.json({message: "flashcard has been updated"});
			});
		});
	})
	.delete(function(req, res) {
		Flashcard.remove({ _id: req.params.flashcard_id }, function(err, flashcard){
			if(err)
				res.send(err);
			res.json({message: "Flashcard has been deleted"})
		})
	});
	


app.use('/api', router);

app.listen(port, function() {
 console.log('api running on port ' + port);
});