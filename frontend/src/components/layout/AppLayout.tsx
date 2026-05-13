import { useEffect, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import {
  getRecentLinks,
  API_URL,
  registerUser,
  loginUser,
} from "@/services/api"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/link-manegement.png"
import { useAuth } from "@/context/AuthContext"

export default function AppLayout({ children }: { children: ReactNode }) {
  const [recentLinks, setRecentLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const { user, login, logout } = useAuth()

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  })

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

  const handleAuth = async () => {
    try {
      let loginResponse

      if (isRegister) {
        await registerUser({
          name: authForm.name,
          email: authForm.email,
          password: authForm.password,
        })

        toast.success("Conta criada com sucesso")
      }

      loginResponse = await loginUser({
        email: authForm.email,
        password: authForm.password,
      })
      login(loginResponse)

      toast.success("Login realizado com sucesso")

      setAuthForm({
        name: "",
        email: "",
        password: "",
      })

      setShowAuthModal(false)
    } catch (error: any) {
      toast.error(error.message || "Algo deu errado")
    }
  }

  const handleLogout = () => {
    logout()
    toast.success("Sessão encerrada")
  }

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

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>

              <span className="text-sm">Olá, {user.name}</span>

              <Button
                className="cursor-pointer"
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => setShowAuthModal(true)}
            >
              Entrar
            </Button>
          )}

          <Button
            className="cursor-pointer lg:hidden"
            size="sm"
            onClick={() => setShowSidebar(true)}
          >
            Links
          </Button>
        </div>
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
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[400px] rounded-xl border bg-background p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">
              {isRegister ? "Criar conta" : "Entrar"}
            </h2>

            <div className="flex flex-col gap-3">
              {isRegister && (
                <input
                  className="rounded-md border p-2"
                  placeholder="Nome"
                  value={authForm.name}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, name: e.target.value })
                  }
                />
              )}

              <input
                className="rounded-md border p-2"
                placeholder="Email"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm({ ...authForm, email: e.target.value })
                }
              />

              <input
                type="password"
                className="rounded-md border p-2"
                placeholder="Senha"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
              />

              <Button onClick={handleAuth}>
                {isRegister ? "Registrar" : "Entrar"}
              </Button>

              <button
                className="text-sm text-primary underline"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister
                  ? "Já possui conta? Entrar"
                  : "Não possui conta? Criar conta"}
              </button>

              <Button variant="ghost" onClick={() => setShowAuthModal(false)}>
                Fechar
              </Button>
            </div>
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
