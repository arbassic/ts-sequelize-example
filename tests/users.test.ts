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

    it('should not get a single user record', done => {
      const unsupportedIds = [153248636, 'nqo0e9e5a', -1, 0];
      Promise.all(
        unsupportedIds.map(id => {
          return new Promise((resolve, reject) => {
            chai
              .request(app)
              .get(`/users/${id}`)
              .then((res) => {
                res.should.have.status(404);
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          });
        })
      ).then(() => done());
    });
    
  });
});