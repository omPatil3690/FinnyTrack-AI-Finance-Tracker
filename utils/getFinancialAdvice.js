// utils/getFinancialAdvice.js
// Client-side helper that calls the server API route

const inFlightRequests = new Map();

const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log(totalBudget, totalIncome, totalSpend);
  const requestKey = `aiAdvice:${totalBudget}:${totalIncome}:${totalSpend}`;

  if (inFlightRequests.has(requestKey)) {
    return inFlightRequests.get(requestKey);
  }

  const requestPromise = (async () => {
    try {
      const response = await fetch("/api/ai-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalBudget, totalIncome, totalSpend }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return {
          advice:
            data?.message ||
            "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.",
          remaining: data?.remaining ?? null,
        };
      }

      const data = await response.json();
      return {
        advice:
          data?.advice ||
          "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.",
        remaining: data?.remaining ?? null,
      };
    } catch (error) {
      console.error("Error fetching financial advice:", error);
      return {
        advice:
          "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.",
        remaining: null,
      };
    }
  })();

  inFlightRequests.set(requestKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    inFlightRequests.delete(requestKey);
  }
};

const getFinancialAdviceRemaining = async () => {
  try {
    const response = await fetch("/api/ai-advice", { method: "GET" });
    if (!response.ok) {
      return null;
    }
    const data = await response.json().catch(() => ({}));
    return typeof data?.remaining === "number" ? data.remaining : null;
  } catch (error) {
    console.error("Error fetching AI remaining calls:", error);
    return null;
  }
};

export { getFinancialAdviceRemaining };
export default getFinancialAdvice;
