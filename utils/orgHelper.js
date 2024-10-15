'use server'

import { createClerkClient } from '@clerk/backend'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export async function getMembers(orgId){
  console.log("got resource id", orgId)
  const response = await clerkClient.organizations.getOrganizationMembershipList({ organizationId:orgId })
  const extractedData = response.data.map(membership => ({
    id: membership.id,
    publicUserData: membership.publicUserData
  }));

  return JSON.stringify({
    memberships: extractedData,
    totalCount: response.totalCount
  });
}
