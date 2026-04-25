import { useState } from "react"
import { createLink } from "../services/api"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"

export default function Home() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

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
    <div className="flex min-h-screen items-center justify-center">
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
  )
}