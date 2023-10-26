import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

type Credentials = {
  email: string;
  name: string;
  password: string;
};

const signUp = async (
  app: INestApplication,
  { email, name, password }: Credentials,
) => {
  const res = await request(app.getHttpServer())
    .post('/auth/signup')
    .send({ email, name, password })
    .expect(201);
  return res;
};

const signIn = async (
  app: INestApplication,
  { email, password }: Credentials,
) => {
  const res = await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ email, password })
    .expect(200);
  return res;
};

describe('Auth module (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Success signup with valid data', async () => {
    const testEmail = 'asd@asd.hu';
    const testName = 'asd';
    const res = await signUp(app, {
      email: testEmail,
      name: testName,
      password: 'asd1234',
    });

    const { id, email, tokens } = res.body;
    const cookie = res.get('Set-Cookie');
    expect(id).toBeDefined();
    expect(email).toEqual(testEmail);
    expect(tokens).toBeDefined();
  });

  it('Unsuccess signup with missing email and getting 400 error', async () => {
    const testName = 'asd';
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ name: testName, password: 'asd123' })
      .expect(400);
  });

  it('Unsuccess signup with wrong email format and getting 400 error', async () => {
    const testEmail = 'asd';
    const testName = 'asd';
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, name: testName, password: 'asd123' })
      .expect(400);
  });

  it('Success signin with valid data', async () => {
    const credentials = {
      email: 'asd@asd.hu',
      name: 'asd',
      password: 'asd1234',
    };

    // sign up the user
    await signUp(app, credentials);

    // signin the user
    const res = await signIn(app, credentials);

    const { id, email, name, tokens } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(credentials.email);
    expect(name).toEqual(name);
    expect(tokens).toBeDefined();
  });

  it('Unsuccess signin with wrong credentials and getting 400 error', async () => {
    const testEmail = 'asd@asd.hu';
    const testName = 'asd';
    const testPassword = 'asd1234';

    // sign up the user
    await signUp(app, {
      email: testEmail,
      name: testName,
      password: testPassword,
    });

    // signin the user with wrong email address
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'asdxxx@asd.hu', password: testPassword })
      .expect(400);
  });

  it('Sign up - sign in - logout the user', async () => {
    const credentials = {
      email: 'asd@asd.hu',
      name: 'asd',
      password: 'asd1234',
    };

    // sign up the user
    await signUp(app, credentials);

    // signin the user with wrong email address
    const signinRes = await signIn(app, credentials);

    const {id, email, name, tokens} = signinRes.body

    await request(app.getHttpServer())
      .get('/auth/logout')
      .set('Authorization', 'Bearer ' + tokens.refreshToken)
      .send()
      .expect(200);
  });
});
