import React, { useEffect, useState } from 'react';
import './App.css';
import init, { pay_blobs, message_to_tx, auth_info_encode } from './pkg';

declare global {
  interface Window {
    keplr: any;
  }
}

const App: React.FC = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function setupKeplr() {
      if (window.keplr) {
        const chainId = "celestia-1"; 
        try {
          await window.keplr.experimentalSuggestChain({
          });

          await window.keplr.enable(chainId);
          const offlineSigner = window.keplr.getOfflineSigner(chainId);
          const accounts = await offlineSigner.getAccounts();
          const signerAddress = accounts[0].address;
          setInitialized(true);

          const namespace = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
          const data = new TextEncoder().encode("Sample data to send to Celestia");
          const shareVersion = 1;

          const blobResult = pay_blobs(signerAddress, namespace, data, shareVersion);
          console.log('Blob Result:', new Uint8Array(blobResult));

          const txBodyBytes = message_to_tx(blobResult);
          const pubKey = "your_public_key_base64";
          const sequence = BigInt(0);
          const coinDenom = "ucelestia"
          const coinAmount = "10000";
          const feeGas = BigInt(200000);
          const feePayer = signerAddress;
          const feeGranter = "";

          const authInfoBytes = auth_info_encode(
            pubKey,
            sequence,
            coinDenom,
            coinAmount,
            feeGas,
            feePayer,
            feeGranter
          );

          console.log("Tx to broadcast:", {
            bodyBytes: txBodyBytes,
            authInfoBytes: authInfoBytes,
            chainId: chainId,
          });

        } catch (error) {
          console.error("Error setting up Keplr:", error);
        }
      } else {
        console.log("Keplr extension not found.");
      }
    }

    if (!initialized) {
      setupKeplr();
    }
  }, [initialized]);

  return (
    <div className="App">
      <header className="App-header">
        <p>Celestia and Keplr integration example.</p>
      </header>
    </div>
  );
};

export default App;
