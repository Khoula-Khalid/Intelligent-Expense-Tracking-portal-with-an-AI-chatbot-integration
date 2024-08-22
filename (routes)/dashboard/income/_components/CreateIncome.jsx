import React, { useState } from 'react';

import { Income } from '../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Dialog, DialogOverlay, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../../../../../@/components/ui/dialog';
import Button from '../../../../../components/ui/Button';
import { Loader, X } from 'lucide-react';
import { Input } from '../../../../../@/components/ui/input';
import moment from 'moment';
import { db } from '../../../../../utils/dbConfig';

function CreateIncome({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState('💰');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  // Create new Income
  const onCreateIncome = async () => {
    setLoading(true);
    const result = await db.insert(Income).values({
      name: name,
      amount: amount,
      icon: emojiIcon,
      createdAt: moment().format('DD/MM/YYYY'),
      createdBy: user?.primaryEmailAddress?.emailAddress,
    }).returning({ insertedId: Income.id });

    setName('');
    setAmount('');

    console.log(result);
    if (result) {
      refreshData();
      toast.success('New Income Added!');
      setIsDialogOpen(false);
    } else {
      toast.error('Failed to create income. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className='border p-5 rounded-md' style={{ width: '400px', height:'300px' }}>
    <h2 className='font-bold text-lg'>Add Income</h2>
    <div className='mt-2'>
        <h2 className='text-black font-medium my-1'>Income Name</h2>
        <Input
            placeholder='e.g. Salary'
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
    </div>
    <div className='mt-2'>
        <h2 className='text-black font-medium my-1'>Income Amount</h2>
        <Input
            placeholder='e.g. $2000'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
        />
    </div>
    <Button disabled={!(name && amount)}
        onClick={() => onCreateIncome()}

        className='mt-3 w-full'>
            {loading?
            <Loader className='animate-spin'/>:" Add New Income"
            }
           </Button>
</div>
  );
}

export default CreateIncome;
