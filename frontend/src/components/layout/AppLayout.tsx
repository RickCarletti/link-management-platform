import { useEffect, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getRecentLinks, API_URL } from "@/services/api"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/link-manegement.png"

export default function AppLayout({ children }: { children: ReactNode }) {
  const [recentLinks, setRecentLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const navigate = useNavigate()

  const fetchLinks = async () => {
    try {
      setLoading(true)
      const data = await getRecentLinks()
      setRecentLinks(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* TOPBAR */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <button
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-2 text-sm font-semibold"
        >
          <img src={logo} alt="Shortener" className="h-8 w-auto" />
          URL Shortener
        </button>

        <Button
          className="lg:hidden"
          size="sm"
          onClick={() => setShowSidebar(true)}
        >
          Links
        </Button>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1">
        {/* MAIN */}
        <div className="flex-1">{children}</div>

        {/* SIDEBAR DESKTOP */}
        <div className="hidden w-[360px] border-l p-4 lg:block">
          <SidebarContent
            recentLinks={recentLinks}
            loading={loading}
            fetchLinks={fetchLinks}
            navigate={navigate}
          />
        </div>
      </div>

      {/* SIDEBAR MOBILE */}
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

            <SidebarContent
              recentLinks={recentLinks}
              loading={loading}
              fetchLinks={fetchLinks}
              navigate={navigate}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function SidebarContent({ recentLinks, loading, fetchLinks, navigate }: any) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">
          Últimos links
        </h2>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchLinks}
          disabled={loading}
        >
          {loading ? "..." : "Atualizar"}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-140px)] pr-2">
        <div className="flex flex-col gap-3">
          {recentLinks.map((link: any) => (
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

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/links/${link.shortCode}`)}
                className="cursor-pointer"
              >
                Analytics
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  )
}
