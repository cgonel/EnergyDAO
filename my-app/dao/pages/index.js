import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { WHITELIST_ADDRESS, abi } from '../constants/index'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [isWhitelisted, setIsWhitelisted] = useState()
  const [nbWhitelisted, setNbWhitelisted] = useState()
  const [maxWhitelisted, setMaxWhitelisted] = useState()
  const [loading, setLoading] = useState(false)
  const [joinedWhitelist, setJoinedWhitelist] = useState(false)

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const {chainId} = await provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
    }
    return needSigner ? signer : provider
  }

  const isWalletConnected = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      await signer.getAddress()
      setWalletConnected(true)
    } catch (err) {
      console.error(err, "User is not connected")
    }
  }

  useEffect(() => {
    isWalletConnected()
  })

  const getNbWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner()
      const whitelistContract = new ethers.Contract(WHITELIST_ADDRESS, abi, provider)
      const nbWhitelistedAddr = await whitelistContract.numberWhitelistedAddr()
      setNbWhitelisted(nbWhitelistedAddr)
    } catch (err) {
      console.error(err)
    }
  }

  const getMaxWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner()
      const whitelistContract = new ethers.Contract(WHITELIST_ADDRESS, abi, provider)
      const maxNbWhitelisted = await whitelistContract.maxWhitelistedAddr()
      setMaxWhitelisted(maxNbWhitelisted)
    } catch (err) {
      console.error(err)
    }
  }

  const isAddressWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner()
      const signer = await getProviderOrSigner(true)
      const account = await signer.getAddress()
      const whitelistContract = new ethers.Contract(WHITELIST_ADDRESS, abi, provider)
      const isWhitelisted = await whitelistContract.whitelistedAddrs(account)
      setIsWhitelisted(isWhitelisted)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (walletConnected) {
      getNbWhitelisted() 
      getMaxWhitelisted()
      isAddressWhitelisted()
    }
  }, [walletConnected])

  const connectWallet = async () => {
    const provider = await getProviderOrSigner()
    await provider.send("eth_requestAccounts", []);
    setWalletConnected(true)
  }

  const notify = () => toast.success("Succesfully joined the Whitelist!");

  const joinWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const whitelistContract = new ethers.Contract(WHITELIST_ADDRESS, abi, signer)
      const tx = await whitelistContract.addWhitelistedAddress()
      setLoading(true)
      await tx.wait()
      setLoading(false)
      setJoinedWhitelist(true)
      notify()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    setNbWhitelisted(prevNb => (
      prevNb++
    ))
  }, [joinedWhitelist])

  // returns button element based on if wallet is connected, is the user already whitelisted or is the whitelist done
  const getButton = () => {
    if (!walletConnected) {
      return ( 
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
      )
    } else if (isWhitelisted || joinedWhitelist) {
      return ( 
        <div>Thanks for joining the Whitelist!</div>
      )
    } else if (loading) {
      return ( 
        <button type="button" className="btn btn-success">
          Loading...
        </button>
      )
    } else if (maxWhitelisted == nbWhitelisted) {
      return ("")
    } else {
      return ( 
          <button 
            type="button" 
            className="btn btn-success"
            onClick={joinWhitelist}
          >
            Join the Whitelist
          </button>
      )
    }
  }

  return (
    <div>
      <Head>
        <title>Whitelist</title>
        <meta name="description" content="Whitelist Sign" />
        <link rel="icon" href="/logo.png" />
        {/* <a href="https://www.flaticon.com/free-icons/environment" title="environment icons">Environment icons created by Freepik - Flaticon</a> */}
      </Head>
      <ToastContainer />
      <nav className={styles.nav}>
        <img src="/logo.png" alt="energydao-logo" />
        {/* <a href="https://www.flaticon.com/free-icons/environment" title="environment icons">Environment icons created by Freepik - Flaticon</a> */}
      </nav>
      <main className={`container ${styles.main}`}>
        <div className="row align-items-md-center justify-content-sm-center">
          <div className="col">
            <h1>Welcome to EnergyDAO!</h1>
            <p>The whitelist will grant you early access to our NFT Collection launch.</p>
            { walletConnected && <p>{`There's ${maxWhitelisted - nbWhitelisted} spots left`}</p>}
            <div>
              {getButton()}
            </div>
          </div>
          <div className="col mt-sm-5 Smt-md-0">
            <img src="/whitelist_join.svg" alt="join-whitelist" />
          </div>
        </div>
      </main>
    </div>
  )
}
