import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onSignUp: () => void;
}

export default function LoginPage({ onSignUp }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      await signInWithGoogle();
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión con Google",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo iniciar sesión con Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-brand-gold/20" />
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="https://yt3.googleusercontent.com/-xjgZXaiuPVZ22Sq8qd05QDgLmVmcvUJjMH71G1ZLG1Y3_fvmQLkh_E0bRAPGDGT7ppb2CmsMkc=s120-c-k-c0x00ffffff-no-rj" 
              alt="Chispa Cubana"
              className="w-20 h-20 rounded-2xl mx-auto mb-4"
            />
            <h1 className="text-4xl font-extrabold mb-2">
              <span className="bg-gradient-to-r from-primary to-brand-gold bg-clip-text text-transparent">
                Chispa Cubana
              </span>
            </h1>
            <p className="text-muted-foreground">
              La chispa que buscas, a un clic de distancia
            </p>
          </div>

          <div className="backdrop-blur-xl bg-card/90 border border-card-border rounded-2xl p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  data-testid="input-email"
                />
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  data-testid="input-password"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-brand-gold hover:opacity-90"
                size="lg"
                disabled={loading}
                data-testid="button-login"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Iniciar Sesión
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">o continúa con</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={loading}
              data-testid="button-google-login"
            >
              <Mail className="w-4 h-4 mr-2" />
              Google
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              ¿No tienes cuenta?{" "}
              <button 
                className="text-primary hover:underline font-semibold"
                onClick={onSignUp}
                disabled={loading}
                data-testid="link-signup"
              >
                Regístrate gratis
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Al continuar, aceptas nuestros{" "}
            <a href="#" className="underline">Términos de Servicio</a>
            {" "}y{" "}
            <a href="#" className="underline">Política de Privacidad</a>
          </p>
        </div>
      </div>
    </div>
  );
}
