'use client';
import React, { useEffect, useState } from 'react';
import CreateGoal from './CreateGoal';
import { db } from '../../../../../utils/dbConfig';
import { desc, eq, getTableColumns } from 'drizzle-orm';
import { Goals } from '../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import GoalItem from './GoalItem';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const GoalList = () => {
  const [goalList, setGoalList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && getGoalList();
  }, [user]);

  const getGoalList = async () => {
    const result = await db.select({
      ...getTableColumns(Goals),
    }).from(Goals)
      .where(eq(Goals.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Goals.id));

    setGoalList(result);
  };

  const getPieChartData = () => {
    const totalGoals = goalList.length;
    const completedGoals = goalList.filter(goal => goal.status === 'Done').length;
    const inProgressGoals = goalList.filter(goal => goal.status === 'In Progress').length;

    return [
      { name: 'Completed', value: completedGoals, color: '#93E9BE' },
      { name: 'In Progress', value: inProgressGoals, color: 'url(#colorInProgress)' },
    ];
  };

  return (
    <div className="mt-7">
      
      <div className="flex justify-between items-start mb-4">
        <CreateGoal refreshGoals={getGoalList} />
        <div className="border p-5 rounded-md shadow-lg flex flex-col items-center justify-center" style={{ width: '500px', height: '320px' }}>
  <h2 className="text-xl font-semibold mb-4">Total Number Of Goals: {goalList.length}</h2>
  <div style={{ width: '80%', height: '80%' }}>
    <ResponsiveContainer width="90%" height="100%">
      <PieChart>
        <defs>
          <linearGradient id="colorInProgress" x1="0" y1="0" x2="1" y2="1">
            <stop offset="50%" stopColor="purple" />
            <stop offset="100%" stopColor="teal" />
          </linearGradient>
        </defs>
        <Pie
          data={getPieChartData()}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#008080"
        >
          {getPieChartData().map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

      </div>
      <div className="mr-12 items-center pl-50' style={{ width: '550px'}} gap-5">
        {goalList.map((goal, index) => (
          <GoalItem key={index} goal={goal} refreshGoals={getGoalList} />
        ))}
      </div>
    </div>
  );
};

export default GoalList;
