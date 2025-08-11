






import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Eye, Mail, Settings, TrendingUp, Users, ExternalLink } from "lucide-react";
import { Campaign, CampaignStatus, Email } from "@prisma/client";

// type Campaign = {
//   id: string;
//   name: string;
//   status: string;
//   type: string;
//   description: string;
//   subscribers: number;
//   emails: number;
//   totalEmailsSent: number;
//   openRate: number;
//   clickRate: number;
//   createdAt: string;
//   lastEmailSent: string;
// };
type CampaignWithEmails = Campaign & { emails: Email[] };

interface CampaignsCardProps {
  campaign: Campaign & { emails?: Email[] }
  getStatusColor: (status: CampaignStatus) => string;
  getTypeColor: (type: string) => string;
}

export default function CampaignsCard({ campaign, getStatusColor, getTypeColor }: CampaignsCardProps) {
  return (
    <Card className="bg-black text-white border border-gray-200 rounded-lg  text-blacktransition-colors">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Campaign Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-white capitalize">{campaign.name}</h3>
                  <Badge className={`${getStatusColor(campaign.status)} text-xs sm:text-sm`}>
                    {campaign.status}
                  </Badge>
                  <Badge className={`${getTypeColor(campaign.type ?? 'default')} text-xs sm:text-sm capitalize`}>
                    {campaign.type}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm sm:text-base mb-3 capitalize">{campaign.description}</p>

            
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4">
              {[
                {
                  icon: <Users className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />,
                  label: "Recipients",
                 value: (campaign.recipients ?? 0).toLocaleString(),
                },
                {
                  icon: <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />,
                  label: "Emails",
                  value: campaign.emails?.length?.toLocaleString() ?? "0",
                },
                {
                  icon: <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />,
                  label: "Total Sent",
                  value: campaign.emailsSent.toLocaleString(),
                },
                {
                  icon: <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />,
                  label: "Open Rate",
                  value: `${campaign.openRate || 0}%`,
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg  text-black p-2">
                  <div className="flex items-center gap-2 mb-1">
                    {item.icon}
                    <span className="text-xs sm:text-sm text-gray-400">{item.label}</span>
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-black">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Performance Bars */}
            <div className="space-y-2 sm:space-y-3 mb-4">
                {
                  campaign.openRate && (
                      <div>
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span className="text-gray-400">Open Rate</span>
                        <span className="text-white">{campaign.openRate}%</span>
                      </div>
                      <Progress value={campaign.openRate} className="h-1 sm:h-2 bg-gold-700" />
                    </div>
                  )
                }
                  
             {
              campaign.clickRate && (
                 <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1">
                  <span className="text-gray-400">Click Rate</span>
                  <span className="text-white">{campaign.clickRate}%</span>
                </div>
                <Progress value={campaign.clickRate} className="h-1 sm:h-2 bg-gold-700" />
              </div>
              )
             }
            </div>

            {/* Timeline */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
              </div>

              {
                campaign.lastSentAt &&  (
                  <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Last email: {new Date(campaign.lastSentAt).toLocaleDateString()}</span>
              </div>
                )
              }
              
            </div>
          </div>

          {/* Actions */}
          {/* <div className="flex sm:flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 hover:bg-gray-800 bg-transparent flex-1 lg:flex-none text-xs sm:text-sm"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 hover:bg-gray-800 bg-transparent flex-1 lg:flex-none text-xs sm:text-sm"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Subscribers
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 hover:bg-gray-800 bg-transparent flex-1 lg:flex-none text-xs sm:text-sm"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Settings
            </Button>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
