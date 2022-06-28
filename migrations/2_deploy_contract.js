const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

module.exports = async function(deployer, network, accounts) {
    // deploy mock Tether contract
    await deployer.deploy(Tether);
    const tether = await Tether.deployed();

    // Deploy RWD
    await deployer.deploy(RWD);
    const rwd = await RWD.deployed();

    // Deploy DecentralBank Contract
    await deployer.deploy(DecentralBank, rwd.address, tether.address);
    const decentralBank = await DecentralBank.deployed();

    // Million  1000000 000000000000000000
    // Thousand 1000    000000000000000000
    // Hundred  100     000000000000000000
    // Ten      10      000000000000000000
    // One      1       000000000000000000

    // starting with 1 Million tokens
    await rwd.transfer(decentralBank.address,'1000000000000000000000000');

    // transfering 100 tokens
    await tether.transfer(accounts[1], '100000000000000000000');
};