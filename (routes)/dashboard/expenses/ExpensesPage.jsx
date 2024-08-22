"use client";
import React, { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import { db } from '../../../../utils/dbConfig';
import { Expenses } from '../../../../utils/schema';
import { desc } from 'drizzle-orm';

function ExpensesPage() {
    const [expensesList, setExpensesList] = useState([]);

    const fetchExpenses = async () => {
        const expenses = await db.select().from(Expenses)
        .orderBy(desc(Expenses.id))
        setExpensesList(expenses);
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    return (
        <div className='ml-6 mt-5 mr-8'>
            <h1 className='font-bold text-2xl mb-8 '>Expenses</h1>
            <ExpenseListTable expensesList={expensesList} refreshData={fetchExpenses} />
        </div>
    );
}

export default ExpensesPage;
