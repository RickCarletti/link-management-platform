import { useState } from "react"
import { API_URL, createLink } from "../services/api"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect } from "react"
import { getRecentLinks } from "@/services/api"

export default function Home() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [recentLinks, setRecentLinks] = useState<any[]>([])
  const [loadingLinks, setLoadingLinks] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const fetchLinks = async () => {
    try {
      setLoadingLinks(true)
      const data = await getRecentLinks()
      setRecentLinks(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingLinks(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  const isValidUrl = (value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async () => {
    setError("")
    setShortUrl("")

    if (!url || !isValidUrl(url)) {
      setError("URL inválida")
      return
    }

    try {
      setLoading(true)
      const data = await createLink(url)
      setShortUrl(data.shortUrl)
    } catch (err: any) {
      setError(err.message || "Erro ao criar link")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!shortUrl) return

    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative flex min-h-screen">
      <div className="flex flex-1 items-center justify-center">
        <Button
          className="fixed top-4 right-4 z-50 lg:hidden"
          onClick={() => setShowSidebar(true)}
        >
          Links
        </Button>
        <Card className="w-[420px]">
          <CardContent className="flex flex-col gap-4 p-6">
            <h1 className="text-xl font-semibold">URL Shortener</h1>

            <Input
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Encurtando..." : "Encurtar"}
            </Button>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {shortUrl && (
              <div className="flex items-center gap-2">
                <a
                  href={shortUrl}
                  target="_blank"
                  className="flex-1 break-all text-primary underline"
                >
                  {shortUrl}
                </a>

                <Button variant="secondary" onClick={handleCopy}>
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="hidden w-[360px] border-l bg-background p-4 lg:block">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            Últimos links
          </h2>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchLinks}
            disabled={loadingLinks}
          >
            {loadingLinks ? "..." : "Atualizar"}
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-80px)] pr-2">
          <div className="flex flex-col gap-3">
            {recentLinks.map((link) => (
              <div
                key={link.id}
                className="flex flex-col gap-1 rounded-md border p-3"
              >
                <a
                  href={`${API_URL}${link.shortCode}`}
                  target="_blank"
                  className="text-sm break-all text-primary underline"
                >
                  {`${API_URL}${link.shortCode}`}
                </a>

                <p className="text-xs break-all text-muted-foreground">
                  {link.originalUrl}
                </p>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{new Date(link.createdAt).toLocaleString()}</span>
                  {link.user?.name && <span>{link.user.name}</span>}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      {showSidebar && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="absolute top-0 right-0 h-full w-[320px] bg-background p-4">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setShowSidebar(false)}
            >
              Fechar
            </Button>

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">
                Últimos links
              </h2>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchLinks}
                disabled={loadingLinks}
              >
                {loadingLinks ? "..." : "Atualizar"}
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-120px)] pr-2">
              <div className="flex flex-col gap-3">
                {recentLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex flex-col gap-1 rounded-md border p-3"
                  >
                    <a
                      href={`${API_URL}${link.shortCode}`}
                      target="_blank"
                      className="text-sm break-all text-primary underline"
                    >
                      {`${API_URL}${link.shortCode}`}
                    </a>

                    <p className="text-xs break-all text-muted-foreground">
                      {link.originalUrl}
                    </p>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{new Date(link.createdAt).toLocaleString()}</span>

                      {link.user?.name && <span>{link.user.name}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  )
}
