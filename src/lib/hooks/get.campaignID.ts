
import { useParams } from "next/navigation"

export const useCampaignId = () => {
 const params = useParams()
 return params.id as string
}
