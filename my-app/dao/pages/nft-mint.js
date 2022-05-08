import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Whitelist.module.css'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { NFTCOLLECTION_ADDRESS, abi } from '../constants/nftCollectionConstants'

export default function NFTMint() {
    const [walletConnected, setWalledConnected] = useState(false)
    const [presaleStarted, setPresaleStarted] = useState()
    const [timeLeftPresale, setTimeLeftPresale] = useState()
    const [mintedNFTs, setMintedNFTs] = useState()

    const getProviderOrSigner = async (needSigner = false) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const { chainId } = await provider.getNetwork()
        // if (chainId !== 4){
        //     window.alert("Connect to the rinkeby network")
        // }
        return needSigner ? signer : provider;
    }

    const isWalletConnected = async () => {
        try {
            const signer = await getProviderOrSigner(true)
            const account = await signer.getAddress()
            setWalledConnected(true)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        isWalletConnected()
    })

    const connectWallet = async () => {
        const provider = await getProviderOrSigner()
        await provider.send("eth_requestAccounts", [])
    }

    const isPresaleStarted = async () => {
      try {
        const provider = await getProviderOrSigner()
        const nftContract = new ethers.Contract(NFTCOLLECTION_ADDRESS, abi, provider)
        const presaleStarted = await nftContract.presaleStarted()
        setPresaleStarted(presaleStarted)
      } catch (err) {
        console.error(err)
      }
    }

    const numberMintedNFT = async () => {
      try {
        const provider = await getProviderOrSigner()
        const nftContract = new ethers.Contract(NFTCOLLECTION_ADDRESS, abi, provider)
        const numberMintedNFT = await nftContract.nftMinted();
        setMintedNFTs(numberMintedNFT);
      } catch (err) {
        console.error(err)
      }
    }

    useEffect(() => {
      if (walletConnected) {
        isPresaleStarted()
        numberMintedNFT()
      }
    }, [walletConnected])

    const timeUntilEndPresale = async () => {
      try {
        const provider = await getProviderOrSigner()
        const nftContract = new ethers.Contract(NFTCOLLECTION_ADDRESS, abi, provider)
        const endPresale = await nftContract.presaleEnd()
        // const date = (new Date()).getTime()
        const date = new Date()
        const timeLeft = new Date(endPresale - date)
        console.log(timeLeft.getHours())
      } catch (err) {
        console.error(err)
      }
    }

    useEffect(() => {
      // if (presaleStarted) {
        timeUntilEndPresale()
      // }
    }, [presaleStarted])

    return (
        <div>
          <Head>
            <title>NFT Mint</title>
            <meta name="description" content="NFT Minting" />
            <link rel="icon" href="/logo.png" />
            {/* <a href="https://www.flaticon.com/free-icons/environment" title="environment icons">Environment icons created by Freepik - Flaticon</a> */}
          </Head>
          {/* <ToastContainer /> */}
          {<div className={`${styles.banner} fw-bold d-flex align-items-center justify-content-center`}>Presale ends in X hours</div>}
          <nav className={styles.nav}>
            <img src="/logo.png" alt="energydao-logo" />
            {/* <a href="https://www.flaticon.com/free-icons/environment" title="environment icons">Environment icons created by Freepik - Flaticon</a> */}
          </nav>
          <main className={`container ${styles.main}`}>
          <div className="row align-items-md-center justify-content-sm-center">
            <div className="col">
              <h1>Mint a Bioengineered Animal</h1>
              <p>This NFT collection showcases what Earth would look like without biodiversity.</p>
              { walletConnected && <p>{`${mintedNFTs}/20 have been minted`}</p>}
              <div>
                <button type="button" className="btn btn-primary" onClick={connectWallet}>Connect Wallet</button>
              </div>
            </div>
            <div className="col mt-sm-5 Smt-md-0">
              <img src="/deer.png" alt="bioengineered deer" />
            </div>
          </div>

          </main>
        </div>
      )  
  
}