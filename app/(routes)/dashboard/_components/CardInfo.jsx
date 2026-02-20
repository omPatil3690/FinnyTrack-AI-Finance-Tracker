import formatNumber from "@/utils";
import getFinancialAdvice from "@/utils/getFinancialAdvice";
import {
  PiggyBank,
  ReceiptText,
  Wallet,
  Sparkles,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import React, { useEffect, useState } from "react";

function CardInfo({ budgetList, incomeList }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [financialAdvice, setFinancialAdvice] = useState("");

  useEffect(() => {
    if (budgetList.length > 0 || incomeList.length > 0) {
      CalculateCardInfo();
    }
  }, [budgetList, incomeList]);

  useEffect(() => {
    if (totalBudget > 0 || totalIncome > 0 || totalSpend > 0) {
      const fetchFinancialAdvice = async () => {
        const advice = await getFinancialAdvice(
          totalBudget,
          totalIncome,
          totalSpend
        );
        setFinancialAdvice(advice);
      };

      fetchFinancialAdvice();
    }
  }, [totalBudget, totalIncome, totalSpend]);

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

  const cardData = [
    {
      title: "Total Budget",
      value: totalBudget,
      icon: PiggyBank,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
    },
    {
      title: "Total Spent",
      value: totalSpend,
      icon: ReceiptText,
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      trend: spendingPercentage > 80 ? "high" : "normal",
    },
    {
      title: "Remaining",
      value: remainingBudget,
      icon: remainingBudget >= 0 ? TrendingUp : TrendingDown,
      gradient: remainingBudget >= 0 ? "from-green-500 to-green-600" : "from-red-500 to-red-600",
      bgColor: remainingBudget >= 0 ? "bg-green-100" : "bg-red-100",
      textColor: remainingBudget >= 0 ? "text-green-700" : "text-red-700",
    },
    {
      title: "Total Income",
      value: totalIncome,
      icon: CircleDollarSign,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
    },
  ];

  return (
    <div>
      {budgetList?.length > 0 ? (
        <div>
          {/* AI Advice Card */}
          <div
            className="bg-white border border-gray-200 mt-4 -mb-1 rounded-2xl p-6 shadow-lg card-hover"
          >
            <div className="flex items-start space-x-4">
              <div className="relative">
                <Sparkles className="w-12 h-12 p-2 rounded-full text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">FinTrack AI Assistant</h3>
                  <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                    Smart Insights
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {financialAdvice || "Analyzing your financial data to provide personalized insights..."}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg card-hover relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${formatNumber(card.value)}
                    </p>
                    {card.trend === "high" && (
                      <span className="text-xs text-red-600 font-medium">
                        ⚠️ High spending
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
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Budget utilization</span>
                      <span>{spendingPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          spendingPercentage > 90
                            ? "bg-red-500"
                            : spendingPercentage > 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
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
              className="h-[140px] w-full bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CardInfo;
