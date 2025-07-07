'use client'

import { useParams } from "next/navigation"

export const useAppName = () => {
 const params = useParams()
 return params.name as string
}
