export const API_URL = import.meta.env.VITE_API_URL

export const createLink = async (url: string) => {
  const res = await fetch(`${API_URL}api/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Failed to create link")
  }

  return data
}

export const getRecentLinks = async () => {
  const res = await fetch(`${API_URL}api/links/recent`)

  if (!res.ok) {
    throw new Error("Failed to fetch links")
  }

  return res.json()
}
