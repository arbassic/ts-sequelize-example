import env from '../src/env';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();


const app = `http://localhost:${env.APP_PORT}`;
// import app from '../src/server';
// before((done) => {
//   app.on('app launched', (user: any) => {
//     done();
//   });
// });

const expect = chai.expect;
describe('Users', () => {

  describe('GET & POST login – common cases', () => {

    const agent = chai.request.agent(app);
    const loginAttempt = (userId, password) =>
      agent
        .post(`/users/${userId}/login`)
        .query({ password });
    
    it('should be forbidden to read user data publicly', () => {
      return agent
        .get(`/users/1`)
        .query({
          password: 'abc'
        })
        .then(res => {
          res.should.have.status(401);
        });
    });

    it('should be forbidden to create new user data publicly', () =>
      agent.post(`/users`).then(res => {
        res.should.have.property('status').to.be.above(400);
      }));
    
    it('should be forbidden to edit user data publicly', () =>
      agent.put(`/users/1`).then(res => {
        res.should.have.property('status').to.be.above(400);
      }));
    
    it('should be forbidden to delete an user publicly', () =>
      agent.delete(`/users/1`).then(res => {
        res.should.have.property('status').to.be.above(400);
      }));

    it('should be forbidden to login with not valid credentials', () => {
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

    it('should approve correct credentials', () => {
      return loginAttempt(1, 'abc')
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          sessionUserId = res.body.id;
        });
    });

    it('should be allowed to get own data', () => {
      return agent
        .get(`/users/${sessionUserId}`)
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          expect(res.body.id).to.be.equal(sessionUserId);
        });
    });

    it('should be allowed to get own data through /users/me', () => {
      return agent
        .get(`/users/me`)
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          expect(res.body.id).to.be.equal(sessionUserId);
        });
    });

    it('should be allowed to get any user data', () => {
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

    it('should approve correct credentials', () => {
      return loginAttempt(2, 'manager-pass')
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          sessionUserId = res.body.id;
        });
    });

    it('should be allowed to access own data', () => {
      return agent
        .get(`/users/${sessionUserId}`)
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          expect(res.body.id).to.be.equal(sessionUserId);
        });
    });

    it('should be allowed to access same company worker data', () => {
      return agent
        .get(`/users/3`)
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          expect(res.body.id).to.be.equal(3);
        });
    });

    it('should be allowed to create new user', () =>
      agent.post(`/users`).then(res => {
        res.should.have.property('status').to.be.equal(200);
      }));
    
    it('should be allowed to edit user data', () =>
      agent.put(`/users/3`).then(res => {
        res.should.have.property('status').to.be.equal(200);
      }));
    
    it('should be allowed to delete an user', () =>
      agent.delete(`/users/3`).then(res => {
        res.should.have.property('status').to.be.equal(200);
      }));

    it('should be forbidden to access data of other company`s user', () => {
      return agent
        .get(`/users/1`)
        .then(res => {
          res.should.have.status(401);
        });
    });
  });
  



  describe('GET & POST login as regular', () => {

    const agent = chai.request.agent(app);
    const loginAttempt = (userId, password) =>
      agent
        .post(`/users/${userId}/login`)
        .query({ password });

    let sessionUserId = -1;

    it('should reject bad password', () => {
      return loginAttempt(3, 'regular-broken_password')
        .then(res => {
          res.should.have.status(404);
        });
    });

    it('should approve correct credentials', () => {
      return loginAttempt(3, 'regular-pass')
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          sessionUserId = res.body.id;
        });
    });

    it('should be allowed to access own data', () => {
      return agent
        .get(`/users/${sessionUserId}`)
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          expect(res.body.id).to.be.equal(sessionUserId);
        });
    });

    it('should be allowed to access same company worker data', () => {
      return agent
        .get(`/users/2`)
        .then(res => {
          res.should.have.status(200);
          expect(res.body).to.have.property('id').that.is.a('number');
          expect(res.body.id).to.be.equal(2);
        });
    });

    it('should be forbidden to edit other workers data', () => {
      return agent
        .put(`/users/2`)
        .send({
          name: 'Changed name'
        })
        .then(res => {
          res.should.have.status(401);
        });
    });

    it('should be forbidden to access data of other company`s user', () => {
      return agent
        .get(`/users/1`)
        .then(res => {
          res.should.have.status(401);
        });
    });
  });

});