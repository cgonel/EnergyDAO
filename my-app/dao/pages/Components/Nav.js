import styles from '../../styles/Dao.module.css'
import Link from 'next/link'

export default function Nav() {
    return (
        <nav className={`${styles.nav} d-flex`}>
            <Link href="/">
                <a>
                    <img src="/logo.png" alt="energydao-logo" />
                    {/* <a href="https://www.flaticon.com/free-icons/environment" title="environment icons">Environment icons created by Freepik - Flaticon</a> */}
                </a>
            </Link>
            <div className="w-100 d-flex align-items-center justify-content-evenly fw-bold">
                <Link href="/whitelist">
                    <a>Whitelist</a>
                </Link>
                <Link href="/nft-mint">
                    <a>NFT Collection</a>
                </Link>
            </div>
        </nav>
    )
}