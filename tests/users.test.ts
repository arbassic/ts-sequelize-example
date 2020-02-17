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
    
    const agent = chai.request.agent(app);

    it('should get all user records', () => {
      return agent
        .get('/users')
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a('array');
        })
    });

    it('should get a single user record with a password', () => {
      const id = 1;
      return agent
        .get(`/users/${id}`)
        .query({
          password: 'abc'
        })
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a('object');
        });
    });

    it('should not get a single user record', () => {
      const unsupportedIds = [153248636, 'nqo0e9e5a', -1, 0];
      return Promise.all(
        unsupportedIds.map(id =>
          agent.get(`/users/${id}`).then(res => {
            res.should.have.status(404);
          })
        )
      );
    });
    
  });
});