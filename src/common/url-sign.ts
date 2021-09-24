import url = require('url');
import crypto = require('crypto');
import * as jwt from 'jsonwebtoken';

const keypairId = 'KJU3RA9OPJKXG';

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA3Y3E2erEWWYS5fB+o9A5XmpP1exEBtHVVfcQMkrwjs9L+F7t
Yk6BI7L+YeO+U9fj05OFT6qBC4W+ODgBVQn3Pe/n7RfS/m2GnWVGSDFNYP/h1RLj
KhbKqamgtfZmwyd7OuWQVb0X2SvhdARNq2wgaz/cvr2YUchcM+8sVldCfirgV1cv
kNlnPWxpr4db1uTHv8SGISoyjM6G+qWxavm47tleby9ewsh9Q5BMrdT0/+bcL7q2
GpoTa/rTRe0uM99aX/BSxTRsAFm0rPoETe/JZ4ZSQTMJDy7bKFCWJFhwtQJjoTKp
zIhPLAQyF4jusxdGQejoMII/E7zVeeouqNa3YQIDAQABAoIBAQCffwwUBVrNMRqx
xmyk6aYjPk2zJ5/hePYoKPDUA/ciGEIMz+n9N57oYFeZiSbfnTA6hJ0YORslfGbw
egEbg00mnatNmDUhTR/394ydNEEMb6nYhvxatIW5lpBH7tcT7zxbriA2WSbuBRUN
PHvdyL2d+B+mgT9CwQb/rFMy5SbNRCHOE0ukneyz6J4L0GtZGQPen+FQL3HysNbp
wUHKDyVGe7Xa6u03I15pvNGNBbvpJSAIf+RxCE3kw22ndQZExqoIXytKiwJFFnff
KxIL9Nz+8dbhs3GiLyMPOGODxRUDn/SaXUR8JHt3AwoN2bVgXdFqc21pcHcTZRjJ
0V4/4W3xAoGBAO8koQ2R/JkFhjFpYccbriqf6cT05dhWoxs/qzgY/VR/octkL8OR
iiPljK0+pd/yrAhAt9ZkRrqiMQwACcH+Vo5zcKWEUz3XJv/4/W+MMWMieCR2wFvo
OMV2MWWdpNUCoo9QV9PeyXdZvM5Bitw9/54D1HC0hw2lSI9NZZsF4E07AoGBAO0r
vQwNnOE4oUx03MSq3kBGtMtfnWSNiQWewxvz79nYSAY2YXgmlWrl7fG5789Hb0I0
Evkk+BY81aMvY2yXC75zZ6yBlrsVz/Jrsiw8LrwcTSd/xe/cntljk+CylYWkPVyr
kV+cp1bx9ApYU7Lyss9qvhA7rvcoHDgzzHtoczQTAoGAGTQYETEQmSP+55g+qNhe
+7kMzygsTSecWxPTvL7NfClTaPcvHYJqN6xKrjuLCdYukVQYy+yXk7XiS2x5mstu
XecGuTr/9uWFA7c/JpF05wjL9rPZRBZuXUk+nYIGzDhR357NEtRJEV4QywAXXWzf
Usz+h75O+X4w7oFusu7km98CgYBc9j/rcYqEXQYcSdIe5DqpRw2miZvPxgpnQYuI
cV0aLkRM6xPZXIZEmEtj7FWrEXzyniaxsWPsk3vJstFtxua7h9CjNUg3nJ0dkEkO
Paiz4wP674JOOlOpMfbMpDMnZvEGWdlpeKW+1qepRmXIRoj/8/77rekux3IINYV4
+b/uMQKBgQDuI00gab6L5uYdL97iCkSDuiU/fgRLNZ+ZpuaF9PsmcIZcNXS8R3ZV
oDeMVEk4UnxsPEAlgT9L4jq/iFyQjLdotO8AjZ/y53gs1SEvEMDjFhKqqIbGPtuZ
kD1YxPHNRxdSLxwx2JeF2h+b9hNiGuA2lhvRcr+zF6qenQ08UaPpAg==
-----END RSA PRIVATE KEY-----
`;

function getPolicy(url: string, expireTime: number): unknown {
  return {
    Statement: [
      {
        Resource: url.replace(/\/video\/[^/]*$/, '/video/*'),
        Condition: {
          DateLessThan: {
            'AWS:EpochTime': expireTime,
          },
        },
      },
    ],
  };
}

function createPolicySignature(policy: unknown, privateKey: string): string {
  const sign = crypto.createSign('RSA-SHA1');
  sign.update(JSON.stringify(policy));

  return sign.sign(privateKey, 'base64');
}
function normalizeBase64(str: string): string {
  return str
    .replace(/\+/g, '-')
    .replace(/=/g, '_')
    .replace(/\//g, '~');
}
export function SignToken(cfUrl: string, date: number): string {
  const key = process.env.AWS_VIDEO_KEY;
  const parsedUrl = new url.URL(cfUrl);
  const token = jwt.sign(
    {
      path: parsedUrl.pathname.replace(/-playlist\.m3u8$/, '.*'),
    },
    key,
    { subject: 'video-playback', expiresIn: Math.round((date - new Date().valueOf()) / 1000) },
  );
  return token;
}

export function SignUrl(cfUrl: string, date: number): string {
  const token = SignToken(cfUrl, date);
  const parsedUrl = new url.URL(cfUrl);
  parsedUrl.search = '';
  parsedUrl.searchParams.set('token', token);
  return parsedUrl.toString();
}

export function SignUrlC(cfUrl: string, date: number): string {
  date = Math.round(date / 1000);
  const policy = getPolicy(cfUrl, date);
  const signature = createPolicySignature(policy, privateKey);
  const policyStr = Buffer.from(JSON.stringify(policy)).toString('base64');
  const parsedUrl = new url.URL(cfUrl);
  parsedUrl.search = '';
  parsedUrl.searchParams.set('Expires', '' + date);

  parsedUrl.searchParams.set('Policy', normalizeBase64(policyStr));
  parsedUrl.searchParams.set('Signature', normalizeBase64(signature));
  parsedUrl.searchParams.set('Key-Pair-Id', keypairId);
  return parsedUrl.toString();
}
