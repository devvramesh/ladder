import { useAuth0 } from "@auth0/auth0-react";
import os from 'os';
import qs from 'qs';

// setup connections to backend.
// backend is on same host (hence os.hostname()), post 5000.
const BACKEND_PORT = process.env.PORT || 5000
const HOST = os.hostname();
const PROTOCOL = window.location.protocol;
const BACKEND = `${PROTOCOL}//${HOST}:${BACKEND_PORT}/`
console.log('backend: ' + BACKEND)

export const GetCurrentUserID = () => {
  const { user } = useAuth0();
  if (user) {
    return user.sub;
    // this will replace the www. only if it is at the beginning
  }
  return null;
}

export const makeBackendRequest = (endpoint, body={}) => {
  console.log('making request to ' + endpoint)
  console.log(body)
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then((res) => res.json())
  .then((x) => {console.log('back from ' + endpoint); console.log(x); return x})
}

export const getUserInfo = async (identifier) => {
  if (!identifier.userID && !identifier.username) {
    return null;
  }
  return await makeBackendRequest('/api/user_info', identifier);
}

export const getUrlParams = (component) => {
  return qs.parse(component.props.location.search, { ignoreQueryPrefix: true })
}
