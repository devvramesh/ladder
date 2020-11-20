import { useAuth0 } from "@auth0/auth0-react";

const qs = require('qs')

const BACKEND = "http://localhost:3001"

export const GetCurrentUserID = () => {
  const { user } = useAuth0();
  if (user) {
    return user.sub;
    // this will replace the www. only if it is at the beginning
  }
  return null;
}

export const makeBackendRequest = (endpoint, body={}) => {
  return fetch(new URL(endpoint, BACKEND), {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res => res.json())
}

export const GetCurrentUserAccountType = async () => {
  const userID = GetCurrentUserID();
  if (!userID) {
    return null;
  }
  return await makeBackendRequest('/api/account_type', {userID: userID})
    .then((result) => {
      console.log(result)
      return result.accountType
    });
}

export const getUrlParams = (component) => {
  return qs.parse(component.props.location.search, { ignoreQueryPrefix: true })
}
