import { useEffect, useState } from "react"
import { getMyLinks, API_URL } from "@/services/api"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Link2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyLinks()
        setLinks(data)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-semibold">Meus Links</h1>

        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="space-y-3 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!links.length) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 p-12 text-center">
        <div className="rounded-full border p-4">
          <Link2 className="h-8 w-8 text-muted-foreground" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Nenhum link encontrado</h2>
          <p className="text-sm text-muted-foreground">
            Você ainda não criou nenhum link encurtado.
          </p>
        </div>

        <Button onClick={() => navigate("/")}>Criar meu primeiro link</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Meus Links</h1>

      <div className="flex flex-col gap-4">
        {links.map((link) => (
          <Card key={link.id}>
            <CardContent className="space-y-2 p-4">
              <a
                href={`${API_URL}${link.shortCode}`}
                target="_blank"
                className="break-all text-primary underline"
              >
                {`${API_URL}${link.shortCode}`}
              </a>

              <p className="text-sm break-all text-muted-foreground">
                {link.originalUrl}
              </p>

              <p className="text-xs text-muted-foreground">
                {new Date(link.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
