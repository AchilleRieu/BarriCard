const Barricard = artifacts.require("Barricard");
const utils = require("./helpers/utils");
const assert = require("assert");
const { equal } = require("assert");

contract("Barricard", (accounts) => {
  let [alice, bob] = accounts;
  let contractInstance;

  beforeEach(async () => {
    contractInstance = await Barricard.new();
  });

  afterEach(async () => {
    await contractInstance.kill();
  });

  xit("should be able to create a new card", async () => {
    const result = await contractInstance._createCard(8, { from: alice });
    assert.equal(result.receipt.status, true);
    assert.equal(result.logs[0].args.tokenId, 0);
    //assert.equal(result.logs[0].args._isInDeck, true); ajouter une fonction getter pour cette valeur
  });

  xit("should be able to remove and add a card to the deck", async () => {
    let CardIsInDeck;
    const result = await contractInstance.createRandomCard({ from: alice });
    const firstCardId = result.logs[0].args.tokenId.toNumber();
    CardIsInDeck = await contractInstance.getIsInDeck(firstCardId);
    assert.equal(CardIsInDeck, true);
    await contractInstance.removeCardInDeck(firstCardId, { from: alice });
    CardIsInDeck = await contractInstance.getIsInDeck(firstCardId);
    assert.equal(CardIsInDeck, false);
    await contractInstance.addCardInDeck(firstCardId, { from: alice });
    CardIsInDeck = await contractInstance.getIsInDeck(firstCardId);
    assert.equal(CardIsInDeck, true);
    // Tests à ajouter :
    // tester si le nombre de cartes dans le deck est le bon
  });

  xit("should not be able to add a card to the deck", async () => {
    const result = await contractInstance.createRandomCard({ from: alice });
    const firstCardId = result.logs[0].args.tokenId.toNumber();
    utils.shouldThrow(
      contractInstance.addCardInDeck(firstCardId, { from: bob })
    );
    utils.shouldThrow(
      contractInstance.addCardInDeck(firstCardId, { from: alice })
    );
    // Tests à ajouter :
    // tester si on ne peut pas ajouter plus de 10 cartes
  });

  xit("should not be able to remove a card to the deck", async () => {
    const result = await contractInstance.createRandomCard({ from: alice });
    const firstCardId = result.logs[0].args.tokenId.toNumber();
    utils.shouldThrow(
      contractInstance.removeCardInDeck(firstCardId, { from: bob })
    );
    await contractInstance.removeCardInDeck(firstCardId, { from: alice });
    utils.shouldThrow(
      contractInstance.removeCardInDeck(firstCardId, { from: alice })
    );
  });

  xit("should be able to shuffle the deck", async () => {
    let result;
    result = await contractInstance.createRandomCard({ from: alice });
    result = await contractInstance.createRandomCard({ from: alice });
    const deck = await contractInstance.getCardsInDeckByOwner(alice, {
      from: alice,
    });
    const shuffledeck = await contractInstance._cardShuffle(deck, {
      from: alice,
    });
  });

  xit("should be able to approve the game", async () => {
    await contractInstance.battleApproval(bob, { from: alice });
    const aliceApproval = await contractInstance.BattleApprovals.call(
      alice,
      bob,
      {
        from: alice,
      }
    );
    assert.equal(aliceApproval, true);
  });

  xit("should not be able to approve the game", async () => {
    await contractInstance.battleApproval(bob, {
      from: alice,
    });
    utils.shouldThrow(contractInstance.battleApproval(bob, { from: alice }));
  });

  xit("should be able to disapprove the game", async () => {
    await contractInstance.battleApproval(bob, { from: alice });
    await contractInstance.battleDisapproval(bob, { from: alice });
    const aliceApproval = await contractInstance.BattleApprovals.call(
      alice,
      bob,
      {
        from: alice,
      }
    );
    assert.equal(aliceApproval, false);
  });

  xit("should not be able to disapprove the game", async () => {
    utils.shouldThrow(contractInstance.battleDisapproval(bob, { from: alice }));
  });

  xit("should be able to play the game", async () => {
    let result;

    //Alice Deck creation
    result = await contractInstance._createCard(7, { from: alice });
    result = await contractInstance._createCard(6, { from: alice });

    //Alice Deck creation
    result = await contractInstance._createCard(5, { from: bob });
    result = await contractInstance._createCard(4, { from: bob });
    result = await contractInstance._createCard(3, { from: bob });

    await contractInstance.battleApproval(bob, { from: alice });

    await contractInstance._cardBattle(alice, {
      from: bob,
    });

    const aliceWin = await contractInstance.OwnerToWin.call(alice, {
      from: alice,
    });
    const bobWin = await contractInstance.OwnerToWin.call(bob, {
      from: bob,
    });

    assert.equal(aliceWin.toNumber(), 1);
    assert.equal(bobWin.toNumber(), 0);
  });

  xit("should not be able to play the game", async () => {
    let result;

    //Alice Deck creation
    result = await contractInstance._createCard(7, { from: alice });

    //Bob Deck creation
    result = await contractInstance._createCard(5, { from: bob });

    utils.shouldThrow(
      contractInstance._cardBattle(bob, {
        from: alice,
      })
    );
  });

  context("with the single-step transfer scenario", async () => {
    it("should transfer a card", async () => {
      const result = await contractInstance._createCard(7, { from: alice });
      const cardId = result.logs[0].args.tokenId.toNumber();
      await contractInstance.transferFrom(alice, bob, cardId, {
        from: alice,
      });
      const newOwner = await contractInstance.ownerOf(cardId);
      const isCardInDeck = await contractInstance.getIsInDeck(cardId, {
        from: bob,
      });
      assert.equal(newOwner, bob);
      assert.equal(isCardInDeck, false);
    });
  });

  context("with the two-step transfer scenario", async () => {
    it("should approve and then transfer a card when the approved address calls transferFrom", async () => {
      const result = await contractInstance._createCard(7, { from: alice });
      const cardId = result.logs[0].args.tokenId.toNumber();
      await contractInstance.approve(bob, cardId, { from: alice });
      await contractInstance.transferFrom(alice, bob, cardId, { from: bob });
      const newOwner = await contractInstance.ownerOf(cardId);
      const isCardInDeck = await contractInstance.getIsInDeck(cardId, {
        from: bob,
      });
      assert.equal(newOwner, bob);
      assert.equal(isCardInDeck, false);
    });
    it("should approve and then transfer a card when the owner calls transferFrom", async () => {
      const result = await contractInstance._createCard(7, { from: alice });
      const cardId = result.logs[0].args.tokenId.toNumber();
      await contractInstance.approve(bob, cardId, { from: alice });
      await contractInstance.transferFrom(alice, bob, cardId, {
        from: alice,
      });
      const newOwner = await contractInstance.ownerOf(cardId);
      const isCardInDeck = await contractInstance.getIsInDeck(cardId, {
        from: bob,
      });
      assert.equal(newOwner, bob);
      assert.equal(isCardInDeck, false);
    });
  });
});

/* test le name et symbol
describe("Barricard", function() {

    it("should return correct name and symbol", async function () {

        const barricardDeployed = await Barricard.deployed();

        expect(await barricardDeployed.name()).to.equal("FirstBarricard");
        expect(await barricardDeployed.symbol()).to.equal("MCN");
    });

});
*/
/*
contract('Barricard', (accounts) => {
    const BUYER = 0x34764c19Af1d26F4cF31faD0EB8eb18661716042;

  it('should allower a user to mint barricard', async () => {
    const instance = await Barricard.deployed();

    //const originalTBarricard = await instance.barricard;
    const result = await instance.mint( "https://ipfs.io/ipfs/QmQcDEpLirZS9XrbWn8xY42rJzRiKw6dLWNR7a554YbPfw"
    );
    console.log(result);
    const updatedBarricard = await instance.barricard;
    /*assert.equal(
      updatedBarricard.owner(),
      BUYER,
      'the buyer should now own this ticket'
    );
  });
});
*/
