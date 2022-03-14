const request = require('supertest');
const app = require('../../src/app.js');
const sequelize = require('../../src/Config/databaseConfig.js');
const { describe, it, expect, jest } = require('@jest/globals');
const { SIGN_UP } = require('../../src/Constants/usersRoutes.js');
const { deleteUserByEmail } = require('../../src/Services/user.services.js');

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return deleteUserByEmail(validUser.email);
});

afterAll(async () => {
  await sequelize.close();
});

const validUser = {
  displayName: 'testuser',
  firstName: 'test',
  lastName: 'user',
  email: 'testuser@example.com',
  password: 'Th1s1zAT3st#',
};

const postUser = (user = validUser) => {
  const agent = request(app).post(`/api/users/${SIGN_UP}`);
  return agent.send(user);
};

describe('User Registration', () => {
  it('returns 201 Created when a signup request is valid', async () => {
    const response = await postUser();
    expect(response.status).toBe(201);
  });

  //   it('returns an error', async () => {
  //     try {
  //       await postUser();
  //     } catch (error) {
  //       expect(error).toMatch('error');
  //     }
  //   });
});
