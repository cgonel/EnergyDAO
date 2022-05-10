import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import Nav from './Components/Nav'
// import { useState, useEffect } from 'react'
// import { ethers } from 'ethers'
// import { WHITELIST_ADDRESS, abi } from '../constants/index'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// Photo by <a href="https://unsplash.com/@lucabravo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Luca Bravo</a> on <a href="https://unsplash.com/s/photos/forest-water-background?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
export default function Home() {
    return (
        <div>
            <Head>
                <title>Home</title>
                <meta name="description" content="Home" />
                <link rel="icon" href="/logo.png" />
                {/* <a href="https://www.flaticon.com/free-icons/environment" title="environment icons">Environment icons created by Freepik - Flaticon</a> */}
            </Head>
            <Nav />
            <main className="vh-100">
            </main>
        </div>
    )
}
