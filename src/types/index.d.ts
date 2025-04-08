// index.d.ts

declare module 'spotify-access-token' {
    /**
     * Encrypts a string using AES-256-CBC encryption with a given key.
     * 
     * @param text - The plain text to encrypt.
     * @param encryptionKey - The key to use for encryption.
     * @returns The encrypted string, including the initialization vector (IV) in hex format.
     */
    export function encrypt(text: string, encryptionKey: string): string;

    /**
     * Decrypts an encrypted string using AES-256-CBC decryption with a given key.
     * 
     * @param data - The encrypted data, which includes the IV in hex format.
     * @param encryptionKey - The key to use for decryption.
     * @returns The decrypted plain text string.
     */
    export function decrypt(data: string, encryptionKey: string): string;

    /**
     * Generates or retrieves a Spotify access token using client credentials.
     * 
     * If a valid cached token exists and has not expired, it will be returned.
     * If no valid cached token exists, a new token will be fetched from the Spotify API.
     * 
     * @param clientId - The client ID for the Spotify API.
     * @param clientSecret - The client secret for the Spotify API.
     * @param encryptionKey - The key used for encrypting and decrypting the cached token (optional).
     * @returns The Spotify access token, or null if there was an error.
     */
    export function generateSpotifyAccessToken(
        clientId: string,
        clientSecret: string,
        encryptionKey?: string
    ): Promise<string | null>;
}
