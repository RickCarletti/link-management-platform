import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { API_URL } from "@/services/api"
import Map from "@/components/Map"

export default function LinkAnalytics() {
  const { shortCode } = useParams()

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_URL}api/links/${shortCode}/analytics`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [shortCode])

  if (loading) return <div className="p-6">Carregando...</div>
  if (!data) return <div className="p-6">Erro ao carregar</div>

  return (
    <ScrollArea className="h-[calc(100vh-60px)] pr-2">
      <div className="flex flex-col gap-6 p-6">
        {/* HEADER */}
        <Card>
          <CardContent className="flex flex-col gap-2 p-4">
            <h1 className="text-lg font-semibold">Analytics do Link</h1>

            <a
              href={`${API_URL}${data.shortCode}`}
              target="_blank"
              className="break-all text-primary underline"
            >
              {`${API_URL}${data.shortCode}`}
            </a>

            <p className="text-sm break-all text-muted-foreground">
              {data.originalUrl}
            </p>

            <div className="text-xs text-muted-foreground">
              Criado em: {new Date(data.createdAt).toLocaleString()}
            </div>

            <div className="text-sm font-medium">
              Total de acessos: {data.accesses.length}
            </div>
          </CardContent>
        </Card>

        {/* MAPA (PLACEHOLDER) */}
        <Card>
          <CardContent className="p-4">
            <h2 className="mb-2 text-sm font-medium">Mapa</h2>

            <Map points={data.accesses} />
          </CardContent>
        </Card>

        {/* LISTA DE ACESSOS */}
        <Card>
          <CardContent className="p-4">
            <h2 className="mb-2 text-sm font-medium">Acessos</h2>

            {data.accesses.length === 0 ? (
              <div className="rounded-md border p-4 text-sm text-muted-foreground">
                Nenhum acesso registrado ainda.
              </div>
            ) : (
              <ScrollArea className="h-100 pr-2">
                <div className="flex flex-col gap-2">
                  {data.accesses.map((access: any) => (
                    <div
                      key={access.id}
                      className="flex flex-col gap-1 rounded-md border p-2 text-xs"
                    >
                      <span>
                        <strong>IP:</strong> {access.ip || "N/A"}
                      </span>
                      <span>
                        <strong>User-Agent:</strong> {access.userAgent}
                      </span>
                      <span>
                        <strong>Data:</strong>{" "}
                        {new Date(access.createdAt).toLocaleString()}
                      </span>
                      <span>
                        <strong>Localização:</strong>{" "}
                        {access.city && access.country
                          ? `${access.city}, ${access.country}`
                          : "N/A"}
                      </span>
                      <span>
                        <strong>Latitude/Londitude:</strong>{" "}
                        {access.lat + ", " + access.lon || "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
