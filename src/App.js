import { useEffect, useState,useCallback } from "react";
import detectEthereumProvider from '@metamask/detect-provider'

import Web3 from "web3";

import { loadContract } from "./utils/load-contracts";

import "./App.css";

function App() {
  const [web3Api, setWeb3Api] = useState({ provider: null, web3: null,contract:null });
  const [account, setAccount] = useState(null);
  const [balance,setBalance]= useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      let provider = await detectEthereumProvider()
      const contract = await loadContract("Faucet",provider)
      if (provider) {
        console.log('Ethereum successfully detected!');
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        });
        
       
        }
       else {
        console.log('Please install MetaMask!')
      }

      // if (window.ethereum) {
      //   provider = window.ethereum;
      //   try {
      //     await provider.request({method:"eth_requestAccounts"});
      //   } catch (error) {
      //     console.log(error);
      //   }
      // } else if (window.web3) {
      //   provider = window.web3.currentProvider;
      // } else if (!process.env.production) {
      //   provider = new Web3.providers.HttpProvider("http//127.0.0.1:7545");
      // }

    
    };
    loadProvider();
    console.log(web3Api);
  }, []);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
      console.log(accounts);
    };

    web3Api.web3 && getAccounts();
  }, [web3Api.web3]);

  useEffect(() => {
    const getBalance = async () => {
      const {contract,web3}= web3Api;
      const balance= await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance,"ether"))
    };

    web3Api.contract && getBalance();
  }, [web3Api]);

  const addFunds= useCallback(async ()=>{
    const {contract,web3} = web3Api;
    await contract.addFunds({
      from:account,
      value:web3.utils.toWei("1","ether")
      
    })
    window.location.reload()
  },[web3Api,account]);

  const withdraw= useCallback(async ()=>{
    const {contract,web3} = web3Api;
    await contract.withdraw( web3.utils.toWei("1","ether"),{from:account})
    window.location.reload()
  },[web3Api,account]);

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <span>
          <strong>Account:</strong>
        </span>
        <h1>{account?account:'not connected'}</h1>
        <div className="balance-view is-size-2">
          Current Balance : <strong>{balance}</strong> ETH
        </div>
        <button className="button oncis-primary mr-2" onClick={addFunds}>Donate 1 Eth</button>
        <button className="button is-danger mr-2" onClick={withdraw}>Withdraw 1Eth</button>
      </div>
    </div>
  );
}

export default App;
