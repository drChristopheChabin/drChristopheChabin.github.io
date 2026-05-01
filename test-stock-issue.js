import { Operation } from './metier/Operation.js';
import { AGENTS } from './metier/Constants.js';

async function testStockIssue() {
    console.log("--- Starting Stock Issue Test (Negative Stock) ---");
    const op = new Operation();

    const E1 = op.find(AGENTS.E1);
    const E2 = op.find(AGENTS.E2);

    console.log(`Initial Stock E1: ${E1.getStocks}`);
    console.log(`Initial Stock E2: ${E2.getStocks}`);

    const amount = 100;
    console.log(`\nExecuting ConsommationIntermediaire(E1, E2, ${amount})`);
    // E1 is buyer, E2 is seller
    // Expected: E1 stock increases by 100, E2 stock decreases by 100
    op.ConsommationIntermediaire(E1, E2, amount);

    console.log(`\nFinal Stock E1 (Buyer): ${E1.getStocks} (Expected: 100)`);
    console.log(`Final Stock E2 (Seller): ${E2.getStocks} (Expected: -100)`);

    if (E2.getStocks === -100) {
        console.log("\n✅ SUCCESS: Negative stock is allowed and correctly calculated.");
    } else {
        console.log("\n❌ FAILURE: Stock did not reach -100.");
    }
}

testStockIssue().catch(err => {
    console.error("Test failed:", err);
});
