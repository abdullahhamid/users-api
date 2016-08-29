var logger = require('winston');
var server = require('../../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var seed = require('../../seed/seed');
var User = require('../../models/user');
var expect = require('chai').expect;

chai.should();
chai.use(chaiHttp);

var url = 'http://127.0.0.1:8001';

var new_user = {
  "gender": "female",
  "name": {
    "title": "miss",
    "first": "rachel",
    "last": "robertson"
  },
  "location": {
    "street": "1097 the avenue",
    "city": "brisbane",
    "state": "queensland",
    "zip": 38795
  },
  "email": "rachel.robertson@example.com",
  "username": "rachel505",
  "password": "robertsonrach199",
  "salt": "",
  "md5": "",
  "sha1": "",
  "sha256": "",
  "registered": 1237176893,
  "dob": 932871968,
  "phone": "031-541-9181",
  "cell": "081-647-4650",
  "PPS": "3304543T",
  "picture": {
    "large": "https://randomuser.me/api/portraits/women/60.jpg",
    "medium": "https://randomuser.me/api/portraits/med/women/60.jpg",
    "thumbnail": "https://randomuser.me/api/portraits/thumb/women/60.jpg"
  }
};

//updated user details (password, phone)
var new_user_updated = {
  "gender": "female",
  "name": {
    "title": "miss",
    "first": "rachel",
    "last": "robertson"
  },
  "location": {
    "street": "1097 the avenue",
    "city": "brisbane",
    "state": "queensland",
    "zip": 38795
  },
  "email": "rachel.robertson@example.com",
  "username": "rachel505",
  "password": "robertsonrach222",
  "salt": "",
  "md5": "",
  "sha1": "",
  "sha256": "",
  "registered": 1237176893,
  "dob": 932871968,
  "phone": "041-545-9171",
  "cell": "081-647-4650",
  "PPS": "3304543T",
  "picture": {
    "large": "https://randomuser.me/api/portraits/women/60.jpg",
    "medium": "https://randomuser.me/api/portraits/med/women/60.jpg",
    "thumbnail": "https://randomuser.me/api/portraits/thumb/women/60.jpg"
  }
};

//to keep track of object id of the created user
var new_user_id;

describe('Users', function() {

  // Before our test suite
  before(function(done) {
    // Start our app on an alternative port for acceptance tests
    server.listen(8001, function() {
      logger.info('Listening at http://localhost:8001 for acceptance tests');

      // Seed the DB with our users
      seed(function(err) {
        done(err);
      });
    });
  });

  describe('/GET users', function() {
    it('should return a list of users', function(done) {
      chai.request(url)
        .get('/users')
        .end(function(err, res) {
          res.body.should.be.a('array');
          res.should.have.status(200);
          res.body.length.should.be.eql(100);
          done();
        });
    });
  });

  describe('/GET users/:id', function() {
    it('should return a single user', function(done) {
      // Find a user in the DB
      User.findOne({}, function(err, user) {
        var id = user._id;

        // Read this user by id
        chai.request(url)
          .get('/users/' + id)
          .end(function(err, res) {
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.name.first).to.be.a('string');
            done();
          });
      });
    });
  });

  //Insert new user
  describe('/POST /users/user', function() {
    it('should create a new user', function(done) {
      chai.request(url)
        .post('/users/user')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(new_user)
        .end(function(err, res) {
          expect(res.body).to.be.a('object');
          res.should.have.status(201);
          expect(res.body.name.first).to.be.a('string');
          expect(res.body.name.first).to.be.equal(new_user.name.first);
          new_user_id = res.body._id;
          done();
        });
    });
  });

  //check if the new inserted user exists in the database - check by id
  describe('/GET users/:id', function() {
    it('should return the newly inserted single user', function(done) {
      chai.request(url)
        .get('/users/' + new_user_id)
        .end(function(err, res) {
          res.should.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.name.first).to.be.a('string');
          expect(res.body.name.first).to.be.equal(new_user.name.first);
          done();
        });
    });
  });

  //Update the user
  describe('/PUT /:id', function() {
    it('should update new user by id', function(done) {
      chai.request(url)
        .put('/users/' + new_user_id)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(new_user_updated)
        .end(function(err, res) {
          expect(res.body).to.be.a('object');
          res.should.have.status(200);
          expect(res.body.name.first).to.be.a('string');
          //check if the updated details returned match the updated details sent
          expect(res.body.password).to.be.equal(new_user_updated.password);
          expect(res.body.phone).to.be.equal(new_user_updated.phone);
          done();
        });
    });
  });

  //Delete the user by id
  describe('/DELETE /users/:id', function() {
    it('should delete the user by given id', function(done) {
      chai.request(url)
        .delete('/users/' + new_user_id)
        .end(function(err, res) {
          res.should.have.status(204);
          done();
        });
    });
  });

  //check if the deleted user exists in the database - check by id
  describe('/GET users/:id', function() {
    it('should return 404 not found for a user which has been deleted', function(done) {
      chai.request(url)
        .get('/users/' + new_user_id)
        .end(function(err, res) {
          res.should.have.status(404);
          done();
        });
    });
  });
});
