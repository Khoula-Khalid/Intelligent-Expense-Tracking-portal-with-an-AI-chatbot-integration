'use client';
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogOverlay,
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../../../../../@/components/ui/dialog';
import EmojiPicker from 'emoji-picker-react';
import Button from '../../../../../components/ui/Button';
import { X } from 'lucide-react';
import { Input } from '../../../../../@/components/ui/input';
import { db } from '../../../../../utils/dbConfig';
import { Budgets } from '../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

const CreateBudget = ({ refreshData }) => {
  const [emojiIcon, setEmojiIcon] = useState('🛍️');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const { user } = useUser();

  // Create new Budget
  const onCreateBudget = async () => {
    try {
      const result = await db.insert(Budgets).values({
        name,
        amount: parseFloat(amount), 
        createdBy: user?.primaryEmailAddress?.emailAddress,
        icon: emojiIcon
      }).returning({ insertedId: Budgets.id });

      console.log('Insert result:', result);

      if (result.length > 0) {
        refreshData();
        toast('Budget Created successfully!');
        setIsDialogOpen(false); // Close dialog after successful creation
        setName(''); // Reset the input fields
        setAmount('');
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('Failed to create budget. Please try again.');
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md h-[187px]">
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent className='fixed left-1/2 top-1/2 z-50 w-full max-w-lg transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg border'>
          <button 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            onClick={() => setIsDialogOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              <div className='mt-5'>
                <Button variant="outline" size='lg' className='text-lg' onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                  {emojiIcon}
                </Button>
                {openEmojiPicker && (
                  <div className='absolute z-10'>
                    <EmojiPicker 
                      open={openEmojiPicker}
                      onEmojiClick={(e) => {
                        setEmojiIcon(e.emoji);
                        setOpenEmojiPicker(false);
                      }} 
                    />
                  </div>
                )}
              </div>
              <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Budget Name</h2>
                <Input 
                  placeholder='e.g. Home decor' 
                  value={name}
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                <Input 
                  type='number' 
                  placeholder='e.g. $1000' 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)} 
                />
              </div>

              <Button 
                disabled={!(name && amount)} 
                onClick={onCreateBudget} 
                className='mt-5 w-full'
              >
                Create Budget
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBudget;
