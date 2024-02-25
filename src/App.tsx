import React, { useEffect } from 'react';
import './App.css';
import { StargateClient} from '@cosmjs/stargate';
import init, { pay_blobs, message_to_tx, auth_info_encode } from './pkg';

declare global {
  interface Window {
    keplr: any;
  }
}

const App: React.FC = () => {
  useEffect(() => {
    async function main() {
      try {
        await init();

        if (!window.keplr) {
          console.log("Keplr wallet not available");
          return;
        }

        const chainId = "celestia";
        await window.keplr.enable(chainId);

        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        const signerAddress = accounts[0].address;

        await prepareAndSendTransaction(signerAddress, chainId);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    }

    main();
  }, []);

  async function prepareAndSendTransaction(signerAddress: string, chainId: string) {
    // dummy data
    const namespace = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
    const data = new TextEncoder().encode("Hello, Celestia!");
    const shareVersion = 1;

    const blobResult = pay_blobs(signerAddress, namespace, data, shareVersion);
    const txBodyBytes = message_to_tx(blobResult);

    const client = await StargateClient.connect("https://rpc.celestia.org");
    const account = await client.getAccount(signerAddress);

    if (!account) {
      console.error("Account not found");
      return;
    }

    const dummyPublicKey = "A1b2C3d4E5f6g7H8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6a7B8C9d0E1f2==";

    const authInfoBytes = auth_info_encode(
      dummyPublicKey,
      BigInt(account.sequence),
      "CELESTIA",
      "1000",
      BigInt(200000),
      signerAddress,
      signerAddress
    );
    const txBodyHex = Buffer.from(txBodyBytes).toString('hex');
    const authInfoHex = Buffer.from(authInfoBytes).toString('hex');

    console.log('Prepared txBodyBytes:', txBodyHex);
    console.log('Prepared authInfoBytes:', authInfoHex);
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
