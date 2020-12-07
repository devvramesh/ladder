import { useAuth0 } from "@auth0/auth0-react";
import qs from 'qs';

export const GetCurrentUserID = () => {
  const { user } = useAuth0();
  if (user) {
    return user.sub;
  }
  return null;
}

export const makeBackendRequest = (endpoint, body={}) => {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then((res) => res.json())
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
