import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-r5kzw1jv5wogvd8l.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  const jwks = await Axios.get(jwksUrl)
  const pk = jwks.data.keys.find(k=> k.kid == jwt.header.kid)['x5c'][0]
  
  logger.info('Public Key: ', pk)
  const cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJezifWSPGBZCoMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1yNWt6dzFqdjV3b2d2ZDhsLnVzLmF1dGgwLmNvbTAeFw0yNTA0MjEw
NzMyNDVaFw0zODEyMjkwNzMyNDVaMCwxKjAoBgNVBAMTIWRldi1yNWt6dzFqdjV3
b2d2ZDhsLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAL3BwHqjB1V4LNzvC+wqMuqkDCc5zQFdUkpE8RbyZLZsOBA7It6GbXc3JHx/
ZVS4dPbZTKYFCAUq6h6dXc/X5JK+8SkJuA52e6lmzVByTDvogn28oKaMk2REeUF4
0tu/Smz0P0ErUY6o599wAYbuHVdhgptziTF7gb6WYkwiXTj4d/9wGfKPNORoPnZa
SXTaLzr8UYrwmfvuUVVB0JK/9U4S9TCY5N2alFDhe2O187JGLLyMVd8K8a/8l+L9
iPdt5KYOODLreLJ+0akVUGhfyDCoLFKKfxY6BMzMaichD7SJKKLiWRpOMIJ8iTR0
Rne4XG/Yc/vG7sKFV9nPEhpEP5MCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUn9dTLQcyOGyGwNgXRKvzwJ+ic5owDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBaPb+6BZ8wzsgXn25oesYWnfJS7MYpE27HB+3yng9u
8zHBGh+THn34XMgF7HWBHLOubcq8RlXIQQ7NHkRPvKWzjE7zENRnWnOlGOR1Igsq
j5b6nZTAhEPK1Sf2kwKUtnnEUcBgDzFHropaX/3lQNXV22CHodVDQW1KmG7Pw9bT
LK3SKVzUSgNFMCz1b83kllL9apxcJrCDwqqKWiPvvl8lfzGbF+UQjvE0SdK/83qd
VhWFpOvXkFaLqoysTxK9yRgJPsgAUgDNPL6sI6oP1jq0/iNWQM29ILB3tv5nLwu/
vDizn1fWLFWMjVGJjpK6wAYuQeECrhq/hk6hCLeet+3C
-----END CERTIFICATE-----`;
  return jsonwebtoken.verify(token, cert, { algorithms: ['RS256']});
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
