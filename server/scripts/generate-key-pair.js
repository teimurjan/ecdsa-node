const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();
const publicKey = secp.getPublicKey(privateKey);

console.log(
  `PRIVATE KEY\n${toHex(privateKey)}\n\nPUBLIC KEY\n${toHex(publicKey)}`
);
