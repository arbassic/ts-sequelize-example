import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import app from '../src/server';

chai.use(chaiHttp);
chai.should();

const expect = chai.expect;
const assert = chai.assert;

before((done) => {
  app.on('app launched', (user: any) => {
    done();
  });
});

describe('Users', () => {
  describe('GET /', () => {
    it('should get all user records', done => {
      chai
        .request(app)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
   
    // Test to get single student record
    it('should get a single user record with a password', done => {
      const id = 1;
      chai
        .request(app)
        .get(`/users/${id}?password=abc`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test to get single student record
    it('should not get a single student record', done => {
      const id = 5;
      chai
        .request(app)
        .get(`/users/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    
    
  });
});