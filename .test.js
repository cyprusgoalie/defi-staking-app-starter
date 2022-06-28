//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected

const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;
// const buildPoseidon = require("circomlibjs").buildPoseidon;
const poseidon = require("circomlibjs/src/poseidon.js");
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Kuiz test", function () {
    let F;

    // increased the timeout amount so that things execute on a lower spec machine
    this.timeout(100000000);

    // First test
    // All answers submitted will be correct

    it("Should pass, all 5 answers correct", async () => {
        //poseidon = await Poseidon();
        F = poseidon.F;

        // our solutions will be 1,2,3,4,5
        console.log("Private Kuiz Solutions");
        const privSolnA = 1;
        const privSolnB = 2;
        const privSolnC = 3;
        const privSolnD = 4;
        const privSolnE = 5;

        // generating some random int as out salt
        const privSalt = Math.floor(Math.random()*10**10);
        console.log("Private Salt");
        console.log(privSalt);

        // computing our poseidon hash of the salt and solutions
        const pubSolnHash = poseidon([privSolnA,privSolnB,privSolnC,privSolnD,privSolnE,privSalt]);
        //console.log(pubSolnHash);
        //console.log(F.toObject(pubSolnHash));
        console.log(pubSolnHash);
        const circuit = await wasm_tester("circuits/kuiz.circom");
        await circuit.loadConstraints();

        // this input corresponds to all correct guesses and gives 5 hits
        const INPUT = {
            "pubUserAnswers": [1,2,3,4,5],
            "pubNumCorrect": 5,
            "pubSolnHash": pubSolnHash,
            "privQuizAnswers": [privSolnA, privSolnB, privSolnC, privSolnD, privSolnE],
            "privSalt" : privSalt
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
    });

    // Second test
    // The student only gets 3 of the 5 answers correct

    it("Should pass, only 3 of 5 answers correct", async () => {
        F = poseidon.F;

        // our solutions will be 1,2,3,4,5
        console.log("Private Kuiz Solutions");
        const privSolnA = 1;
        const privSolnB = 2;
        const privSolnC = 3;
        const privSolnD = 4;
        const privSolnE = 5;

        // generating some random int as out salt
        const privSalt = Math.floor(Math.random()*10**10);
        console.log("Private Salt");
        console.log(privSalt);

        // computing our poseidon hash of the salt and solutions
        const pubSolnHash = poseidon([privSolnA,privSolnB,privSolnC,privSolnD,privSolnE,privSalt]);
        //console.log(pubSolnHash);
        //console.log(F.toObject(pubSolnHash));
        console.log(pubSolnHash);
        const circuit = await wasm_tester("circuits/kuiz.circom");
        await circuit.loadConstraints();

        // this input corresponds to all correct guesses and gives 5 hits
        const INPUT = {
            "pubUserAnswers": [1,2,3,3,3],
            "pubNumCorrect": 3,
            "pubSolnHash": pubSolnHash,
            "privQuizAnswers": [privSolnA, privSolnB, privSolnC, privSolnD, privSolnE],
            "privSalt" : privSalt
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
    });
    
    // Third test
    // The student gets 0 of the 5 answers correct

    it("Should pass, 0 of 5 answers correct", async () => {
        F = poseidon.F;

        // our solutions will be 1,2,3,4,5
        console.log("Private Kuiz Solutions");
        const privSolnA = 1;
        const privSolnB = 2;
        const privSolnC = 3;
        const privSolnD = 4;
        const privSolnE = 5;

        // generating some random int as out salt
        const privSalt = Math.floor(Math.random()*10**10);
        console.log("Private Salt");
        console.log(privSalt);

        // computing our poseidon hash of the salt and solutions
        const pubSolnHash = poseidon([privSolnA,privSolnB,privSolnC,privSolnD,privSolnE,privSalt]);
        //console.log(pubSolnHash);
        //console.log(F.toObject(pubSolnHash));
        console.log(pubSolnHash);
        const circuit = await wasm_tester("circuits/kuiz.circom");
        await circuit.loadConstraints();

        // this input corresponds to all correct guesses and gives 5 hits
        const INPUT = {
            "pubUserAnswers": [0,0,0,0,0],
            "pubNumCorrect": 0,
            "pubSolnHash": pubSolnHash,
            "privQuizAnswers": [privSolnA, privSolnB, privSolnC, privSolnD, privSolnE],
            "privSalt" : privSalt
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
    });
});