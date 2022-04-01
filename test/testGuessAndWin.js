const { contracts } = require('@openzeppelin/cli/lib/prompts/choices');
const { BN, ether, expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect, assert } = require('chai');
const GuessAndWinContract = artifacts.require('GuessAndWin');
contract('GuessAndWin', function(accounts){
    const owner = accounts[0];
    const recipient = accounts[1];
    const third = accounts[2];
    beforeEach(async function(){
        this.cInstance = await GuessAndWinContract.new('test test', 'test', {from:owner});
    });

    describe('#INITIALISATION', function(){
        it('verify if owner is msg.sender', async function(){
            const contractOwner = await this.cInstance.owner()
            expect(contractOwner).to.be.equal(owner);
        });
        it('should not accept to create a contract with hint == word', async function(){
            await expectRevert(this.cInstance.changeWord('test', 'test', {from:owner}), "word and hint have to be different");
        });
        it('should not let other user than owner propose a new word', async function(){
            await expectRevert(this.cInstance.changeWord('bla bla', 'bla', {from:recipient}), "Ownable: caller is not the owner");
        })
    });
    describe('#proposeWord', function(){
        it('should return true when submiting the right word', async function(){
            const bool = await this.cInstance.proposeWord('test', {from:owner, value:(1*10**18)});
            expect(bool).to.be.ok;
        });
        it('should restart mapping when user find the right word', async function(){
            const bool = await this.cInstance.proposeWord('test', {from:recipient, value:ether('1')});
            expect(bool).to.be.ok;
            const hasTry = await this.cInstance.HasTried(recipient);
            expect(hasTry).to.be.bignumber.equal(new BN(0));
        });
        it('should return false when submiting the wrong word', async function(){
            const bool = await this.cInstance.proposeWord('coucou', {from:owner, value:(1*10**18)});
            expect(bool).to.be.ok;
        });
        it('should revert if user has already try', async function(){
            await this.cInstance.proposeWord('coucou', {from:owner, value:(1*10**18)});
            await expectRevert(this.cInstance.proposeWord('coucou', {from:owner, value:(1*10**18)}), "Sorry, you already got your chance");
        })
        it('should revert if user dont pay at least 1 eth to play', async function(){
            await expectRevert(this.cInstance.proposeWord('coucou', {from:owner, value:(34)}), "Pay 1 eth to try");
        });
    })
    describe('#hasSomeoneWin', function(){
        it('should return true if someone has win', async function(){
            await this.cInstance.proposeWord('test', {from:owner, value:ether('1')});
            const bool = await this.cInstance.hasSomeoneWin.call();
            expect(bool).to.be.ok;
        });
        it('should return false if nobody win', async function(){
            await this.cInstance.proposeWord('coucou', {from:owner, value:ether('1')});
            const bool = await this.cInstance.hasSomeoneWin.call();
            expect(bool).to.be.false;
        });
    });
    describe('#Money functions', function(){
        it('seePrize return 3 eth after 3 players paid 1 eth each', async function(){
            await this.cInstance.proposeWord('bla bla', {from:owner, value:ether('1')});
            await this.cInstance.proposeWord('bla bla', {from:recipient, value:ether('1')});
            await this.cInstance.proposeWord('bla bla', {from:third, value:ether('1')});
            const prize = await this.cInstance.seePrize.call();
            expect(prize).to.be.bignumber.equal(new BN(ether('3')));
        });
        it('should give 3 eth to third after 2 players played and third win', async function(){
            let thirdBalance = await web3.eth.getBalance(third);
            await this.cInstance.proposeWord('bla bla', {from:owner, value:ether('1')});
            await this.cInstance.proposeWord('bla bla', {from:recipient, value:ether('1')});
            await this.cInstance.proposeWord('test', {from:third, value:ether('1')});
            let thirdBalanceAfter = await web3.eth.getBalance(third);
            thirdBalance = new BN(thirdBalance);
            thirdBalanceAfter = new BN(thirdBalanceAfter);
            expect(thirdBalanceAfter).to.be.bignumber.at.least(thirdBalance.add(new BN(ether('1.9'/*2 less gasfees*/))));
        });
    });
});