import React, { useEffect } from 'react';
import './App.css';

declare global {
  interface Window {
    keplr: any;
  }
}

const App: React.FC = () => {
  useEffect(() => {
    async function setupKeplr() {
      if (window.keplr) {
        const chainId = "celestia-1";
        try {
          await window.keplr.experimentalSuggestChain({
            chainId: chainId,
            chainName: "Celestia",
            rpc: "https://rpc.celestia.org", 
            rest: "https://api.celestia.org",
            bip44: { coinType: 118 },
            bech32Config: {
              bech32PrefixAccAddr: "celestia",
              bech32PrefixAccPub: "celestiapub",
              bech32PrefixValAddr: "celestiavaloper",
              bech32PrefixValPub: "celestiavaloperpub",
              bech32PrefixConsAddr: "celestiavalcons",
              bech32PrefixConsPub: "celestiavalconspub"
            },
            currencies: [{
              coinDenom: "CELESTIA",
              coinMinimalDenom: "uclestia",
              coinDecimals: 6,
            }],
            feeCurrencies: [{
              coinDenom: "CELESTIA",
              coinMinimalDenom: "uclestia",
              coinDecimals: 6,
            }],
            stakeCurrency: {
              coinDenom: "CELESTIA",
              coinMinimalDenom: "uclestia",
              coinDecimals: 6,
            },
            gasPriceStep: { low: 0.01, average: 0.025, high: 0.04 }
          });

          await window.keplr.enable(chainId);

          const key = await window.keplr.getKey(chainId);
          console.log("Keplr Key:", key);

          const signer = window.keplr.getOfflineSigner(chainId);
          const accounts = await signer.getAccounts();
          console.log("Accounts:", accounts);
        } catch (error) {
          console.error("Error setting up Keplr:", error);
        }
      } else {
        console.log("Keplr extension not found.");
      }
    }

    setupKeplr();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello 🙂.</p>
      </header>
    </div>
  );
}

export default App;
