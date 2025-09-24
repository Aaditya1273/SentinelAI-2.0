pragma circom 2.0.0;

// Decision Proof Circuit for SentinelAI
// Proves that an agent made a decision with sufficient confidence
// without revealing sensitive decision parameters

template DecisionProof() {
    // Private inputs
    signal private input agentId;
    signal private input decisionData;
    signal private input confidence;
    signal private input nonce;
    
    // Public inputs
    signal input expectedHash;
    signal input minConfidence;
    
    // Output
    signal output valid;
    
    // Components
    component hasher = Poseidon(4);
    component confidenceCheck = GreaterEqThan(8);
    
    // Hash the private inputs
    hasher.inputs[0] <== agentId;
    hasher.inputs[1] <== decisionData;
    hasher.inputs[2] <== confidence;
    hasher.inputs[3] <== nonce;
    
    // Verify the hash matches expected
    expectedHash === hasher.out;
    
    // Verify confidence meets minimum threshold
    confidenceCheck.in[0] <== confidence;
    confidenceCheck.in[1] <== minConfidence;
    
    // Output is valid if both conditions are met
    valid <== confidenceCheck.out;
}

template GreaterEqThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;
    
    component lt = LessThan(n+1);
    lt.in[0] <== in[1];
    lt.in[1] <== in[0] + 1;
    out <== lt.out;
}

template LessThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;
    
    component n2b = Num2Bits(n);
    n2b.in <== in[0] + (1<<n) - in[1];
    out <== 1 - n2b.out[n];
}

template Num2Bits(n) {
    signal input in;
    signal output out[n];
    var lc1=0;
    
    var e2=1;
    for (var i = 0; i<n; i++) {
        out[i] <-- (in >> i) & 1;
        out[i] * (out[i] -1 ) === 0;
        lc1 += out[i] * e2;
        e2 = e2+e2;
    }
    
    lc1 === in;
}

template Poseidon(nInputs) {
    signal input inputs[nInputs];
    signal output out;
    
    // Simplified Poseidon hash - in production would use full implementation
    var sum = 0;
    for (var i = 0; i < nInputs; i++) {
        sum += inputs[i];
    }
    out <== sum;
}

component main = DecisionProof();
