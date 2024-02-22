import React, { useEffect, useState } from 'react';
import './App.css';
import init, { pay_blobs, message_to_tx, auth_info_encode } from './wasm_pay_for_blobs';
import { StargateClient } from '@cosmjs/stargate';

declare global {
  interface Window {
    keplr: any;
  }
}

const App: React.FC = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function initializeWasm() {
      try {
        await init();
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing WASM Module:', error);
      }
    }

    initializeWasm();
  }, []);

  useEffect(() => {
    async function blockchainOperations() {
      if (!window.keplr || !initialized) {
        console.log('Keplr not found or WASM not initialized');
        return;
      }

      const chainId = "celestia";
      await window.keplr.enable(chainId);
      const offlineSigner = window.keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      const signerAddress = accounts[0].address;

      const rpcEndpoint = "https://rpc.celestia.org";
      const client = await StargateClient.connect(rpcEndpoint);
      const accountOnChain = await client.getAccount(signerAddress);

      if (accountOnChain) {
        console.log('Account Number:', accountOnChain.accountNumber);
        console.log('Sequence:', accountOnChain.sequence);
      } else {
        console.log('Account not found on chain');
        return false;
      }

      const namespace = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); //sample data:|
      const data = new Uint8Array([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
      const shareVersion = 1;

      const blobResult = pay_blobs(signerAddress, namespace, data, shareVersion);
      console.log('Blob Result:', new Uint8Array(blobResult));

      const txBodyBytes = message_to_tx(blobResult);
      const pubKey = "your_public_key_base64";
      const sequence = BigInt(accountOnChain.sequence);
      const coinDenom = "ucelestia";
      const coinAmount = "1000000";
      const feeGas = BigInt(200000);
      const feePayer = signerAddress;
      const feeGranter = signerAddress;

      const authInfoBytes = auth_info_encode(
        pubKey,
        sequence,
        coinDenom,
        coinAmount,
        feeGas,
        feePayer,
        feeGranter
      );

      // Sign the tx
      const signResponse = await offlineSigner.signDirect(chainId, signerAddress, {
        bodyBytes: txBodyBytes,
        authInfoBytes: authInfoBytes,
        chainId: chainId,
      });

      // Broadcast the tx
      const broadcastResponse = await client.broadcastTx(signResponse.signed);
      console.log('Broadcast Response:', broadcastResponse);
    }

    blockchainOperations();
  }, [initialized]);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello :) </p>
      </header>
    </div>
  );
};

export default App;