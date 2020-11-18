const BACKEND = "http://localhost:3001"

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
