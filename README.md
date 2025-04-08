# @thunderblaze/generate-spotify-token
- A Package that will help you create and cache the spotify token generated from your credentials until the token expires.

## USAGE
```js
import { generateSpotifyAccessToken } from '@thunderblaze/generate-spotify-token';

async function getToken() {
    const clientId = 'your-client-id';
    const clientSecret = 'your-client-secret';
    const encryptionKey = 'your-encryption-key';
    const token = await generateSpotifyAccessToken(clientId, clientSecret, encryptionKey);
    console.log(token);
}

getToken();
```