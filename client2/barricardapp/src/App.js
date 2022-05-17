import './App.css';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import {CONTRACT_ABI, CONTRACT_ADDRESS} from './config.js';


function App(){

  //On défini tous les états ou on peut stocker des var globale
  const [currentAccount, setCurrentAccount] = useState(null);
  const [ numberOfCards = 1 ] = useState(null);
  const {ethereum} = window;

  //Permet de link la blockchain avec web3

  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  const Contract = new web3.eth.Contract(CONTRACT_ABI,CONTRACT_ADDRESS );


  

  //Vérifie que l'utilisateur a bien Metamask et qu'on a trouvé son compte
  const connectWalletHandler = async () => {
    if (!ethereum) {
      alert("Please install Metamask!");
    }
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }); //permet de request le compte connecté
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]); // On met le compte actuel dans une le state global "CurrentAccount
 //à l'aide de useState
    } catch (err) {
      console.log(err)
    }
  }

  /* fonctions du contract */

  const  getCardDetails = async (id) => {
    const CardDetail = await Contract.methods.cards(id).call();
    console.log('Puissance de la carte : ', CardDetail.puissance)
  }

  
  const getCardsByOwner = async (owner) => {
     const CardsByOwner = await Contract.methods.getCardsByOwner(owner).call({ from: currentAccount})
     console.log('Your Cards : ', CardsByOwner)
  }

  const getWinsByOwner = async (owner) => {
    const WinsByOwner = await Contract.methods.getValueAtOwnerToWin(owner).call({from: currentAccount})
    console.log('Your Cards : ', WinsByOwner)
 }
  const MintNewCard = async () => {
    const mintonecard = await Contract.methods.createRandomCard().send({ from: currentAccount, value : 1000});
    const numberOfCards = await Contract.methods.numberOfCards().call({ from: currentAccount});
    console.log('Number of card minted : ', numberOfCards);
  }

  const addCardInDeck = async(Id) => {
     await Contract.methods.addCardInDeck(Id).send({ from: currentAccount});
    const IsInDeck = await Contract.methods.cards(Id).call();
    console.log('Votre carte est dans le Deck : ', IsInDeck.isInDeck)
  }

  const startABattle = async(ply1, ply2) => {

    const battle = await Contract.methods._cardBattle(ply1,ply2).send({from : currentAccount})
    const NumberWins = await getWinsByOwner(ply1);
    console.log("Nombre win du currentAccount : ", NumberWins);
   
 }


  /*    Website elements that call functions    */

  const connectWalletButton = () => {
        return (
          <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
            Connect Wallet
          </button>
          
        )
      }
  const MintNewCardButton = () => {
        return (
          <button onClick={MintNewCard} className='cta-button connect-wallet-button'>
            MintNewCard
          </button>
          
        )
      }
  const getCardsByOwnerButton  = () => {
        return (
          <button onClick={getCardsByOwner.bind(null, currentAccount)} className='cta-button connect-wallet-button'>
           CardsByOwner
          </button>
          
        )
      }
  const getCardDetailsButton  = () => {
        return (
          <button onClick={getCardDetails.bind(null, 2)} className='cta-button connect-wallet-button'>
           CardDetails
          </button>
        )
      }
   const addCardInDeckButton = () => {
        return (
          <button onClick={addCardInDeck.bind(null, 2)} className='cta-button connect-wallet-button'>
            addCardInDeck
          </button>
          
        )
      }
    const startABattletButton = () => {
        return (
          <button onClick={startABattle.bind(null, currentAccount, currentAccount)} className='cta-button connect-wallet-button'>
            Battle
          </button>
          
        )
      }           
    
    // Similaire à componentDidMount et componentDidUpdate : met à jour le do via l'api du nav
      useEffect(() => {
        connectWalletHandler();
      }, [])


   // Render de la page   
    return (
        <div className="container">
          <h1> Welcome to Barricity</h1>
          {connectWalletButton()}
          {MintNewCardButton()}
          {getCardsByOwnerButton()}
          {getCardDetailsButton()}
          {addCardInDeckButton()}
          {startABattletButton()}
          <p> {numberOfCards}</p>
        </div>
      );
     }
  
    


export default App;
