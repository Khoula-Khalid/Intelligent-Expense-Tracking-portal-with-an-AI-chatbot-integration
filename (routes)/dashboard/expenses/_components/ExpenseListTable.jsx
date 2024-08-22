import { Trash } from 'lucide-react';
import React from 'react';
import { db } from '../../../../../utils/dbConfig';
import { Expenses } from '../../../../../utils/schema';
import { toast } from 'sonner';
import { desc, eq } from 'drizzle-orm';

function ExpenseListTable({ expensesList, refreshData }) {
    const deleteExpense = async (expense) => {
        const result = await db.delete(Expenses)
            .where(eq(Expenses.id, expense.id))
            
            .returning();

        if (result) {
            toast('Expense Deleted Successfully!');
            refreshData();
        }
    };

    return (
        <div className='mt-3 items-center pl-50' style={{ width: '900px'}}>
            <div className='bg-gradient-to-r from-purple-400 to-teal-400 rounded-md border p-5  grid grid-cols-4 text-white'>
                <h2 className='font-bold'>Name</h2>
                <h2 className='font-bold'>Amount</h2>
                <h2 className='font-bold'>Date</h2>
                <h2 className='font-bold'>Action</h2>
            </div>
            {expensesList.map((expense, index) => (
                <div key={expense.id} className='bg-white rounded-md border p-5 mt-2 grid grid-cols-4'>
                    <h2>{expense.name}</h2>
                    <h2>${expense.amount}</h2>
                    <h2>{expense.createdAt}</h2>
                    <h2>
                        <Trash className='text-red-600 cursor-pointer'
                            onClick={() => deleteExpense(expense)}
                        />
                    </h2>
                </div>
            ))}
        </div>
    );
}

export default ExpenseListTable;
