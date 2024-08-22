"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseTableList from '../_components/ExpenseListTable';
import Button from '../../../../../components/ui/Button';
import { Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../../@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from '../_components/EditBudget';

function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user]);

  const getBudgetInfo = async () => {
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Budgets.id, params.id))
      .groupBy(Budgets.id);

    setBudgetInfo(result[0]);
    getExpensesList();
  };

  const getExpensesList = async () => {
    const result = await db.select().from(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  const deleteBudget = async () => {
    try {
      // First delete expenses
      const deleteExpenseResult = await db.delete(Expenses)
        .where(eq(Expenses.budgetId, params.id))
        .returning();

      console.log('Deleted expenses:', deleteExpenseResult);

      // Then delete budget
      if (deleteExpenseResult) {
        const result = await db.delete(Budgets)
          .where(eq(Budgets.id, params.id))
          .returning();
        console.log('Deleted budget:', result);

        toast('Budget Deleted Successfully!');
        router.replace('/dashboard/budgets');
      } else {
        toast.error('Failed to delete expenses. Cannot delete budget.');
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget. Please try again.');
    }
  };

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold flex justify-between items-center'>
        My Expenses
        <div className='flex gap-2 items-center'>
          <EditBudget budgetInfo={budgetInfo} refreshData={getBudgetInfo} /> 
          <AlertDialog className='fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state:closed]:fade-out-0 data-[state=open]:fade-in-0'>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2" variant="destructive">
                <Trash /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state:closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state:closed]:zoom-out-95 data-[state:open]:zoom-in-95 data-[state:closed]:slide-out-to-left-1/2 data-[state:closed]:slide-out-to-top-[48%] data-[state:open]:slide-in-from-left-1/2 data-[state:open]:slide-in-from-top-[48%] sm:rounded-lg">
              <AlertDialogHeader className="flex flex-col space-y-2 text-center sm:text-left">
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-muted-foreground">
                  This action cannot be undone. This will permanently delete your current budget along with expenses from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <AlertDialogCancel className="mt-2 sm:mt-0">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteBudget}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
        )}
        <AddExpense
          budgetId={params.id}
          user={user}
          refreshData={getBudgetInfo} 
        />
      </div>
      <div className='mt-4'>
        <h2 className='font-bold text-lg'>Latest Expenses</h2>
        <ExpenseTableList
          expensesList={expensesList}
          refreshData={getBudgetInfo} // Corrected prop name
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;
