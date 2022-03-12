// SPDX-License-Identifier: MIT
//  La licence permet de préciser notre position juridique sur notre code, elle est obligatoire
pragma solidity >=0.4.22 <0.9.0;
// version de solidity supportées

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//importation du contract ERC721 de openzeppelin
//  pour qu'il marche il faut installer les contracts avec npm install @openzeppelin/contracts
// il faut aussi configurer le "solidity.defaultCompiler": "localNodeModule" dans les paramètres vscode

abstract contract BarriCard is ERC721 {

}

