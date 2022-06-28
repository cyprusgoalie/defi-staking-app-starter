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
        it('rewards tokens for staking', async () => {
            let result

            // Check Inverstor Balance
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(),tokens('100'), 'customer mock tether balance before staking')
        })

    })
    
    
    // describe('Mock Tether Deployment', async () => {
    //     it('matches name successfully', async () => {
    //         let tether = await Tether.new()
    //         const name = await tether.name()
    //         assert.equal(name,'Mock Tether Token')
    //     })
    // })

    // describe('Reward Token', async () => {
    //     it('matches name successfully', async () => {
    //         let reward = await RWD.new()
    //         const name = await reward.name()
    //         assert.equal(name,'Reward Token')
    //     })

    //     it('symbol name successfully', async () => {
    //         let reward = await RWD.new()
    //         const symbol = await reward.symbol()
    //         assert.equal(symbol,'RWD')
    //     })
    // })
})