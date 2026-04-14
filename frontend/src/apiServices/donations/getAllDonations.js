import { getToken } from "../getToken"

export default async function getAllDonations() {
  try {
    const token = getToken()
    const res = await fetch("/api/Donation", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}