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
        const chainId =  "celestia";
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

          const offlineSigner = window.keplr.getOfflineSigner(chainId);
          const accounts = await offlineSigner.getAccounts();
          const signerAddress = accounts[0].address;

          const bodyBytes = Uint8Array.from(atob("Cp0BCiAvY2VsZXN0aWEuYmxvYi52MS5Nc2dQYXlGb3JCbG9icxJ5Ci9jZWxlc3RpYTE1YXNsMHllc2VuZm5lNzlyMzhhMGRmNHZzMmZqdnM5NGM3dGV5dxIdAAAAAAAAAAAAAAAAAAAAAAAAAAAADBuw7+PjGs8aAsgBIiCvP7B5dz6qbJDevAA5/7yTQCmh0lEUM/D3DwQzd+neG0IBAA=="), c => c.charCodeAt(0));

          let result = await window.keplr.signDirect(chainId, signerAddress, {
            bodyBytes: bodyBytes,
            authInfoBytes: new Uint8Array(),
            chainId: chainId,
          });

          console.log("Sign result:", result);
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
};

export default App;