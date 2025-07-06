const axios = require("axios");

async function getNutrients(query) {
  const res = await axios.post(
    process.env.NUTRITIONIX_APP_URL,
    { query },
    {
      headers: {
        "x-app-id": process.env.NUTRITIONIX_APP_ID,
        "x-app-key": process.env.NUTRITIONIX_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const food = res.data.foods[0];
  return {
    calories: food.nf_calories,
    protein: food.nf_protein,
    carbs: food.nf_total_carbohydrate,
    fat: food.nf_total_fat,
  };
}

module.exports = { getNutrients };
