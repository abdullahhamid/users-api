var User = require('../models/user');
var express = require('express');
var router = express.Router();


// GET /users
// Get a list of users
router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      return res.status(500).json({
        error: "Error listing users: " + err
      });
    }

    res.json(users);
  });
});

// GET /users/:id
// Get a user by ID
router.get('/:id', function(req, res) {
  User.findOne({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.json(user);
  });
});

//POST /user
//Insert the user in the database
router.post('/user', function(req, res) {
  var new_user = new User(req.body);
  new_user.save(function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error creating user: ' + err
      });
    }
    res.status(201).json(new_user);
  });
});

//PUT /user/:id
//Update the user and return the updated user object
router.put('/:id', function(req, res) {
  User.findOneAndUpdate({
    _id: req.params.id
  }, { $set: req.body }, { new: true }, function(err, updatedUserObj) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error updating user: ' + err
      });
    }
    if (!updatedUserObj) {
      return res.status(404).end();
    }
    res.status(200).json(updatedUserObj);
  });
});

//Delete /user/:id
//Delete the user by id
router.delete('/:id', function(req, res) {
  User.remove({
    _id: req.params.id
  }, function(err, result) {
    if (err) {
      return res.status(500).json({
        error: "Error deleting user: " + err
      });
    } else {
      res.status(204).json(result);
    }
  });
});



module.exports = router;
