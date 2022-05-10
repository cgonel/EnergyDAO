import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Whitelist.module.css'
import { useState, useEffect } from 'react'
import { BigNumber, ethers } from 'ethers'
import { NFTCOLLECTION_ADDRESS, abi } from '../constants/nftCollectionConstants'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NFTMint() {
    const [walletConnected, setWalledConnected] = useState(false)
    const [presaleStarted, setPresaleStarted] = useState()
    const [presaleEnded, setPresaleEnded] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    const [hoursLeftPresale, setHoursLeftPresale] = useState()
    const [mintedNFTs, setMintedNFTs] = useState(0)
    const [loading, setLoading] = useState()

    const getProviderOrSigner = async (needSigner = false) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const { chainId } = await provider.getNetwork()
        if (chainId !== 4){
            window.alert("Connect to the rinkeby network")
        }
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
      try {
        const provider = await getProviderOrSigner()
        await provider.send("eth_requestAccounts", [])
        setWalledConnected(true)
      } catch (err) {
        console.error(err)
      }
    }

    const isPresaleStarted = async () => {
      try {
        const provider = await getProviderOrSigner()
        const nftContract = new ethers.Contract(NFTCOLLECTION_ADDRESS, abi, provider)
        const presaleStarted = await nftContract.presaleStarted()
        setPresaleStarted(presaleStarted)
        presaleStarted ? isPresaleEnded() : isConnectedOwner()
      } catch (err) {
        console.error(err)
      }
    }

    const isPresaleEnded = async () => {
      try {
        const provider = await getProviderOrSigner()
        const nftContract = new ethers.Contract(NFTCOLLECTION_ADDRESS, abi, provider)
        const { _hex  } = await nftContract.presaleEnd()
        let presaleEnd = Number(_hex)
        presaleEnd = new Date(presaleEnd * 1000)
        const currentTime = new Date()
        setPresaleEnded(currentTime > presaleEnd ? true : false)
      } catch (err) {
        console.error(err)
      }
    }

    const isConnectedOwner = async () => {
      try {
        const provider = await getProviderOrSigner()
        const signer = await getProviderOrSigner(true)
        const nftContract = new ethers.Contract(NFTCOLLECTION_ADDRESS, abi, provider)
        const owner = await nftContract.owner()
        const connectedAddress = await signer.getAddress()
        owner == connectedAddress ? setIsOwner(true) : setIsOwner(false)
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

    const notifyPresaleStarted = () => toast.success("Presale started successfully")

    const startPresale = async () => {
      try {
        const signer = await getProviderOrSigner(true)
        const nftContract = new ethers.Contract(NFTCOLLECTION_ADDRESS, abi, signer)
        const tx = await nftContract.startPresale()
        setLoading(true)
        await tx.wait()
        setLoading(false)
        setPresaleStarted(true)
        notifyPresaleStarted()
      } catch (err) {
        console.error(err)
      }
    }

    const timeUntilEndPresale = async () => {
      try {
        const provider = await getProviderOrSigner()
        const nftContract = new ethers.Contract(NFTCOLLECTION_ADDRESS, abi, provider)
        const {_hex} = await nftContract.presaleEnd()
        const endPresale = Number(_hex) * 1000
        const date = new Date()
        const timeLeft = endPresale - date
        const hoursLeft = Math.floor(timeLeft / (60*60*1000))
        setHoursLeftPresale(hoursLeft)
      } catch (err) {
        console.error(err)
      }
    }

    useEffect(() => {
      if (presaleStarted && !presaleEnded) {
        timeUntilEndPresale()
      }
    }, [presaleStarted])

    const notifyMint = () => toast.success("Successfully minted a Bioengineered Animal NFT")

    const presaleMint = async () => {
      try {
        const signer = await getProviderOrSigner(true)
        const nftContract = new ethers.Contract(NFTCOLLECTION_ADDRESS, abi, signer)
        const tx = await nftContract.presaleMint({value: ethers.utils.parseEther("0.005")})
        setLoading(true)
        await tx.wait()
        setLoading(false)
        notifyMint()
        setMintedNFTs(prevState => prevState + 1)
      } catch (err) {
        console.error(err)
      }
    }

    const mint = async () => {
      try {
        const signer = await getProviderOrSigner(true)
        const nftContract = new ethers.Contract(NFTCOLLECTION_ADDRESS, abi, signer)
        const tx = await nftContract.saleMint({value: ethers.utils.parseEther("0.01")})
        setLoading(true)
        await tx.wait()
        setLoading(false)
        notifyMint()
        setMintedNFTs(prevState => prevState + 1)
      } catch (err) {
        console.error(err)
      }
    }

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
      } else if (!presaleStarted && isOwner) {
        return (
          <button 
            type="button" 
            className="btn btn-warning" 
            onClick={startPresale}
          >
            Start Presale
          </button>
        )
      } else if (loading) {
        return (
          <button type="button" className="btn btn-secondary">Loading...</button>
        )
      } else if (presaleStarted && !presaleEnded) {
        return (
          <button 
            type="button" 
            className="btn btn-success"
            onClick={presaleMint}
          >
            Mint
          </button>
        )
      } else if (presaleStarted && presaleEnded) {
        <button 
          type="button" 
          className="btn btn-success"
          onClick={mint}
        >
          Mint
        </button>
      }
    }

    return (
        <div>
          <Head>
            <title>NFT Mint</title>
            <meta name="description" content="NFT Minting" />
            <link rel="icon" href="/logo.png" />
            {/* <a href="https://www.flaticon.com/free-icons/environment" title="environment icons">Environment icons created by Freepik - Flaticon</a> */}
          </Head>
          <ToastContainer />
          { 
            walletConnected && presaleStarted && !presaleEnded ? 
            <div className={`${styles.banner} fw-bold d-flex align-items-center justify-content-center`}>Presale ends in {hoursLeftPresale} hours</div> :
            "" 
          }
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
                {getButton()}
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