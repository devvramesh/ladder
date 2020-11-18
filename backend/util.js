import auth0 from 'auth0';
import fs from 'fs';

export function createManagementClient() {
  const secret = fs.readFileSync('./.secret').toString().trim()
  console.log(secret)

  return new auth0.ManagementClient({
    domain: 'dev-o0dlw7sn.us.auth0.com',
    clientId: 'gFN0a3JsIUUu9OW6X5Qpsd0uzG6b4kio',
    clientSecret: secret,
    scope: 'read:users',
    audience: 'https://dev-o0dlw7sn.us.auth0.com/api/v2/',
    tokenProvider: {
      enableCache: true,
      cacheTTLInSeconds: 10
    }
  });
}
