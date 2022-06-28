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
    await deployer.deploy(DecentralBank);
    const decentralBank = await DecentralBank.deployed();

    await rwd.transfer(DecentralBank.address,'1000000000000000000');
    
};