import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJfShqhRL092ykMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi03ZGt1ejE2aXkxNmFqZWJjLnVzLmF1dGgwLmNvbTAeFw0yNDExMTEw
NzE4MjdaFw0zODA3MjEwNzE4MjdaMCwxKjAoBgNVBAMTIWRldi03ZGt1ejE2aXkx
NmFqZWJjLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAOUfgRTiLp563Btzdai30fmA+zOBw6VGfApsedGpGnTKwk4iOlyRHwkdXPLp
c4HaiXWJIPcvz8KtSp9rZcM2+Sj+hsP80/3RwxM5YrUlxlpGxvINchYx0gCc8++5
RdDk06Y7I00td5mCcdW4zyXnJUsDg0zbPbdAr4evUVQSRjp42FUkL7OTvNoTauRk
yOnREjngjLkvJKlsaCQB+1Xd5hMXDm67t+qvFBF8Yat+5MEL/fBisG5nVOt02f75
+aTffg9O41SCNRtmkR6XK/hkgn9Gb96Ojfqnxh/YwpAniQiMIR4xgK1/V/pxLEZ3
K3ySBslrwsz2v4stesXX6MAkBMcCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQU8kphxPu1hx7+lTD+0TU7XuDDBL8wDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQAZHoinxwI/OgZkd5mMJVYfl/nkmU1iRcOgz8wdETO5
//T5agKoK/3plJG7WZntalE6oCrgzHB7Cjc8VxFlQeRIeWPeVGByHJHrwq0T+zRu
2vV7CKW614w/0Xx4bfoXmM3KcXyJNfKjxYsz2Wsh0hhHEM5iitzWaz9vX8yjW/p2
AxjGw1M7F3CHJs0nDSmsuAjVuj50iZUT3Noj8xZglWDDqseFUZAHn/BTBixdq3xJ
93xuf8JanbjA8504Jp0RyLSRvkxWZTaCDLzI7dKv4tGVat7Wmy6ARvquz80sBVg1
mnlrDsYWiial15Q+pWxTjY3ujc0XsUSbT/SbnUDhcMXq
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized');
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

  // TODO: Implement token verification
  jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
  return jwt.payload;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
