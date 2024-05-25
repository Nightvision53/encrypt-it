import * as openpgp from 'openpgp'

export { encryptMessage, decryptMessage, generateKeys }

const encryptMessage = async ({
  publicKey,
  privateKey,
  message,
}: {
  publicKey: openpgp.Key
  privateKey: openpgp.PrivateKey
  message: string
}) => {
  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: message }), // input as Message object
    encryptionKeys: publicKey,
    signingKeys: privateKey, // optional
  })

  return encrypted // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
}

const decryptMessage = async ({
  publicKeyArmored,
  privateKeyArmored,
  encrypted,
  passphrase,
}: {
  publicKeyArmored: string
  privateKeyArmored: string
  encrypted: string
  passphrase: string
}) => {
  const message = await openpgp.readMessage({
    armoredMessage: encrypted, // parse armored message
  })

  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored })

  const privateKey = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
    passphrase,
  })

  const { data: decrypted, signatures } = await openpgp.decrypt({
    message,
    verificationKeys: publicKey, // optional
    decryptionKeys: privateKey,
  })

  try {
    await signatures[0].verified // throws on invalid signature

    return decrypted
  } catch (e: any) {
    throw new Error('Signature could not be verified: ' + e.message)
  }
}

const generateKeys = async ({ name, email }: { name: string; email: string }) => {
  // generate the keys
  // create aromored keys and put them in the local storage
  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa', // Type of the key
    rsaBits: 4096, // RSA key size (defaults to 4096 bits)
    userIDs: [{ name, email }], // you can pass multiple user IDs
    format: 'armored',
  })

  return { privateKey, publicKey }
}
