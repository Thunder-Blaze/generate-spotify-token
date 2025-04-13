import axios from 'axios'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import chalk from 'chalk'

function encrypt(text: string, encryptionKey: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        crypto.createHash('sha256').update(encryptionKey).digest(),
        iv
    )
    let encrypted = cipher.update(text, 'utf-8', 'hex')
    encrypted += cipher.final('hex')
    return iv.toString('hex') + ':' + encrypted
}

function decrypt(data: string, encryptionKey: string): string {
    const [ivHex, encrypted] = data.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        crypto.createHash('sha256').update(encryptionKey).digest(),
        iv
    )
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8')
    decrypted += decipher.final('utf-8')
    return decrypted
}

export async function generateSpotifyAccessToken(clientId: string, clientSecret: string, encryptionKey: string = '$up3r_S3cr3!_k3y', tokenFolder: string = ''): Promise<string | null> {
    const cacheFilePath = path.resolve(tokenFolder,'.spotify-token')

    interface CachedToken {
        access_token: string
        expires_at: number
    }

    const now = Math.floor(Date.now() / 1000) // in seconds

    // 1. Try reading the encrypted token from file
    try {
        const encryptedData = await fs.readFile(cacheFilePath, 'utf-8')
        const decrypted = decrypt(encryptedData, encryptionKey)
        const cached: CachedToken = JSON.parse(decrypted)

        if (cached.access_token && cached.expires_at > now) {
            return cached.access_token
        }
    } catch {
        // no-op if file doesn't exist or decryption fails
    }

    // 2. Fetch a new token from Spotify
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({ grant_type: 'client_credentials' }),
            {
                headers: {
                    Authorization:
                        'Basic ' +
                        Buffer.from(
                            `${clientId}:${clientSecret}`
                        ).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )

        const { access_token, expires_in } = await response.data

        const tokenData: CachedToken = {
            access_token,
            expires_at: now + expires_in,
        }

        const encrypted = encrypt(JSON.stringify(tokenData), encryptionKey)
        await fs.writeFile(cacheFilePath, encrypted, 'utf-8')

        console.log(chalk.hex('#000000').bgCyanBright.bold(' SPOTIFY ACCESS TOKEN GENERATED SUCCESSFULLY'))
        // console.log(access_token)


        return access_token
    } catch (error) {
        console.error('❌ Failed to get Spotify access token', error)
        return null
    }
}