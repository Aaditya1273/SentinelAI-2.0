pragma circom 2.0.0;

// Compliance Proof Circuit
// Proves regulatory compliance without revealing sensitive data

template ComplianceProof() {
    // Private inputs
    signal private input transactionAmount;
    signal private input userKYCLevel;
    signal private input jurisdictionCode;
    signal private input riskScore;
    signal private input nonce;
    
    // Public inputs
    signal input maxAmount;
    signal input minKYCLevel;
    signal input allowedJurisdictions[10]; // Support up to 10 jurisdictions
    signal input maxRiskScore;
    signal input expectedHash;
    
    // Output
    signal output compliant;
    
    // Components
    component hasher = Poseidon(5);
    component amountCheck = LessEqThan(64);
    component kycCheck = GreaterEqThan(8);
    component riskCheck = LessEqThan(8);
    component jurisdictionCheck = JurisdictionValidator(10);
    
    // Hash private inputs for commitment
    hasher.inputs[0] <== transactionAmount;
    hasher.inputs[1] <== userKYCLevel;
    hasher.inputs[2] <== jurisdictionCode;
    hasher.inputs[3] <== riskScore;
    hasher.inputs[4] <== nonce;
    
    expectedHash === hasher.out;
    
    // Check transaction amount is within limits
    amountCheck.in[0] <== transactionAmount;
    amountCheck.in[1] <== maxAmount;
    
    // Check KYC level meets requirements
    kycCheck.in[0] <== userKYCLevel;
    kycCheck.in[1] <== minKYCLevel;
    
    // Check risk score is acceptable
    riskCheck.in[0] <== riskScore;
    riskCheck.in[1] <== maxRiskScore;
    
    // Check jurisdiction is allowed
    jurisdictionCheck.jurisdiction <== jurisdictionCode;
    for (var i = 0; i < 10; i++) {
        jurisdictionCheck.allowed[i] <== allowedJurisdictions[i];
    }
    
    // All checks must pass for compliance
    compliant <== amountCheck.out * kycCheck.out * riskCheck.out * jurisdictionCheck.valid;
}

template LessEqThan(n) {
    signal input in[2];
    signal output out;
    
    component lt = LessThan(n+1);
    lt.in[0] <== in[0];
    lt.in[1] <== in[1] + 1;
    out <== lt.out;
}

template JurisdictionValidator(n) {
    signal input jurisdiction;
    signal input allowed[n];
    signal output valid;
    
    component eq[n];
    var sum = 0;
    
    for (var i = 0; i < n; i++) {
        eq[i] = IsEqual();
        eq[i].in[0] <== jurisdiction;
        eq[i].in[1] <== allowed[i];
        sum += eq[i].out;
    }
    
    // Valid if jurisdiction matches any allowed value
    component isPositive = GreaterThan(8);
    isPositive.in[0] <== sum;
    isPositive.in[1] <== 0;
    valid <== isPositive.out;
}

template IsEqual() {
    signal input in[2];
    signal output out;
    
    component eq = IsZero();
    eq.in <== in[1] - in[0];
    out <== eq.out;
}

template IsZero() {
    signal input in;
    signal output out;
    
    signal inv;
    inv <-- in!=0 ? 1/in : 0;
    out <== -in*inv +1;
    in*out === 0;
}

template GreaterThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;
    
    component lt = LessThan(n);
    lt.in[0] <== in[1];
    lt.in[1] <== in[0] + 1;
    out <== lt.out;
}

component main = ComplianceProof();
