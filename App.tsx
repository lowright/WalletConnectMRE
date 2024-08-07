/* eslint-disable */
import '@walletconnect/react-native-compat';

import {useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {Core} from '@walletconnect/core';
import {Web3Wallet} from '@walletconnect/web3wallet';

const core = new Core({
  projectId: 'acbcd71cd6321fe035d4e23718352e01',
});

//eslint-ignore

const App = ({}) => {
  const [wallet, setWallet] = useState(null);
  const [walletConnectURL, setWalletConnectURL] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);

  const connectWallet = async () => {
    console.log('Run connect...');
    try {
      const web3wallet = await Web3Wallet.init({
        core,
        metadata: {
          name: 'ACM Wallet',
          description: 'ACM wallet app',
          url: 'www.walletconnect.com',
          icons: ['https://your_wallet_icon.png'],
          redirect: {
            native: 'acm-wallet://',
          },
        },
      });

      web3wallet.on('session_proposal', async proposal => {
        console.log('Session Proposal:', proposal);

        const requiredNamespaces = proposal.params.requiredNamespaces;
        const namespaces = {};
        // Создаем namespaces на основе требуемых namespaces
        Object.keys(requiredNamespaces).forEach(key => {
          namespaces[key] = {
            methods: requiredNamespaces[key].methods,
            chains: requiredNamespaces[key].chains,
            events: requiredNamespaces[key].events,
            accounts: requiredNamespaces[key].chains.map(
              chain => `${chain}:${account}`,
            ),
          };
        });

        try {
          const session = await web3wallet.approveSession({
            id: proposal.id,
            namespaces,
          });

          console.log('Session approved:', session);
          setSessionInfo(session); // Сохраняем информацию о сессии
        } catch (error) {
          console.error('Error approving session:', error);
        }
      });

      web3wallet.on('session_delete', () => {
        console.log('Session deleted');
        reset();
      });

      setWallet(web3wallet);
    } catch (e) {
      console.log(e);
    }
  };

  // await wallet.pair({ uri: code[0]?.value });

  useEffect(() => {
    connectWallet();
  }, []);

  const connectToDApp = async () => {
    console.log('Connect by URL Wallet Connect...');
    try {
      await wallet.pair({uri: walletConnectURL});
      console.log('Success connect by URL Wallet Connect...');
    } catch (err) {
      console.log(err);
    }
  };

  const disconnect = async () => {
    console.log('Disconnecting...');
    try {
      await wallet.disconnectSession({
        topic: sessionInfo.topic,
        reason: {
          code: 1000,
          message: 'User disconnected',
        },
      });
      console.log('Disconnected successfully.');
      reset();
    } catch (err) {
      console.log(err);
    }
  };

  const reset = () => {
    setWalletConnectURL(null);
    setSessionInfo(null); // Сбрасываем информацию о сессии при сбросе
  };

  return (
    <View>
      <Text>Wallet Connect</Text>
    </View>
  );
};

export default App;
