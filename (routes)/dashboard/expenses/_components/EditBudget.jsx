"use client";
import React, { useEffect, useState } from 'react';
import Button from '../../../../../components/ui/Button';
import { PenBox, X } from 'lucide-react';
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
import { useUser } from '@clerk/nextjs';
import { Input } from '../../../../../@/components/ui/input';
import { db } from '../../../../../utils/dbConfig';
import { Budgets } from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';

function EditBudget({budgetInfo, refreshData}) {

    const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [name, setName] = useState();
    const [amount, setAmount] = useState();

    const { user } = useUser();

    useEffect(()=>{
      if(budgetInfo){
        setEmojiIcon(budgetInfo?.icon)
        setAmount(budgetInfo.amount);
        setName(budgetInfo.name)
      }
      
    },[budgetInfo])

    const onUpdateBudget =async() => {
        // Update budget logic here
        const result=await db.update(Budgets).set({
          name:name,
          amount:amount,
          icon:emojiIcon,
        }).where(eq(Budgets.id,budgetInfo.id))
        .returning();

        if(result){

          refreshData()
          toast('Budget Updated Successfully!')
          setIsDialogOpen(false)
        }
    }

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className='flex gap-2'>
                        <PenBox /> Edit
                    </Button>
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
                        <DialogTitle>Update Budget</DialogTitle>
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
                                    defaultValue={budgetInfo?.name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className='mt-2'>
                                <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                <Input
                                    type='number'
                                    placeholder='e.g. $1000'
                                    defaultValue={budgetInfo?.amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            <Button
                                disabled={!(name && amount)}
                                onClick={onUpdateBudget}
                                className='mt-5 w-full'
                            >
                                Update Budget
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default EditBudget;
