import Web3 from "web3";

const contractABI = [
  {
    inputs: [],
    name: "getData",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_newData",
        type: "string",
      },
    ],
    name: "storeData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "storedData",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

let contractAddress = "";
let privateKey = "";
let httpURL = "https://data-seed-prebsc-1-s1.binance.org:8545";
let web3;
let contract;

const setConnection = async (connectionData) => {
  contractAddress = connectionData["Contract Address"];
  privateKey = connectionData["Private Key"];
  httpURL = connectionData["Web3 URL"];

  console.log({
    contractAddress: contractAddress,
    privateKey: privateKey,
    httpURL: httpURL,
  });

  // Initialize web3 and contract instance
  web3 = new Web3(new Web3.providers.HttpProvider(httpURL));
  contract = new web3.eth.Contract(contractABI, contractAddress);

  // Validate the contract address
  if (!web3.utils.isAddress(contractAddress)) {
    throw new Error(`Invalid contract address: ${contractAddress}`);
  }
};

async function saveText(text) {
  try {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const data = contract.methods.storeData(text).encodeABI();

    const gas = await contract.methods
      .storeData(text)
      .estimateGas({ from: account.address });

    const tx = {
      from: account.address,
      to: contractAddress,
      data: data,
      gas: gas.toString(), // Convert gas to string
      gasPrice: web3.utils.toWei("5", "gwei"),
      nonce: (await web3.eth.getTransactionCount(account.address)).toString(), // Convert nonce to string
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

export async function addData(data, activeConnection) {
  try {
    await setConnection(activeConnection); // Ensure setConnection completes
    let stringData = JSON.stringify(data);
    let result = await saveText(stringData);
    return result;
  } catch (error) {
    console.error("Error in addData:", error);
  }
}
