import { Web3 } from "web3";
const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");

export async function retrieveData(txHash) {
  try {
    // Get transaction details
    const tx = await web3.eth.getTransaction(txHash);
    if (!tx) {
      console.error("Transaction not found");
      return;
    }

    // Extract input data
    const abiEncodedData = tx.input;

    // Extract function signature
    const functionSignature = abiEncodedData.slice(0, 10);

    // Extract encoded parameters
    const encodedParams = abiEncodedData.slice(10);

    // Extract the first parameter (uint256)
    const uint256Param = parseInt(encodedParams.slice(0, 64), 16);

    // Extract the second parameter (string)
    const stringParamLength = parseInt(encodedParams.slice(64, 128), 16) * 2; // Length in bytes
    const stringParamHex = encodedParams.slice(128, 128 + stringParamLength);

    // Decode the string parameter
    let stringParam = "";
    for (let i = 0; i < stringParamHex.length; i += 2) {
      const byte = stringParamHex.substr(i, 2);
      if (byte === "00") {
        break; // End of string
      }
      stringParam += String.fromCharCode(parseInt(byte, 16));
    }
    return stringParam;
  } catch (error) {
    console.error("Error:", error);
  }
}
