'use client';
import React, { useState } from 'react';
import IncomeListTable from './_components/IncomeListTable';
import CreateIncome from './_components/CreateIncome';
import TotalIncome from './_components/TotalIncome';

function IncomePage() {
  const [refreshIndicator, setRefreshIndicator] = useState(false);

  const refreshData = () => {
    // Toggle refresh indicator to trigger re-render of IncomeListTable
    setRefreshIndicator(prevIndicator => !prevIndicator);
  };

  return (
    <div className='p-10 '>
      <h1 className='font-bold text-3xl mb-8 mt-0'>My Income</h1>
      <div className='mb-8 pr-4 flex justify-between gap-5'>
      
      <div className='flex flex-col gap-4'>
      <TotalIncome key={refreshIndicator} />
      <CreateIncome refreshData={refreshData} />
      </div>
   
        <IncomeListTable key={refreshIndicator} refreshData={refreshData}/>
      </div>
    </div>
  );
}

export default IncomePage;
