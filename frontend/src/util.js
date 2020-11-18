const BACKEND = "http://localhost:3001"

const qs = require('qs')

export const makeBackendRequest = (endpoint, body={}) => {
  return fetch(new URL(endpoint, BACKEND), {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

export const getUrlParams = (component) => {
  return qs.parse(component.props.location.search, { ignoreQueryPrefix: true })
}
