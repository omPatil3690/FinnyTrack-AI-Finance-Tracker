// utils/getFinancialAdvice.js
// Client-side helper that calls the server API route

const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log(totalBudget, totalIncome, totalSpend);
  try {
    const response = await fetch("/api/ai-advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalBudget,
        totalIncome,
        totalSpend,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return (
        data?.message ||
        "Sorry, I couldn't fetch the financial advice at this moment. Please try again later."
      );
    }

    const data = await response.json();
    return (
      data?.advice ||
      "Sorry, I couldn't fetch the financial advice at this moment. Please try again later."
    );
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;