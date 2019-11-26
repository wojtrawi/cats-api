import * as dotenv from 'dotenv';
import * as request from 'supertest';

dotenv.config();

// tslint:disable: variable-name

export async function login(): Promise<string> {
  return await authenticate(
    process.env.AUTH0_CLIENT_ID,
    process.env.AUTH0_API_SECRET,
  );
}

export async function loginAsAdmin(): Promise<string> {
  return await authenticate(
    process.env.AUTH0_CLIENT_ID_ADMIN,
    process.env.AUTH0_API_SECRET_ADMIN,
  );
}

async function authenticate(
  client_id: string,
  client_secret: string,
): Promise<string> {
  const res = await request(process.env.AUTH0_DOMAIN)
    .post('/oauth/token')
    .send({
      client_id,
      client_secret,
      audience: process.env.AUTH0_AUDIENCE,
      grant_type: 'client_credentials',
    })
    .set({ 'content-type': 'application/json' });

  return res.body.access_token;
}
