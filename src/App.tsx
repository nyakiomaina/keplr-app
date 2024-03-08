import React, { useEffect, } from 'react';
import './App.css';
import { StargateClient } from '@cosmjs/stargate';

declare global {
  interface Window {
    keplr: any;
  }
}

const App: React.FC = () => {
  useEffect(() => {
    async function main() {
      try {
        console.log('Loading WASM modules...');
        const wasm = await import('./pkg');
       

        console.log('WASM module initialized:', wasm);

        if (!window.keplr) {
          console.error("Keplr wallet not available");
          return;
        }

        const chainId = "celestia";
        await window.keplr.enable(chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();

        if (!accounts || accounts.length === 0) {
          console.error("No accounts found.");
          return;
        }

        console.log("Account 0:", accounts[0]);
        const signerAddress = accounts[0].address;
        const publicKey = accounts[0].pubkey;
        const publicKeyBase64 = Buffer.from(publicKey).toString('base64');
        console.log("Public Key:", publicKeyBase64);

        if (wasm) {
          await prepareAndSendTransaction(wasm, signerAddress, chainId, publicKeyBase64);
        } else {
          console.error('WASM module is not loaded.');
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    }

    main();
  }, []);

  async function prepareAndSendTransaction(wasmModule: any, signerAddress: string, chainId: string, publicKeyBase64: string) {
    try {
      const client = await StargateClient.connect("https://public-celestia-rpc.numia.xyz");
      const account = await client.getAccount(signerAddress);
      if (!account) {
        console.error("Account not found");
        return;
      }

      const namespace = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
      const data = new TextEncoder().encode("Hello, Celestia!");
      const shareVersion = 1;

      console.log('WASM object before calling pay_blobs:', wasmModule);
      if (wasmModule && wasmModule.pay_blobs) {
        console.log('pay_blobs function is defined, proceeding to call it.');
        const blobResult = wasmModule.pay_blobs(signerAddress, namespace, data, shareVersion);
        console.log('Result from pay_blobs:', blobResult);

        const txBodyBytes = wasmModule.message_to_tx(blobResult);
        console.log('Result from message_to_tx:', txBodyBytes);
      } else {
        console.error('pay_blobs function is undefined.');
      }
  
      const PublicKey = publicKeyBase64;
      const authInfoBytes = wasmModule.auth_info_encode(
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
      console.error('Error during transaction preparation:', error);
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
