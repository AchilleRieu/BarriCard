// SPDX-License-Identifier: MIT
//  La licence permet de préciser notre position juridique sur notre code, elle est obligatoire
pragma solidity ^0.8.9;
// versions de solidity supportées

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//importation du contract ERC721 de openzeppelin
//  pour qu'il marche il faut installer les contracts avec npm install @openzeppelin/contracts
// il faut aussi configurer le "solidity.defaultCompiler": "localNodeModule" dans les paramètres vscode
import "@openzeppelin/contracts/access/Ownable.sol";
import "./safemath.sol";


contract Barricard is ERC721, Ownable {

    struct Card {
        uint id;
        uint8 puissance;
        bool isInDeck;
    }

    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    Card[] public cards;

    event NewCard(uint _id,uint8 _puissance, bool _isInDeck);
    uint puissanceDigits = 16;
    uint puissanceModulus = 10 ** puissanceDigits;

    mapping (uint => address) public cardToOwner;
    mapping (address => uint8) public OwnerToWin;
    mapping (address => uint8) ownerCardCount;
    mapping (address => uint8) ownerCardInDeckCount;
    mapping (uint => address) CardApprovals;
    mapping (address => mapping(address => bool)) BattleApprovals;

    constructor() ERC721("","") {
    }

    modifier onlyOwnerOf(uint _cardId) {
        require(msg.sender == cardToOwner[_cardId]);
        _;
    }

    function addCardInDeck(uint _cardId) external onlyOwnerOf(_cardId){ //passer une carte en parametre
        //Check si ownerCardInDeckCount est plus petit que 10 (taille max du deck)
        //Passer la variable isInDeck à True (revient a ajouter la carte au Deck)
        //incrementer ownerCardInDeckCount de 1
        require(ownerCardInDeckCount[msg.sender]<10);
        require(cards[_cardId].isInDeck == false);
        cards[_cardId].isInDeck = true;
        ownerCardInDeckCount[msg.sender]++;
    }

    function removeCardInDeck(uint _cardId) external onlyOwnerOf(_cardId) { //passer une carte en parametre
        //Check si ownerCardInDeckCount est plus grand que 0 (taille min du deck)
        //Passer la variable isInDeck de la carte à False (revient a supprimer la carte du Deck)
        //decrementer ownerCardInDeckCount de 1
        require(ownerCardInDeckCount[msg.sender]>0);
        require(cards[_cardId].isInDeck == true);
        cards[_cardId].isInDeck = false;
        ownerCardInDeckCount[msg.sender]--;
    }

    function getIsInDeck(uint _cardId) external view onlyOwnerOf(_cardId) returns(bool) {
        return(cards[_cardId].isInDeck);
    }

    // function approve(address _approved, uint256 _cardId) public override onlyOwnerOf(_cardId) {
    //     CardApprovals[_cardId] = _approved;
    //     emit Approval(msg.sender, _approved, _cardId);
    // }

    // function takeOwnership(uint256 _cardId) public {
    //     require(CardApprovals[_cardId] == msg.sender);
    //     address owner = ownerOf(_cardId);
    //     _transfer(owner, msg.sender, _cardId);
    // }

    //problème : pour afficher les cartes du Deck c'est compliqué (il faut parcourir toutes les cartes 
    //  et selectionner seulement celles qui ont isInDeck a True
    function _cardShuffle(uint[] memory deck) public view returns(uint[] memory) { //repasser en internal
        //Deux possibilites
        //ajouter un variable à la structure de Card pour indiquer son rang dans le deck
        //ne pas ecrire cette fonction et effectuer le choix aleatoire pdt cardBattle 
        //  -> prendre une carte aléatoire parmis celle du joueur qui ont isInDeck à True et n'ont pas encore ete joué
        //  Besoin d'ajouter une varaible : hasBeenPlayed dans dans la struct de card

        for (uint256 i = 0; i < deck.length; i++) {
            uint256 n = i + uint256(keccak256(abi.encodePacked(block.timestamp))) % (deck.length - i);
            uint256 temp = deck[n];
            deck[n] = deck[i];
            deck[i] = temp;
        }

        return(deck);
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a <= b ? a : b;
    }

    function battleApproval(address adrj) public {
        BattleApprovals[msg.sender][adrj] = true;
    }

    function _cardBattle(address adrj) public{ //address des deux joueurs 
        require(BattleApprovals[adrj][msg.sender] == true);
        BattleApprovals[adrj][msg.sender] = false;
        BattleApprovals[msg.sender][adrj] = false;
        // Variable interne : compteur de point pour chaque joueur

        //boucle x10 (ou max du nombre de carte dans les decks)
            //comparer les cartes des deux joueurs et changer les variable internes en fonction
        
        //Retourner le resultat du match 
        //  (voir pour modifier un variable globale, peut etre plus securisé)

        uint[] memory deck1 = getCardsInDeckByOwner(msg.sender);
        deck1 = _cardShuffle(deck1);
        uint[] memory deck2 = getCardsInDeckByOwner(adrj);
        deck2 = _cardShuffle(deck2);

        int8 score = 0;

        for (uint i = 0; i < min(deck1.length, deck2.length); i++){
            if (cards[deck1[i]].puissance>cards[deck2[i]].puissance) { //On pourrait directement melanger les puissances au lieu des indices
                score++;
            }
            else if (cards[deck1[i]].puissance<cards[deck2[i]].puissance){
                score--;
            }
        }

        if (score>0){
            OwnerToWin[msg.sender]++;
        }
        else if (score<0) {
            OwnerToWin[adrj]++;
        }
    }

    function getCardsByOwner(address _owner) external view returns(uint[] memory) {
        uint[] memory result = new uint[](ownerCardCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < cards.length; i++) {
            if (cardToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function getCardsInDeckByOwner(address _owner) public view returns(uint[] memory) { //changer public
        uint[] memory result = new uint[](ownerCardInDeckCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < cards.length; i++) {
            if (cardToOwner[i] == _owner && cards[i].isInDeck == true) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function _createCard(uint8 puissance) public { //repasser en internal
        uint id = cards.length;
        cardToOwner[id] = msg.sender;
        ownerCardCount[msg.sender] ++;
        if(ownerCardInDeckCount[msg.sender]<10){
            cards.push(Card(id,puissance,true));
            ownerCardInDeckCount[msg.sender] ++;
            emit NewCard(id,puissance,true);
        }
        else{
            cards.push(Card(id,puissance,false));
            emit NewCard(id,puissance,false);
        }
    }

    function createRandomCard() public {
        
        //require(ownerCardCount[msg.sender] == 0);
        uint8 puissance = uint8(uint256(keccak256(abi.encodePacked(block.timestamp))) % 256);
        _createCard(puissance);
    }

    function kill() public onlyOwner {
        selfdestruct(payable(owner()));
    }

}