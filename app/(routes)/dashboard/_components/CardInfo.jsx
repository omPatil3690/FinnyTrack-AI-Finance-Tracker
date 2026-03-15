import formatNumber from "@/utils";
import getFinancialAdvice, {
  getFinancialAdviceRemaining,
} from "@/utils/getFinancialAdvice";
import {
  PiggyBank,
  Receipt,
  Sparkles,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import React, { useEffect, useState } from "react";

function CardInfo({ budgetList, incomeList, budgetsLoaded = true, incomesLoaded = true }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [financialAdvice, setFinancialAdvice] = useState("");
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const [adviceRequested, setAdviceRequested] = useState(false);
  const [remainingCalls, setRemainingCalls] = useState(null);
  const adviceStorageKey = "aiAdvice:last";
  const rateLimitMax = 5;

  useEffect(() => {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    const storedAdvice = window.sessionStorage.getItem(adviceStorageKey);
    if (storedAdvice) {
      try {
        const parsed = JSON.parse(storedAdvice);
        if (parsed?.advice) {
          setFinancialAdvice(parsed.advice);
          setAdviceRequested(true);
        }
        if (typeof parsed?.remaining === "number") {
          setRemainingCalls(parsed.remaining);
        }
      } catch (error) {
        setFinancialAdvice(storedAdvice);
        setAdviceRequested(true);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadRemaining = async () => {
      const remaining = await getFinancialAdviceRemaining();
      if (!isMounted) return;
      if (typeof remaining === "number") {
        setRemainingCalls(remaining);
      }
    };
    loadRemaining();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    if (!financialAdvice && remainingCalls === null) return;
    window.sessionStorage.setItem(
      adviceStorageKey,
      JSON.stringify({ advice: financialAdvice, remaining: remainingCalls }),
    );
  }, [financialAdvice, remainingCalls]);

  useEffect(() => {
    if (!budgetsLoaded || !incomesLoaded) return;
    CalculateCardInfo();
  }, [budgetList, incomeList, budgetsLoaded, incomesLoaded]);

  const CalculateCardInfo = () => {
    console.log(budgetList);
    let totalBudget_ = 0;
    let totalSpend_ = 0;
    let totalIncome_ = 0;

    budgetList.forEach((element) => {
      totalBudget_ = totalBudget_ + Number(element.amount);
      totalSpend_ = totalSpend_ + element.totalSpend;
    });

    incomeList.forEach((element) => {
      totalIncome_ = totalIncome_ + element.totalAmount;
    });

    setTotalIncome(totalIncome_);
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
  };

  const remainingBudget = totalBudget - totalSpend;
  const spendingPercentage = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
  const isDataReady = budgetsLoaded && incomesLoaded;
  const hasAdviceData =
    isDataReady &&
    ((Number.isFinite(totalBudget) && totalBudget > 0) ||
      (Number.isFinite(totalIncome) && totalIncome > 0) ||
      (Number.isFinite(totalSpend) && totalSpend > 0));
  const isRateLimited = remainingCalls === 0;
  const canRequestAdvice = hasAdviceData && !isAdviceLoading && !isRateLimited;

  const handleGenerateAdvice = async () => {
    if (!canRequestAdvice) return;
    setIsAdviceLoading(true);
    setAdviceRequested(true);
    try {
      const result = await getFinancialAdvice(
        totalBudget,
        totalIncome,
        totalSpend
      );
      setFinancialAdvice(result.advice);
      if (typeof result.remaining === "number") {
        setRemainingCalls(result.remaining);
      }
    } finally {
      setIsAdviceLoading(false);
    }
  };

  const cardData = [
    {
      title: "Total Budget",
      value: totalBudget,
      icon: PiggyBank,
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      title: "Total Spent",
      value: totalSpend,
      icon: Receipt,
      bgColor: "bg-rose-500/10 dark:bg-rose-500/20",
      textColor: "text-rose-600 dark:text-rose-400",
      trend: spendingPercentage > 80 ? "high" : "normal",
    },
    {
      title: "Remaining",
      value: remainingBudget,
      icon: remainingBudget >= 0 ? TrendingUp : TrendingDown,
      bgColor:
        remainingBudget >= 0
          ? "bg-emerald-500/10 dark:bg-emerald-500/20"
          : "bg-rose-500/10 dark:bg-rose-500/20",
      textColor:
        remainingBudget >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400",
    },
    {
      title: "Total Income",
      value: totalIncome,
      icon: CircleDollarSign,
      bgColor: "bg-cyan-500/10 dark:bg-cyan-500/20",
      textColor: "text-cyan-600 dark:text-cyan-400",
    },
  ];

  return (
    <div>
      {budgetList?.length > 0 ? (
        <div>
          {/* AI Advice Card */}
          <div
            className="bg-card border border-border mt-4 -mb-1 rounded-2xl p-6 shadow-lg card-hover"
          >
            <div className="flex items-start space-x-4">
              <div className="relative">
                <Sparkles className="w-12 h-12 p-2 rounded-full text-primary-foreground bg-primary shadow-[0_0_16px_rgba(0,245,212,0.35)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-foreground">FinTrack AI Assistant</h3>
                    <span className="px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                      Smart Insights
                    </span>
                    {typeof remainingCalls === "number" && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          remainingCalls === 0
                            ? "text-rose-600 bg-rose-500/10"
                            : remainingCalls <= 2
                            ? "text-amber-600 bg-amber-500/10"
                            : "text-emerald-600 bg-emerald-500/10"
                        }`}
                      >
                        {remainingCalls} / {rateLimitMax} requests left today
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateAdvice}
                    disabled={!canRequestAdvice}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      canRequestAdvice
                        ? "bg-primary text-primary-foreground border-primary/40 hover:bg-primary/90 shadow-[0_0_12px_rgba(0,245,212,0.35)]"
                        : "border-border text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {isAdviceLoading ? "Generating..." : "Generate AI Advice"}
                  </button>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {financialAdvice
                    ? financialAdvice
                    : isAdviceLoading
                    ? "Generating your personalized advice..."
                    : !isDataReady
                    ? ""
                    : !hasAdviceData
                    ? "Add budgets, income, or spending to get AI insights."
                    : !adviceRequested
                    ? "Click \"Generate AI Advice\" to get insights."
                    : "No advice generated."}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-6 shadow-lg card-hover relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${formatNumber(card.value)}
                    </p>
                    {card.trend === "high" && (
                      <span className="text-xs text-rose-500 font-medium">
                        High spending
                      </span>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl ${card.bgColor}`}>
                    <card.icon className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                </div>

                {/* Progress bar for budget utilization */}
                {card.title === "Total Spent" && totalBudget > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Budget utilization</span>
                      <span>{spendingPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          spendingPercentage > 90
                            ? "bg-rose-500"
                            : spendingPercentage > 70
                            ? "bg-yellow-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className="h-[140px] w-full bg-muted animate-pulse rounded-2xl"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CardInfo;
