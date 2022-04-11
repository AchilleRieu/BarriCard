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

    function selectCardsDeck() public {

    }

    function _cardShuffle() internal {

    }

    function _cardBattle() internal {

    }
}

