import React, { useEffect } from 'react';
import './App.css';
import { StargateClient} from '@cosmjs/stargate';
//import { pay_blobs, message_to_tx, auth_info_encode } from './pkg/';
//import * as wasm from './pkg';

declare global {
  interface Window {
    keplr: any;
  }
}

const App: React.FC = () => {
  useEffect(() => {
    async function main() {
      try {
        const wasm = await import('./pkg').catch(console.error);

        if (!wasm) {
          console.error("Failed to load Wasm module.");
          return;
        }

        console.log('wasm module loaded successfully');

        if (!window.keplr) {
          console.log("Keplr wallet not available");
          return;
        }

        const chainId = "celestia";
        await window.keplr.enable(chainId);

        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        console.log("ac 0:",accounts[0]);

        const signerAddress = accounts[0].address;

        const publicKey = accounts[0].pubkey;

        const publicKeyBase64 = Buffer.from(publicKey).toString('base64');
        console.log("Public Key:", publicKeyBase64);

        await prepareAndSendTransaction(wasm, signerAddress, chainId, publicKeyBase64);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    }

    main();
  }, []);

  async function prepareAndSendTransaction(wasm: any, signerAddress: string, chainId: string, publicKeyBase64: string) {
    try {

      const client = await StargateClient.connect("https://public-celestia-rpc.numia.xyz");
      const account = await client.getAccount(signerAddress);
      if (!account) {
        console.error("Account not found");
        return;
      }

      console.log('Account info:', account);
      const namespace = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
      const data = new TextEncoder().encode("Hello, Celestia!");
      const shareVersion = 1;
  
      console.log('Calling pay_blobs with:', { signerAddress, namespace, data, shareVersion });

      const blobResult = wasm.pay_blobs(signerAddress, namespace, data, shareVersion);
      console.log('Result from pay_blobs:', blobResult);
  
      const txBodyBytes = wasm.message_to_tx(blobResult);
      console.log('Result from message_to_tx:', txBodyBytes);
  
      const PublicKey = publicKeyBase64;
      const authInfoBytes = wasm.auth_info_encode(
        PublicKey,
        BigInt(account.sequence),
        "utia",
        "1000",
        BigInt(200000),
        signerAddress,
        signerAddress
      );
      console.log('Result from auth_info_encode:', authInfoBytes);
    } catch (error) {
      console.error('Error during transaction preparation??:', error);
    }
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello!</p>
      </header>
    </div>
  );
};

export default App;
