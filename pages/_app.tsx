import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from '../providers/ThemeContext';


import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core'

function getLibrary(provider: any) {
  return new Web3(provider);
}

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider>
      <ThemeProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
      </ThemeProvider>
    </ChakraProvider>
  )
}

export default MyApp
