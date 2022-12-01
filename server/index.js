const express = require("express");
const { sha256 } = require("ethereum-cryptography/sha256");
const secp = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const cors = require("cors");

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04fce72a5533c4e1ee43660b57f37f6c6896b7a4217ec9469ce570b5fc6f7de68ec3b50cd12e2bcabf47fa796766384ac3536da7b3ddefde913ec34bdb6bf937d9": 100,
  "042d19224c143304863371be9ca7f2b001f087c76bee3e9791a0dd72dbf48b6e1d650719abb1ec0f5c4f20d4d6db68cab4770d6ff841a019812f93749cfaa5d838": 50,
  "04c6a981147c049a0ed6e934e464cbaffabb5ad1d392ea21b280224c26168b502ea369aaa83a36db1c94753800b8b5bd6ee9204978252e6a3cb3f2d2a04e02999f": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, recovery, recipient, amount } = req.body;

  const hash = sha256(utf8ToBytes(`${recipient}${amount}`));
  const sender = toHex(secp.recoverPublicKey(hash, signature, recovery));

  if (!balances[sender]) {
    res.status(400).send({ message: "Something went wrong!" });
    return;
  }

  if (!balances[recipient]) {
    res.status(400).send({ message: "Invalid recipient address!" });
    return;
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
