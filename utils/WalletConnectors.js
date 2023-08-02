import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";


const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 100, 137, 80001],
})

const walletconnect = new WalletConnectConnector({
    rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
    bridge: "https://bridge.walletconnect.org",
    qrcode: true
});
  
const walletlink = new WalletLinkConnector({
    url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
    appName: "gfc-weapon-forge",
    supportedChainIds: [1, 3, 4, 5, 42, 100, 137, 80001],
});

export const connectors = {
    injected: injected,
    walletConnect: walletconnect,
    coinbaseWallet: walletlink
};