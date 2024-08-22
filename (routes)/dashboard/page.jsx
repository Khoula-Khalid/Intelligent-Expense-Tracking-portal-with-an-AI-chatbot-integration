"use client"

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '../../../utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses, Income } from '../../../utils/schema';
import PieChartDashboard from '../dashboard/_components/BarChartDashboard'; // Updated import
import CardInfo from '../dashboard/_components/CardInfo';
import BudgetItem from './budgets/_components/BudgetItem';
import Link from 'next/link';

function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    if (user) {
      getBudgetList();
      fetchTotalIncome();
    }
  }, [user]);

  const getBudgetList = async () => {
    try {
      const result = await db.select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItems: sql`count(${Expenses.id})`.mapWith(Number)
      }).from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      setBudgetList(result);
    } catch (error) {
      console.error('Error fetching budget list:', error);
    }
  };

  const fetchTotalIncome = async () => {
    try {
      const result = await db
        .select({
          totalIncome: sql`sum(${Income.amount})`.mapWith(Number),
        })
        .from(Income)
        .where(eq(Income.createdBy, user.primaryEmailAddress.emailAddress));

      if (result && result.length > 0) {
        setTotalIncome(result[0].totalIncome || 0);
      } else {
        setTotalIncome(0);
      }
    } catch (error) {
      console.error('Error fetching total income:', error);
    }
  };

  return (
    <div className='p-5'>
      <h2 className='font-bold text-3xl'>
        Hi, {user?.fullName}
      </h2>
      <p className='text-gray-500 mt-2 mb-0'>Here's what's happening with your money. Let's manage your expenses.</p>
      <CardInfo totalIncome={totalIncome} budgetList={budgetList} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-4 gap-5'>
        <div className='col-span-2'>
          <PieChartDashboard budgetList={budgetList} totalIncome={totalIncome} />
        </div>
        <div className='grid gap-5'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {budgetList.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
      
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
