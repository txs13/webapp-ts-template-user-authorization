/**
 * This module will generate a public and private keypair and save to current directory
 *
 * Make sure to save the private key elsewhere after generated!
 */
import crypto from "crypto";
import fs from "fs";
import path from 'path'

const genKeyPair = () => {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
    privateKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
  });
  
  // Create the public key file
  const keysFolder = path.join(__dirname, "..","..","keys")
  fs.writeFileSync(path.join(keysFolder, "id_rsa_pub.pem"), keyPair.publicKey);

  // Create the private key file
  fs.writeFileSync(path.join(keysFolder, "id_rsa_priv.pem"), keyPair.privateKey);
};

export default genKeyPair