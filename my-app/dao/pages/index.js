import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Whitelist</title>
        <meta name="description" content="Whitelist Sign" />
        <link rel="icon" href="/logo.png" />
        {/* <a href="https://www.flaticon.com/free-icons/environment" title="environment icons">Environment icons created by Freepik - Flaticon</a> */}
      </Head>
      <nav className={styles.nav}>
        <img src="/logo.png" alt="energydao-logo" />
        {/* <a href="https://www.flaticon.com/free-icons/environment" title="environment icons">Environment icons created by Freepik - Flaticon</a> */}
      </nav>
      <main className={`container ${styles.main}`}>
        <div className="row align-items-md-center justify-content-sm-center">
          <div className="col">
            <h1>Welcome to EnergyDAO!</h1>
            <p>It's an NFT Collection for Energizers.</p>
            <p>There is 3 / 10 spots left</p>
            <div>
              <button type="button" className="btn btn-success">Join the Whitelist</button>
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
