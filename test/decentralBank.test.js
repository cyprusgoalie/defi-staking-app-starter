const Tether = artifacts.require("Tether")
const RWD = artifacts.require("RWD")
const DecentralBank = artifacts.require("DecentralBank")

require('chai')
.use(require('chai-as-promised'))
.should()

contract ('DecentralBank', ([owner, customer]) => {
    let tether, rwd

    // helper function that converts from Ether to Wei (so I don't have to deal with all of the zeros)
    function tokens(number){
        return web3.utils.toWei(number, 'ether')
    }

    before(async () => {
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        // Transfer all tokens to DecentralBank (1 million)
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        // Transfer 100 mock Tethers to customer
        await tether.transfer(customer, tokens('100'), {from: owner})
    })

    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name()
            assert.equal(name,'Mock Tether Token')
        })
    })

    describe('Reward Token Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name()
            assert.equal(name,'Reward Token')
        })

        it('symbol name successfully', async () => {
            const symbol = await rwd.symbol()
            assert.equal(symbol,'RWD')
        })
    })

    describe('Decentral Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name()
            assert.equal(name,'Decentral Bank')
        })

        it('contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })
    })

    describe('Yield Farming', async () => {
        it('Customer balance before staking is 100', async () => {
            let result

            // Check Inverstor Balance
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(),tokens('100'), 'customer mock tether balance before staking')
            // the customer has a balance of 100 tokens
            console.log('Customer balance')
            console.log(web3.utils.fromWei(result.toString()))
        })

        it('Approve 100 tokens and transfer them from customer to bank', async () => {
            let result

            // approving the move of 100 tokens from the customer to the decentral bank
            result = await tether.approve(decentralBank.address, tokens('100'), {from: customer})

            // getting and logging the current balance of mock Tether tokens of the customer's account
            result = await tether.balanceOf(customer)
            console.log('Customer Balance')
            console.log(web3.utils.fromWei(result.toString()))

            // // depositing the 100 mock Tether tokens to the bank
            console.log('Deposit tokens')
            await decentralBank.depositTokens(tokens('100'), {from: customer})

            // // Check updated balance of customer
            result = await tether.balanceOf(customer)
            console.log('Customer Balance')
            console.log(web3.utils.fromWei(result.toString()))
            assert.equal(result.toString(),tokens('0'), 'customer mock tether balance after staking')
        })


        it('Check bank balance and if customer is staked', async () => {
            let result

            // Check updated balance of bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(),tokens('100'), 'decentral bank mock tether balance after staking')

            //Is Staking Balance
            result = await decentralBank.isStaking(customer)
            assert.equal(result.toString(), 'true', 'customer isStaking status after staking')
        })

        it('Issue token test', async () => {
            let result

            // issue tokens to the owner
            await decentralBank.issueTokens({from: owner})

            // ensure only the owner can issue tokens
            await decentralBank.issueTokens({from: customer}).should.be.rejected;

        })

        it('Unstaking the tokens', async () => {
            let result
            // Unstaking tokens
            await decentralBank.unstakeTokens({from: customer})

            // Check Unstaking Balances
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(),tokens('100'), 'customer mock tether balance after unstaking')

            // Check updated balance of Decentral Bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(),tokens('0'), 'decentral bank mock wallet balance after unstaking')

            // Is Staking Update
            result = await decentralBank.isStaking(customer)
            assert.equal(result.toString(),'false', 'customer is no longer staking after unstaking')
        })
    })
})