import React, { useEffect, } from 'react';
import './App.css';
import { StargateClient } from '@cosmjs/stargate';

var loading = false;

declare global {
  interface Window {
    keplr: any;
  }
}

const App: React.FC = () => {
  useEffect(() => {
    async function main() {
      try {
        if (loading) {
          return;
        }
        loading = true;
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

      const namespace = new Uint8Array([
        0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ]);
      const data = new TextEncoder().encode("Hello, Celestia!");
      const shareVersion = 1;

      if (!wasmModule || !wasmModule.pay_blobs) {
        console.error('WASM module or pay_blobs function is undefined.');
        return;
      }
  
      const blobResult = wasmModule.pay_blobs(signerAddress, namespace, data, shareVersion);
      const txBodyBytes = wasmModule.message_to_tx(blobResult);
      const authInfoBytes = wasmModule.auth_info_encode(
        publicKeyBase64,
        BigInt(account.sequence),
        "utia",
        "1000",
        BigInt(200000),
        signerAddress,
        signerAddress
      );
  
      const signDoc = {
        bodyBytes: txBodyBytes,
        authInfoBytes: authInfoBytes,
        chainId: chainId,
        accountNumber: account.accountNumber,
      };
  
      const { signature, signed } = await window.keplr.signDirect(
        chainId,
        signerAddress,
        {
          bodyBytes: signDoc.bodyBytes,
          authInfoBytes: signDoc.authInfoBytes,
          chainId: signDoc.chainId,
          accountNumber: signDoc.accountNumber,
        }
      );
  
      console.log('Signed document:', signed);
      console.log('Signature:', signature);
  
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
