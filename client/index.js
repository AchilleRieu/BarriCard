import Web3 from 'web3';
import configuration from '../build/contracts/Barricard.json';
import 'bootstrap/dist/css/bootstrap.css';
import ticketImage from './images/Barricard_1.png';

var Contract;
var userAccount;

function startApp() {
  const CONTRACT_ADDRESS =
  configuration.address;
  const CONTRACT_ABI = configuration.abi;

  const web3 = new Web3(
  Web3.givenProvider || 'http://127.0.0.1:8545'
  );
  const Contract = new web3.eth.Contract(
  CONTRACT_ABI,
  CONTRACT_ADDRESS
  );

  //Pour voir si le compte Metamask a changé
  var accountInterval = setInterval(function() {
    // Check if account has changed
    if (web3.eth.accounts[0] !== userAccount) {
      userAccount = web3.eth.accounts[0];
      // Call a function to update the UI with the new account
      getCardsByOwner(userAccount)
      .then(displayCards);
    }
  }, 100);

  // Start here
}
const CardEl = createElementFromString(
  `<div class="ticket card" style="width: 10rem;">
    <img src="./images/Barricard_1.png" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">Ticket</h5>
      <p class="card-text">${card.price / 1} Eth</p>
      <button class="btn btn-primary">Buy Ticket</button>
    </div>
  </div>`
);
ticketEl.onclick = buyTicket.bind(null, ticket);
ticketsEl.appendChild(ticketEl);

function displayCards(ids) {
  $("#Cards").empty();
  for (id of ids) {
    // Look up zombie details from our contract. Returns a `zombie` object
    getCardDetails(id)
    .then(function(card) {
      // Using ES6's "template literals" to inject variables into the HTML.
      // Append each one to our #zombies div
      $("#cards").append(`<div class="card">
        <ul>
          <li>Id: ${card.id}</li>
          <li>Puissance: ${card.puissance}</li>
        </ul>
      </div>`);
    });
  }
}
function getCardDetails(id) {
  return Contract.methods.cards(id).call()
}
console.log(A)
function CardToOwner(id) {
  return Contract.methods.CardToOwner(id).call()
}

function getCardsByOwner(owner) {
  return Contract.methods.getCardsByOwner(owner).call()
}

window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
   //web3js = new Web3(web3.currentProvider);
  } else {
    // Handle the case where the user doesn't have MetaMask installed
    // Probably show them a message prompting them to install MetaMask
  }

  // Now you can start your app & access web3 freely:
  startApp()

})



const createElementFromString = (string) => {
  const el = document.createElement('div');
  el.innerHTML = string;
  return el.firstChild;
};


const buyCard = async (card) => {
  await contract.methods
    .buyTicket(ticket.id)
    .send({ from: account, value: ticket.price });
};


const main = async () => {
  const accounts = await web3.eth.requestAccounts();
  account = accounts[0];
  accountEl.innerText = account;
};

main();
