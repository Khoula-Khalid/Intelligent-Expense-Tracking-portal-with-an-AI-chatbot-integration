import React, { useState, useEffect } from 'react';
import { db } from '../../../../../utils/dbConfig';
import { sql } from 'drizzle-orm';
import { Income } from '../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';

function TotalIncome() {
  const [totalIncome, setTotalIncome] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getTotalIncome();
    }
  }, [user]);

  const getTotalIncome = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    console.log('Fetching total income for user:', userEmail);

    if (!userEmail) {
      console.error('User email is not defined');
      return;
    }

    try {
      const result = await db
        .select({
          totalIncome: sql`SUM(${Income.amount})`.mapWith(Number)
        })
        .from(Income)
        .where(sql`${Income.createdBy} = ${userEmail}`);

      console.log('Query result:', result);

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
    <div className='border p-5 rounded-md bg-gradient-to-r from-purple-400 to-teal-400' style={{ width: '400px' }}>
    <p className='font-bold text-white'>Total Income: ${totalIncome}</p>
    </div>
  );
}

export default TotalIncome;
