'use client';
import React, { useState } from 'react';
import { db } from '../../../../../utils/dbConfig';
import { Goals } from '../../../../../utils/schema';
import Button from '../../../../../components/ui/Button';
import { Trash2, Edit2, CheckCircle, Circle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../../../@/components/ui/dialog';
import { Input } from "../../../../../@/components/ui/input";
import { toast } from 'sonner';
import { eq } from 'drizzle-orm';

const GoalItem = ({ goal, refreshGoals }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(goal.name);
  const [editedAmount, setEditedAmount] = useState(goal.amount);
  const [editedDescription, setEditedDescription] = useState(goal.description);
  const [editedStatus, setEditedStatus] = useState(goal.status);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the goal "${goal.name}"?`);
    if (confirmDelete) {
      await db.delete(Goals)
        .where(eq(Goals.id, goal.id))
        .execute();

      console.log(`Goal with ID ${goal.id} deleted successfully.`);
      toast.success('Goal deleted successfully!');
      refreshGoals();
    }
  };

  const handleEdit = async () => {
    await db.update(Goals)
      .set({
        name: editedName,
        amount: editedAmount,
        description: editedDescription,
        status: editedStatus,
      })
      .where(eq(Goals.id, goal.id))
      .execute();

    console.log(`Goal with ID ${goal.id} updated successfully.`);
    toast.success('Goal updated successfully!');
    setIsDialogOpen(false);
    refreshGoals();
  };

  const handleStatusChange = async (newStatus) => {
    await db.update(Goals)
      .set({ status: newStatus })
      .where(eq(Goals.id, goal.id))
      .execute();

    console.log(`Goal with ID ${goal.id} status changed to ${newStatus}.`);
    toast.success(`Status changed to ${newStatus} successfully!`);
    refreshGoals();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done':
        return '#93E9BE'; // Light green color
      case 'In Progress':
        return 'url(#colorInProgress)'; // Gradient from purple to teal
      case 'Begin':
        return '#48CAE4'; // Light blue color
    }
  };

  const openDialog = () => {
    setEditedName(goal.name);
    setEditedAmount(goal.amount);
    setEditedDescription(goal.description);
    setEditedStatus(goal.status);
    setIsDialogOpen(true);
  };

  return (
    <div className={`bg-white rounded-md border p-5 mt-2 grid grid-cols-4`}>
      <div className="col-span-3">
        <h3 className="text-lg font-semibold">{goal.name}</h3>
        <p>Amount: ${goal.amount}</p>
        <p>Description: {goal.description || 'N/A'}</p>
      </div>
      <div className="col-span-1 flex flex-col items-end justify-between">
        <div className="flex space-x-2 mb-2">
          <Button onClick={openDialog}>
            <Edit2 size={18} className="inline-block mr-1" /> Edit
          </Button>
          <Button onClick={handleDelete} variant="danger" className='bg-red-500 text-white'>
            <Trash2 size={18} className="inline-block mr-1" /> Delete
          </Button>
        </div>
        <div className="flex items-center" style={{ width: '75%', height: '20px' }}>
          <button
            className={`rounded-full py-1 px-3 text-sm flex items-center justify-center`}
            onClick={() => handleStatusChange(
              goal.status === 'Done' ? 'Begin' :
              goal.status === 'In Progress' ? 'Done' :
              'In Progress'
            )}
            style={{
              width: '100%',
              height: '34px',
              backgroundColor: getStatusColor(goal.status),
              backgroundImage:
                goal.status === 'In Progress'
                  ? 'linear-gradient(to right, purple, teal)'
                  : 'none',
              color: goal.status === 'Done' ? 'black' : 'white', // Black text for 'Done', white text otherwise
              fontSize: goal.status === 'Done' ? '0.875rem' : '0.75rem', // Adjust text size as needed
            }}
          >
            {goal.status === 'Done' && <CheckCircle className="mr-2" size={18} />}
            {goal.status === 'In Progress' && <Circle className="mr-2" size={18} />}
            {goal.status === 'Begin' && <Circle className="mr-2" size={18} />}
            <span>{goal.status}</span>
          </button>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className='fixed left-1/2 top-1/2 z-50 w-full max-w-lg transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg border'>
          <button 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            onClick={() => setIsDialogOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>
              <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Goal Name</h2>
                <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
              </div>
              <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Goal Amount</h2>
                <Input type='number' value={editedAmount} onChange={(e) => setEditedAmount(e.target.value)} />
              </div>
              <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Description</h2>
                <Input value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
              </div>
              <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Status</h2>
                <select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value)} className="select select-bordered w-full">
                  <option value="Begin">Begin</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <Button onClick={handleEdit} className='mt-5 w-full'>
                Save Changes
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalItem;
