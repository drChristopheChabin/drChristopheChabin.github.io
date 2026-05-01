import { Operation } from './metier/Operation.js';
import { AGENTS } from './metier/Constants.js';

async function runVerification() {
    console.log("--- Starting Metier Verification with Constants ---");
    const op = new Operation();

    const E1 = op.find(AGENTS.E1);
    const E2 = op.find(AGENTS.E2);
    const M = op.find(AGENTS.M);

    console.log(`1. Executing Production(${AGENTS.E1}, ${AGENTS.M}, 100)`);
    op.Production(E1, M, 100);

    console.log(`2. Executing ConsommationIntermediaire(${AGENTS.E2}, ${AGENTS.E1}, 40)`);
    op.ConsommationIntermediaire(E2, E1, 40);

    console.log(`3. Executing RevenusSal(${AGENTS.M}, ${AGENTS.E1}, 30)`);
    op.RevenusSal(M, E1, 30);

    console.log(`4. Executing Consommation(${AGENTS.M}, ${AGENTS.E1}, 20)`);
    op.Consommation(M, E1, 20);

    console.log("\n--- Final States ---");

    console.log(`\nAgent ${AGENTS.E1} Bilan:`);
    console.log(JSON.stringify(E1.getBilan, null, 2));

    console.log(`\nAgent ${AGENTS.M} Bilan:`);
    console.log(JSON.stringify(M.getBilan, null, 2));

    console.log("\nComptaNat TEE:");
    console.log(JSON.stringify(op.getCN.getTEE, null, 2));

    console.log("\nComptaNat TOF:");
    console.log(JSON.stringify(op.getCN.getTOF, null, 2));
}

runVerification().catch(err => {
    console.error("Verification failed:", err);
    process.exit(1);
});
