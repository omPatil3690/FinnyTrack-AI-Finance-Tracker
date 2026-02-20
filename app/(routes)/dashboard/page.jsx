"use client";
import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "@/utils/schema";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
function Dashboard() {
  const { user } = useUser();

  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  useEffect(() => {
    user && getBudgetList();
  }, [user]);
  /**
   * used to get budget List
   */
  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),

        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
    setBudgetList(result);
    getAllExpenses();
    getIncomeList();
  };

  /**
   * Get Income stream list
   */
  const getIncomeList = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Incomes),
          totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(
            Number
          ),
        })
        .from(Incomes)
        .groupBy(Incomes.id); // Assuming you want to group by ID or any other relevant column

      setIncomeList(result);
    } catch (error) {
      console.error("Error fetching income list:", error);
    }
  };

  /**
   * Used to get All expenses belong to users
   */
  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50/50 to-white min-h-screen">
      <div className="mb-8">
        <h2 className="font-bold text-4xl text-gray-900 mb-2">
          Hi, {user?.fullName} 👋
        </h2>
        <p className="text-gray-600 text-lg">
          Here's what's happening with your money. Let's manage your expenses smartly.
        </p>
      </div>

      <CardInfo budgetList={budgetList} incomeList={incomeList} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-8 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <BarChartDashboard budgetList={budgetList} />
          <ExpenseListTable
            expensesList={expensesList}
            refreshData={() => getBudgetList()}
          />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <h2 className="font-bold text-xl text-gray-900 mb-6 flex items-center">
              <span className="w-2 h-6 bg-gradient-to-t from-blue-500 to-purple-600 rounded-full mr-3"></span>
              Latest Budgets
            </h2>
            <div className="space-y-4">
              {budgetList?.length > 0
                ? budgetList.map((budget, index) => (
                    <BudgetItem budget={budget} key={index} />
                  ))
                : [1, 2, 3, 4].map((item, index) => (
                    <div
                      key={index}
                      className="h-[180px] w-full bg-gradient-to-r from-gray-200 to-gray-100 rounded-xl animate-pulse"
                    ></div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
