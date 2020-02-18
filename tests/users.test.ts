import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const expect = chai.expect;
const assert = chai.assert;


// const app = 'http://localhost:3000';
import app from '../src/server';
before((done) => {
  app.on('app launched', (user: any) => {
    done();
  });
});

describe('Users', () => {

  describe('GET & POST login – common cases', () => {

    const agent = chai.request.agent(app);
    const loginAttempt = (userId, password) =>
      agent
        .post(`/users/${userId}/login`)
        .query({ password });
    let sessionUserId = -1;
    
    it('should not be allowed to read user data', () => {
      return agent
        .get(`/users/1`)
        .query({
          password: 'abc'
        })
        .then(res => {
          res.should.have.status(401);
        });
    });

    it('should reject login attempt due incorrect password', () => {
      const incorrectCredentials = [
        { userId: -1, password: 'pjk2l4gm8_broken' },
        { userId: 1, password: '' },
        { userId: 1, password: 'pjk2l4gm8_broken' },
      ];
      return Promise.all(
        incorrectCredentials.map(({ userId, password }) =>
          loginAttempt(userId, password)
            .then(res => {
              res.should.have.status(404);
            })
        )
      );
    });
  });



  describe('GET & POST login', () => {

    const agent = chai.request.agent(app);
    const loginAttempt = (userId, password) =>
      agent
        .post(`/users/${userId}/login`)
        .query({ password });
    let sessionUserId = -1;

    it('should login', () => {
      return loginAttempt(1, 'abc')
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          sessionUserId = res.body.id;
        });
    });

    it('should get own data', () => {
      return agent
        .get(`/users/${sessionUserId}`)
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          expect(res.body.id).to.be.equal(sessionUserId);
        });
    });

    it('should get of any user', () => {
      return agent
        .get(`/users/2`)
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          expect(res.body.id).to.be.equal(2);
        });
    });
  });



  describe('GET & POST login as manager', () => {

    const agent = chai.request.agent(app);
    const loginAttempt = (userId, password) =>
      agent
        .post(`/users/${userId}/login`)
        .query({ password });

    let sessionUserId = -1;

    it('should reject bad password', () => {
      return loginAttempt(2, 'manager-broken_password')
        .then(res => {
          res.should.have.status(404);
        });
    });

    it('should login', () => {
      return loginAttempt(2, 'manager-pass')
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          sessionUserId = res.body.id;
        });
    });

    it('should access own data', () => {
      return agent
        .get(`/users/${sessionUserId}`)
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          expect(res.body.id).to.be.equal(sessionUserId);
        });
    });

    it('should access same company worker data', () => {
      return agent
        .get(`/users/3`)
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          expect(res.body.id).to.be.equal(3);
        });
    });

    it('should reject accessing data of other company`s user', () => {
      return agent
        .get(`/users/1`)
        .then(res => {
          res.should.have.status(401);
        });
    });
  });
  

});