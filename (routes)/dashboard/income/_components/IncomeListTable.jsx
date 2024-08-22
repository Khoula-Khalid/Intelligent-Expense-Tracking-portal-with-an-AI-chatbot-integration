import React, { useState, useEffect } from 'react';
import { db } from '../../../../../utils/dbConfig';
import { Income } from '../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import CreateIncome from './CreateIncome';
import { desc, eq } from 'drizzle-orm';
import moment from 'moment';

function IncomeListTable({ refreshData }) {
    const [isCreateIncomeOpen, setIsCreateIncomeOpen] = useState(false);
    const [incomes, setIncomes] = useState([]);

    const { user } = useUser();
    
    const fetchIncomes = async () => {
        const result = await db.select().from(Income)
        .orderBy(desc(Income.id));
        setIncomes(result);
    };

    useEffect(() => {
        fetchIncomes();
    }, [refreshData]);

    const deleteIncome = async (income) => {
        const result = await db.delete(Income)
            .where(eq(Income.id, income.id))
            .returning();

        if (result) {
            toast.success('Income Deleted Successfully!');
            refreshData();
        } else {
            toast.error('Failed to delete income. Please try again.');
        }
    };

    const handleAddIncome = (newIncome) => {
        setIncomes([...incomes, newIncome]);
    };

    const handleCreateIncomeClose = () => {
        setIsCreateIncomeOpen(false);
    };

    return (
        <div className='mr-12 items-center pl-50' style={{ width: '550px'}}>
            <div className='bg-primary rounded-md border p-5 grid grid-cols-4 text-white'>
                <h2 className='font-bold'>Name</h2>
                <h2 className='font-bold'>Amount</h2>
                <h2 className='font-bold'>Date</h2>
                <h2 className='font-bold'>Action</h2>
            </div>
            {incomes && incomes.length > 0 ? (
                incomes.map((income) => {
                    return (
                        <div key={income.id} className='bg-white rounded-md border p-5 mt-2 grid grid-cols-4'>
                            <h2>{income.name}</h2>
                            <h2>${income.amount}</h2>
                            <h2>{income.createdAt}</h2>
                            <h2>
                                <Trash className='text-red-600 cursor-pointer'
                                    onClick={() => deleteIncome(income)}
                                />
                            </h2>
                        </div>
                    );
                })
            ) : (
                <div className="text-center mt-4 text-gray-500">
                    No incomes found.
                </div>
            )}

            {/* Create Income Dialog */}
            {isCreateIncomeOpen && (
                <CreateIncome
                    refreshData={fetchIncomes}
                    onClose={handleCreateIncomeClose}
                    onAddIncome={handleAddIncome}
                />
            )}
        </div>
    );
}

export default IncomeListTable;
