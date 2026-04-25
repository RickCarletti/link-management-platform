import { useState } from "react";
import { createLink } from "../services/api";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = await createLink(url);
      setShortUrl(data.shortUrl);
    } catch {
      alert("Erro ao criar link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>URL Shortener</h1>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        style={{ width: 300 }}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "..." : "Encurtar"}
      </button>

      {shortUrl && (
        <div style={{ marginTop: 20 }}>
          <p>Seu link:</p>
          <a href={shortUrl} target="_blank">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}
