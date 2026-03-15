// utils/getFinancialAdvice.js
// Client-side helper that calls the server API route

const inFlightRequests = new Map();

const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log(totalBudget, totalIncome, totalSpend);
  const cacheKey = `aiAdvice:${totalBudget}:${totalIncome}:${totalSpend}`;
  if (typeof window !== "undefined" && window.sessionStorage) {
    const cachedAdvice = window.sessionStorage.getItem(cacheKey);
    if (cachedAdvice) return cachedAdvice;
  }

  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const requestPromise = (async () => {
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
      const advice = data?.advice?.trim();
      if (advice) {
        if (typeof window !== "undefined" && window.sessionStorage) {
          window.sessionStorage.setItem(cacheKey, advice);
        }
        return advice;
      }

      return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
    } catch (error) {
      console.error("Error fetching financial advice:", error);
      return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
    }
  })();

  inFlightRequests.set(cacheKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    inFlightRequests.delete(cacheKey);
  }
};

export default getFinancialAdvice;
