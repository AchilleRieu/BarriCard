// SPDX-License-Identifier: MIT
//  La licence permet de préciser notre position juridique sur notre code, elle est obligatoire
pragma solidity ^0.8.9;
// versions de solidity supportées

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//importation du contract ERC721 de openzeppelin
//  pour qu'il marche il faut installer les contracts avec npm install @openzeppelin/contracts
// il faut aussi configurer le "solidity.defaultCompiler": "localNodeModule" dans les paramètres vscode
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract BarriCard is ERC721, Ownable {
    constructor() ERC721("","") {}

    struct Card {
        uint8 id;
        uint8 puissance;
        bool isInDeck;
    }


    Card[] public cards;

    mapping (uint8 => address) public cardToOwner;
    mapping (address => uint8) ownerCardCount;
    mapping (address => uint8) ownerCardInDeckCount;

    function addCardInDeck() public { //passer une carte en parametre
        //Check si ownerCardInDeckCount est plus petit que 10 (taille max du deck)
        //Passer la variable isInDeck de la carte à False (revient a supprimer la carte du Deck)
        //decrementer ownerCardInDeckCount de 1
    }

    function removeCardInDeck() public { //passer une carte en parametre
        //Check si ownerCardInDeckCount est plus grand que 0 (taille min du deck)
        //Passer la variable isInDeck à True (revient a ajouter la carte au Deck)
        //incrementer ownerCardInDeckCount de 1
    }

    //problème : pour afficher les cartes du Deck c'est compliqué (il faut parcourir toutes les cartes 
    //  et selectionner seulement celles qui ont isInDeck a True

    function _cardShuffle() internal {
        //Deux possibilites
        //ajouter un variable à la structure de Card pour indiquer son rang dans le deck
        //ne pas ecrire cette fonction et effectuer le choix aleatoire pdt cardBattle 
        //  -> prendre une carte aléatoire parmis celle du joueur qui ont isInDeck à True et n'ont pas encore ete joué
        //  Besoin d'ajouter une varaible : hasBeenPlayed dans dans la struct de card
    }

    function _cardBattle() internal { //address des deux joueurs 
        // Variable interne : compteur de point pour chaque joueur

        //boucle x10 (ou max du nombre de carte dans les decks)
            //comparer les cartes des deux joueurs et changer les variable internes en fonction
        
        //Retourner le resultat du match 
        //  (voir pour modifier un variable globale, peut etre plus securisé)

    }
}

