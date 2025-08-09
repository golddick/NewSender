import { Card, CardContent } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'
import React from 'react'

interface StatsCardProps {
    Title: string;  
    Stats: { 
        total: number; 
        active?: number; 
        subText?: string; 
    } ;
}
const StatsCard = ({Stats,Title}:StatsCardProps) => {
  return (
    <div>

        <Card className="bg-white border border-gray-200 rounded-lg  text-black">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-black">{Title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-black">{Stats.total}</p>
                    {
                        Stats.active ? (
                            <p className="text-xs text-green-400">{Stats.active} active</p>
                        ) : (
                            <p className="text-xs text-gray-400">{Stats.subText}</p>
                        )
                    }
                  </div>
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
      
    </div>
  )
}

export default StatsCard
