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

const getAuthErrorMessage = (status: number, type: "login" | "register") => {
  if (type === "register") {
    switch (status) {
      case 400:
        return "Preencha todos os campos corretamente."
      case 409:
        return "Este e-mail já está em uso."
      default:
        return "Não foi possível criar sua conta."
    }
  }

  switch (status) {
    case 400:
      return "Informe e-mail e senha."
    case 401:
      return "E-mail ou senha inválidos."
    default:
      return "Não foi possível realizar login."
  }
}

export const registerUser = async (payload: {
  name: string
  email: string
  password: string
}) => {
  const response = await fetch(`${API_URL}auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(getAuthErrorMessage(response.status, "register"))
  }

  return data
}

export const loginUser = async (payload: {
  email: string
  password: string
}) => {
  const response = await fetch(`${API_URL}auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(getAuthErrorMessage(response.status, "login"))
  }

  return data
}
