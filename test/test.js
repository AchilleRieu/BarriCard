const Barricard = artifacts.require('Barricard');
const assert = require('assert');


contract("Barricard", (accounts) => {
    let [alice, bob] = accounts;


    it("should be able to create a new card", async () => {
        const contractInstance = await Barricard.deployed();
        const result = await contractInstance.createRandomCard({from: alice});
        assert.equal(result.receipt.status, true);
        console.log(result.logs[0]);
        assert.equal(result.logs[0].args._puissance,8);
    })

    //define the new it() function
})

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
