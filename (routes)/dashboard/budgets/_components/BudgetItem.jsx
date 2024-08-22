import React from 'react';
import Link from 'next/link';

function BudgetItem({ budget }) {
  const calculateProgressPerc = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return Math.min(perc, 100).toFixed(2); // Ensure percentage does not exceed 100%
  };

  const budgetExceeded = budget.totalSpend > budget.amount;
  const overAmount = budget.totalSpend - budget.amount;

  return (
    <Link href={'/dashboard/expenses/' + budget.id} p-5>
      <div className='p-5 border rounded-lg hover:shadow-md cursor-pointer block h-[190px]'>
        <div className={`flex gap-2 items-center justify-between ${budgetExceeded ? 'bg-red-100' : 'bg-slate-100'} p-4 rounded-lg`}>
          <div className='flex gap-2 items-center'>
            <h2 className='text-2xl p-3 rounded-full bg-gray-200'>{budget.icon}</h2>
            <div>
              <h2 className='font-bold'>{budget.name}</h2>
              <h2 className='text-sm text-gray-500'>{budget.totalItems} Item</h2>
            </div>
          </div>
          <div className='flex flex-col items-end'>
            <h2 className={`font-bold text-lg ${budgetExceeded ? 'text-red-600' : 'text-primary'}`}>${budget.amount}</h2>
          </div>
        </div>
        <div className='mt-5'>
          <div className='flex items-center justify-between mb-3'>
            <h2 className='text-xs text-slate-400'>${budget.totalSpend ? budget.totalSpend : 0} Spend</h2>
            <h2 className={`text-xs text-slate-400 ${budgetExceeded ? 'text-red-600' : ''}`}>
              {budgetExceeded ? `$${overAmount} Over` : `$${budget.amount - budget.totalSpend} Remaining`}
            </h2>
          </div>
          <div className='w-full bg-slate-300 h-2 rounded-full overflow-hidden'>
            <div className={`h-2 rounded-full ${budgetExceeded ? 'bg-red-600' : 'bg-primary'}`}
              style={{
                width: `${calculateProgressPerc()}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BudgetItem;
