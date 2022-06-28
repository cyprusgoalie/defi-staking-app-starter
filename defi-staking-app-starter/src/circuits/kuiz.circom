// this is an attempted circuit for the quiz in the zKuiz
// final project for the ZKU cohort 3
// @author cypg
// @date 10/6/22
// @date modified 27/6/22

// NOTES:
// We don't want or need to hide the *NUMBER* of correct answers, we want to hide the ACTUAL correct answers. So we should not be hashing the number of correct answers, but rather all of the solutions, with a salt (like the Mastermind game).

pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";
// include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

//this circuit takes in the user's public answers to the quiz question,
// the actual private answers, and a private salt. The output signal
// is a hash of the number of correct answers, and the salt
template Kuiz (n) {
    signal input pubUserAnswers[n];
    signal input pubNumCorrect;
    signal input pubSolnHash;
    //signal input pubSolutionHash;

    // Private inputs
    signal input privQuizAnswers[n];
    signal input privSalt;

    // Output
    //signal output correctAnswers[n];
    signal output solnHashOut;


    // component isEqualArray[n];
    // component mark[n];
    component poseidon = Poseidon(n+1);
    component isEqualList[n];

    var numCorrect = 0;
    

    // Verify that the hash of the private solution matches pubSolnHash
    for(var i = 0; i < n; i++)
    {
        isEqualList[i] = IsEqual();
        isEqualList[i].in[0] <== pubUserAnswers[i];
        isEqualList[i].in[1] <== privQuizAnswers[i];
        numCorrect += isEqualList[i].out;// ? 1 : 0;
        //incrementing the number of correct answers by using the conditional
        //expression. Specifically, we ask if the current index of the user's
        //answers matches the quiz answers. If true, we increment by 1.
        // Otherwise, we do not incrememnt.

        poseidon.inputs[i] <== privQuizAnswers[i];

    }
    poseidon.inputs[n] <== privSalt;


    component equalNumCorrect = IsEqual();
    equalNumCorrect.in[0] <== pubNumCorrect;
    equalNumCorrect.in[1] <== numCorrect;
    equalNumCorrect.out === 1;
    
    solnHashOut <== poseidon.out;
    pubSolnHash === solnHashOut;
 }

component main{public [pubUserAnswers, pubNumCorrect, pubSolnHash]}  = Kuiz(5);