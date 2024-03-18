
// Function to calculate nutrient removal based on last year's yield
function calculateNutrientRemoval(previousYield) {
    // Adjusted nutrient removal rates per bushel for Canola
    const removalRatesPerBushel = {
        N: 1.87,
        P2O5: 0.78,
        K2O: 0.38,
        S: 0.22
    };

    const removalRates = {};
    for (const nutrient in removalRatesPerBushel) {
        removalRates[nutrient] = previousYield * removalRatesPerBushel[nutrient];
        document.getElementById(`result${nutrient}Removal`).textContent = removalRates[nutrient].toFixed(2) + ' lb/acre';
    }

    return removalRates;
}

// Function to calculate nutrient uptake based on yield goal
function calculateNutrientUptake(yieldGoal) {
    const uptakePerBushel = {
        N: 2.38,
        P2O5: 0.90,
        K2O: 2.93,
        S: 0.86
    };

    const uptakeRates = {};
    for (const nutrient in uptakePerBushel) {
        uptakeRates[nutrient] = yieldGoal * uptakePerBushel[nutrient];
        document.getElementById(`result${nutrient}Uptake`).textContent = uptakeRates[nutrient].toFixed(2) + ' lb/acre';
    }

    return uptakeRates;
}

// Integrated calculation function that includes Soil Organic Matter (OM) contribution
function integratedCalculation() {
    const previousYield = parseFloat(document.getElementById('previousYieldInput').value);
    const yieldGoal = parseFloat(document.getElementById('yieldGoalInput').value);
    const OM = parseFloat(document.getElementById('omInput').value); // Retrieve Soil Organic Matter percentage

    // Validate input for OM (optional)
    if (isNaN(OM) || OM < 0 || OM > 100) {
        alert("Please enter a valid value for Soil Organic Matter percentage (between 0 and 100).");
        return;
    }

    // Calculate soil OM contribution to available N
    const soilOMContributionN = OM * 14 * 0.8; // N made available by soil OM

    // Calculate and display nutrient removal based on last year's yield
    const removalRates = calculateNutrientRemoval(previousYield);

    // Calculate and display nutrient uptake based on yield goal
    const uptakeRates = calculateNutrientUptake(yieldGoal);

    // Adjust N fertilizer requirement calculation
    // This adjustment should add the soil OM contribution to the available N before determining the required fertilizer
    uptakeRates['N'] = (uptakeRates['N'] + soilOMContributionN) - removalRates['N'];
    removalRates['N'] += soilOMContributionN; // Reflect OM contribution in removal to not overestimate required fertilizer

    // Calculate and display fertilizer requirements based on uptake and removal
    for (const nutrient in uptakeRates) {
        let requiredFertilizer = uptakeRates[nutrient];
        if (nutrient === 'N') {
            // For N, now directly use the adjusted value which already considers soil OM contribution
            requiredFertilizer = Math.max(0, requiredFertilizer); // Ensure non-negative
        } else {
            // For other nutrients, calculate as before
            requiredFertilizer = Math.max(0, uptakeRates[nutrient] - (removalRates[nutrient] || 0));
        }
        document.getElementById(`result${nutrient}Required`).textContent = requiredFertilizer.toFixed(2) + ' lb/acre';
    }
}
