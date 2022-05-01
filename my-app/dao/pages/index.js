import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { ethers } from "ethers"
import { WHITELIST_ADDRESS, abi } from '../constants/index'

let provider
let signer

export default function Home() {
  const [isWhitelisted, setIsWhitelisted] = useState()
  const [nbWhitelisted, setNbWhitelisted] = useState(0)
  const [maxWhitelisted, setMaxWhitelisted] = useState()
  const [loading, setLoading] = useState(false)
  const [joined, setJoined] = useState(false)

  const initializeMaxWhitelisted = async () => {
    const whitelistContract = new ethers.Contract(WHITELIST_ADDRESS, abi, provider)
    const maxNbWhitelisted = await whitelistContract.maxWhitelistedAddr()
    setMaxWhitelisted(maxNbWhitelisted)
  }

  useEffect(() => {
    provider = new ethers.providers.Web3Provider(window.ethereum)
    signer = provider.getSigner()
    initializeMaxWhitelisted()
  }, [])

  const connectWallet = async () => {
    await provider.send("eth_requestAccounts", []);
  }

  const joinWhitelist = () => {
    const whitelistContract = new ethers.Contract(WHITELIST_ADDRESS, abi, signer)
    const tx = whitelistContract.addWhitelistedAddress()
    setLoading(true)
    // await tx.wait()
    setLoading(false)
    setJoined(true)
  }

  return (
    <div>
      <Head>
        <title>Whitelist</title>
        <meta name="description" content="Whitelist Sign" />
        <link rel="icon" href="/logo.png" />
        {/* <a href="https://www.flaticon.com/free-icons/environment" title="environment icons">Environment icons created by Freepik - Flaticon</a> */}
      </Head>
      <nav className={`${styles.nav} d-flex justify-content-between`}>
        <img src="/logo.png" alt="energydao-logo" />
        {/* <a href="https://www.flaticon.com/free-icons/environment" title="environment icons">Environment icons created by Freepik - Flaticon</a> */}
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={connectWallet}
        >
          Connect
        </button>
      </nav>
      <main className={`container ${styles.main}`}>
        <div className="row align-items-md-center justify-content-sm-center">
          <div className="col">
            <h1>Welcome to EnergyDAO!</h1>
            <p>It's an NFT Collection for Energizers.</p>
            <p>There is {nbWhitelisted} / {maxWhitelisted} spots left</p>
            <div>
              <button 
                type="button" 
                className="btn btn-success"
                onClick={joinWhitelist}
              >
                Join the Whitelist
              </button>
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
