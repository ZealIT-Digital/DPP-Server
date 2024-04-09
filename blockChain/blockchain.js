import { Web3 } from "web3";

const contractABI = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    constant: true,
    inputs: [],
    name: "get",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "string",
        name: "_value",
        type: "string",
      },
    ],
    name: "set",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const contractAddress = "0x24942357E3A688ACE7C39710aA6d3C91BA1FAC39"; // Replace with your contract address
const privateKey =
  "0x11c26c2a80395196ba6147dab69ac95c3dc5b8f9aba0bbc753ef85f4384aa76a"; // Replace with your private key
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545"
  )
);

// Load contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// async function saveText(text) {
//   try {
//     const account = web3.eth.accounts.privateKeyToAccount(privateKey);
//     const data = contract.methods.set(text).encodeABI();
//     const gas = await contract.methods
//       .set(text)
//       .estimateGas({ from: account.address });
//     const tx = {
//       from: account.address,
//       to: contractAddress,
//       data: data,
//       gas: gas,
//       gasPrice: web3.utils.toWei("5", "gwei"),
//       nonce: await web3.eth.getTransactionCount(account.address),
//     };
//     const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
//     const receipt = await web3.eth.sendSignedTransaction(
//       signedTx.rawTransaction
//     );
//     const formattedReceipt = {
//       ...receipt,
//       cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
//       gasUsed: receipt.gasUsed.toString(),
//       blockNumber: receipt.blockNumber.toString(),
//       transactionIndex: receipt.transactionIndex.toString(),
//       effectiveGasPrice: receipt.effectiveGasPrice.toString(),
//     };
//     console.log("Transaction receipt:", formattedReceipt);
//     console.log(formattedReceipt);
//     return formattedReceipt;
//   } catch (error) {
//     console.error("Error in saveText:", error);
//   }
// }

async function saveText(text) {
  try {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const data = contract.methods.set(text).encodeABI();
    const gas = await contract.methods
      .set(text)
      .estimateGas({ from: account.address });
    const tx = {
      from: account.address,
      to: contractAddress,
      data: data,
      gas: gas.toString(), // Convert gas BigInt to string
      gasPrice: web3.utils.toWei("5", "gwei"),
      nonce: (await web3.eth.getTransactionCount(account.address)).toString(), // Convert nonce BigInt to string
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    // Function to recursively convert BigInts to strings
    const convertBigIntToString = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "bigint") {
          obj[key] = obj[key].toString();
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          convertBigIntToString(obj[key]);
        }
      }
    };

    // Convert BigInts to strings recursively in the receipt object
    convertBigIntToString(receipt);

    return receipt;
  } catch (error) {
    console.error("Error in saveText:", error);
  }
}

export async function addData(data) {
  try {
    let stringData = JSON.stringify(data);
    let result = await saveText(stringData);
    return result;
  } catch (error) {
    console.error("Error in main:", error);
  }
}


