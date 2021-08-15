import crypto, { CipherCCMTypes } from 'crypto'

export const encryptWithKey = (text: string, generatedKey: { iv: string; key: string }) => {
    const algorithm: CipherCCMTypes = 'aes-128-ccm'
    const { key, iv } = generatedKey

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return encrypted.toString('hex')
}

export const decrypteWithKey = (encryptedText: string, generatedKey: { iv: string; key: string }) => {
    const algorithm: CipherCCMTypes = 'aes-128-ccm'
    const { key, iv } = generatedKey

    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    const message = Buffer.from(encryptedText, 'hex')
    let decrypted = decipher.update(message)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}
