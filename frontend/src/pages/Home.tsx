import { useState } from "react";
import { createLink } from "../services/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    setError("");
    setShortUrl("");

    if (!url || !isValidUrl(url)) {
      setError("URL inválida");
      return;
    }

    try {
      setLoading(true);
      const data = await createLink(url);
      setShortUrl(data.shortUrl);
    } catch (err: any) {
      setError(err.message || "Erro ao criar link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
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

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {shortUrl && (
            <a
              href={shortUrl}
              target="_blank"
              className="text-primary underline break-all"
            >
              {shortUrl}
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
}