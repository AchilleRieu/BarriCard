import './App.css';
import React, { useState, useEffect, createElement } from 'react';
import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.css';
import {CONTRACT_ABI, CONTRACT_ADDRESS} from './config.js';
import Header from './Header.js';


function App(){

  //On défini tous les états ou on peut stocker des var globale

  const [currentAccount, setCurrentAccount] = useState(null);
  const [ numberOfCards = 1 ] = useState(null);
  const {ethereum} = window;

  //Permet de link la blockchain avec web3

  const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
  const Contract = new web3.eth.Contract(CONTRACT_ABI,CONTRACT_ADDRESS );


  const CardsEl = document.getElementById('cards');
  const CardsInDeckEl = document.getElementById('cards');



  /*  Fonctions pou raffihcer les cartes du joueur et lui permettre d'intéragir avec */

  const createElementFromString = (string) => {
    const el = document.createElement('div');
    el.innerHTML = string;
    return el.firstChild;
  };
  
  const refreshCards = async () => {
    CardsEl.innerHTML = '';
    CardsInDeckEl.innerHTML = '';
    const CardsOfOwner = await Contract.methods.getCardsByOwner(currentAccount).call();
    for (let i = 0; i < CardsOfOwner.length; i++) {
      const card = await Contract.methods.cards(CardsOfOwner[i]).call();
      card.id = CardsOfOwner[i];
        if (CardsOfOwner.length===0){
        console.log("PAS DE CARTES");}
        if (card.isInDeck === true){
          {
        const CardEl = createElementFromString(
          `<div class="card" style="width: 18rem; ">
           <div class="card-body">
            <h5 class="card-title">Id of Card : ${
              card.id
            }</h5>
            <p class="card-text">Power of Card : ${
              card.isInDeck
            } </p>
             <button id="btn" href="#" class="btn btn-primary">Add in Deck</button>
            </div>
        </div>`
        );
        CardEl.onclick = removeCardInDeck.bind(null, card.id);
        CardsEl.appendChild(CardEl);   
    }
  }
        else {
        {
        const CardEl = createElementFromString( 
        `<div class="cardsss" style="width: 10rem; ">
          <div class="card-body">
          <h5 class="card-title">Id of Card : ${
            card.id
          }</h5>
          <p class="card-text">Power of Card : ${
            card.isInDeck
          } </p>
            <button id="btn" href="#" class="btn btn-primary">Remove from Deck</button>
          </div>
      </div>`
     );
     CardEl.onclick = addCardInDeck.bind(null, card.id);
     CardsInDeckEl.appendChild(CardEl);
        }
  
        }
      }
  };

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
     const CardsByOwner = await Contract.methods.getCardsByOwner(owner).call()
     console.log('Your Cards : ', CardsByOwner)
  }

  const getWinsByOwner = async (owner) => {
    const WinsByOwner = await Contract.methods.OwnerToWin(owner).call()
    console.log('Nombre win du currentAccount : ', WinsByOwner)
 }
  const MintNewCard = async () => {
    await Contract.methods.createRandomCard().send({ from: currentAccount});
    /*
    const NewCardEvent = await Contract.events.NewCard({fromBlock : 0})
    .on('data', async function(event){
        console.log(event.returnValues);
        // Do something here
    })
    .on('error', console.error);
    refreshCards();*/
  }

  const addCardInDeck = async(Id) => {
    const cardMinted = await Contract.methods.addCardInDeck(Id).send({ from: currentAccount})
    refreshCards();
  }

  const removeCardInDeck = async(Id) => {
    await Contract.methods.removeCardInDeck(Id).send({ from: currentAccount})
    refreshCards();
  }

  const startABattle = async(ply1) => {

    const battle = await Contract.methods._cardBattle(ply1).send({from : currentAccount})
    const NumberWins = await getWinsByOwner(ply1);   
 }

 const balanceOf = async (owner) => {
   const balance = await Contract.methods.ownerOf(owner);
   console.log(balance);
 }

 const TransferCard = async (Id) => {
  const transfer =  await Contract.methods.transferFrom(currentAccount, '0xD1e1267E24F2Bd6372038A90c24620Eb730d3E29', 0).send({from : currentAccount});
  console.log(transfer);
  refreshCards();
  }

  const battleApproval = async (address) => {
    await Contract.methods.approve(address, 0).send({from : currentAccount});
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
  const TransferButton  = () => {
        return (
          <button onClick={TransferCard} className='cta-button connect-wallet-button'>
           TransferCard
          </button>
          
        )
      }
  const getCardDetailsButton  = () => {
        return (
          <button onClick={refreshCards} className='cta-button connect-wallet-button'>
           Display Cards
          </button>
        )
      }
   const ApprovalButton = () => {
        return (
          <button onClick={ battleApproval.bind(null, '0xD1e1267E24F2Bd6372038A90c24620Eb730d3E29')} className='cta-button connect-wallet-button'>
            Approve
          </button>
        )
      }
    const startABattletButton = () => {
        return (
          <button onClick={startABattle.bind(null,'0x5f1E76918B1494096993eac732Fe826f4129759c')} className='cta-button connect-wallet-button'>
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
        <Header/>
          {connectWalletButton()}
          {MintNewCardButton()}
          {TransferButton()}
          {getCardDetailsButton()}
          {ApprovalButton()}
          {startABattletButton()}
        </div>
      );
     }
  
    


export default App;
