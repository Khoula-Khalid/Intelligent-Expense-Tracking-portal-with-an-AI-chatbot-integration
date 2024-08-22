import React from 'react'
import GoalList from './_components/GoalList'

function Goals () {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl'>My Financial Goals</h2>
      <GoalList/>
    </div>
  )
}

export default Goals