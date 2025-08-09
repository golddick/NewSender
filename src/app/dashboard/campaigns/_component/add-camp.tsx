// import { Button } from '@/components/ui/button'
// import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
// import { Input } from '@/components/ui/input'
// import { DialogTitle } from '@radix-ui/react-dialog'
// import { Plus } from 'lucide-react'
// import React, { useState } from 'react'

// interface AddCampProps {
//     AddCampaignOpen: boolean,
// }

// const AddCamp = ({AddCampaignOpen }:AddCampProps) => {

//       const [campaignName, setCampaignName] = useState("")
//         const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(AddCampaignOpen)

//       const handleAddCampaign = () => {
//     // Here you would typically send the data to your API
//     console.log("Adding new campaign:", campaignName)
//     // Reset form and close modal
//     setCampaignName("")
//     setIsAddCampaignOpen(false)
//   }

//     // const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(AddCampaignOpen)
    
//   return (
//     <div>
//                   <Dialog open={isAddCampaignOpen} onOpenChange={setIsAddCampaignOpen}>
//               <DialogTrigger asChild>
//                 <Button className="bg-black text-white hover:bg-white hover:text-black">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Campaign
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[425px] bg-white  border-gray-800">
//                 <DialogHeader>
//                   <DialogTitle
//                    className="text-black">Create New Campaign</DialogTitle>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <label htmlFor="campaign-name" className="text-right text-white">
//                       Name
//                     </label>
//                     <Input
//                       id="campaign-name"
//                       value={campaignName}
//                       onChange={(e) => setCampaignName(e.target.value)}
//                       className="col-span-3 bg-gray-800 border-gray-700 text-white"
//                       placeholder="Enter campaign name"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2">
//                   <Button 
//                     variant="outline" 
//                     onClick={() => setIsAddCampaignOpen(false)}
//                     className="border-gray-700 hover:bg-gray-800"
//                   >
//                     Cancel
//                   </Button>
//                   <Button 
//                     onClick={handleAddCampaign}
//                     className="bg-yellow-500 hover:bg-yellow-600 text-black"
//                   >
//                     Create Campaign
//                   </Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//     </div>
//   )
// }

// export default AddCamp







'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Plus } from 'lucide-react';
import { addCampaign } from '@/actions/campaign/add-campaign';

interface AddCampProps {
  AddCampaignOpen: boolean;
}

const AddCamp = ({ AddCampaignOpen }: AddCampProps) => {
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(AddCampaignOpen);
  const [isPending, startTransition] = useTransition();

  const handleAddCampaign = () => {
    if (!campaignName.trim()) return;

    startTransition(async () => {
      try {
        await addCampaign({
          name: campaignName.trim(),
          description: description.trim(),
          type: type.trim(),
        });

        // Reset form and close modal
        setCampaignName('');
        setDescription('');
        setType('');
        setIsAddCampaignOpen(false);
      } catch (error) {
        console.error('Failed to create campaign:', error);
      }
    });
  };

  return (
    <div>
      <Dialog open={isAddCampaignOpen} onOpenChange={setIsAddCampaignOpen}>
        <DialogTrigger asChild>
          <Button className="bg-black text-white hover:bg-white hover:text-black">
            <Plus className="h-4 w-4 mr-2" />
            Add Campaign
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-black">Create New Campaign</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">

            {/* Campaign Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="campaign-name" className="text-right text-black">
                Name
              </label>
              <Input
                id="campaign-name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="col-span-3 bg-gray-800 border-gray-700 text-white"
                placeholder="Enter campaign name"
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right text-black">
                Description
              </label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 bg-gray-800 border-gray-700 text-white"
                placeholder="Enter description"
              />
            </div>

            {/* Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-black">
                Type
              </label>
              <Input
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="col-span-3 bg-gray-800 border-gray-700 text-white"
                placeholder="e.g. Welcome, Promo"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddCampaignOpen(false)}
              className="border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={handleAddCampaign}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              {isPending ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddCamp;
