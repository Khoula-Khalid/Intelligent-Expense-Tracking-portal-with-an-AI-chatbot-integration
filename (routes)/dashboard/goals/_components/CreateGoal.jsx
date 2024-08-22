import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { Input } from '../../../../../@/components/ui/input';
import { db } from '../../../../../utils/dbConfig';
import { Goals } from '../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

const CreateGoal = ({ refreshGoals }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Begin'); // Default status
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const isButtonDisabled = !(name && amount);

  const onCreateGoal = async () => {
    setLoading(true);
    const result = await db.insert(Goals).values({
      name: name,
      amount: amount,
      description: description,
      status: status,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    }).returning({ insertedId: Goals.id });

    if (result) {
      toast('Goal Created successfully!');
      refreshGoals();
      setName('');
      setAmount('');
      setDescription('');
      setStatus('Begin');
    } else {
      console.error('Failed to create goal');
    }

    setLoading(false);
  };

  return (
    <div className="border p-5 rounded-md shadow-lg w-130" style={{height: '320px' }}>
      <h2 className="text-xl font-semibold mb-4">Add a new Goal!</h2>
      <div className="flex items-center mb-4 mt-4">
        <div className="flex-1 mr-2">
          <h2 className="text-black font-medium my-1">Goal Name</h2>
          <Input
            placeholder="e.g. Buying new car"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex-1 ml-2">
          <h2 className="text-black font-medium my-1">Goal Amount</h2>
          <Input
            placeholder="e.g. $2000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4 flex items-center">
        <div className="flex-1 mr-2 mt-2">
          <h2 className="text-black font-medium my-1">Description</h2>
          <Input
            placeholder="Optional"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex-1 ml-2 mt-2">
          <h2 className="text-black font-medium my-1">Status</h2>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className=" block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
          >
            <option value="Begin">Begin</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>
      <button
        disabled={isButtonDisabled || loading}
        onClick={onCreateGoal}
        className={`mt-2 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors duration-300 ${
          isButtonDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? <Loader className="animate-spin" /> : 'Create a new goal!'}
      </button>
    </div>
  );
};

export default CreateGoal;
