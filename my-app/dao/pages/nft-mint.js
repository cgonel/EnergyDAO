import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Whitelist.module.css'

export default function NFTMint() {
    return (
        <div>
          <Head>
            <title>NFT Mint</title>
            <meta name="description" content="NFT Minting" />
            <link rel="icon" href="/logo.png" />
            {/* <a href="https://www.flaticon.com/free-icons/environment" title="environment icons">Environment icons created by Freepik - Flaticon</a> */}
          </Head>
          {/* <ToastContainer /> */}
          <nav className={styles.nav}>
            <img src="/logo.png" alt="energydao-logo" />
            {/* <a href="https://www.flaticon.com/free-icons/environment" title="environment icons">Environment icons created by Freepik - Flaticon</a> */}
          </nav>
          <main className={`container ${styles.main}`}>
          <div className="row align-items-md-center justify-content-sm-center">
            <div className="col">
              <h1>Mint a Bioengineered Animal</h1>
              <p>This NFT collection showcases what the earth would look like without biodiversity.</p>
              {/* { walletConnected && <p>{`There's ${maxWhitelisted - nbWhitelisted} spots left`}</p>} */}
              <div>
                {/* {getButton()} */}
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