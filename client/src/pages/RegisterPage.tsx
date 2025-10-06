import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface RegisterPageProps {
  onBack: () => void;
}

export default function RegisterPage({ onBack }: RegisterPageProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    birthdate: "",
    gender: "",
  });

  const handleNext = () => {
    if (step === 1 && (!formData.email || !formData.password)) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && (!formData.name || !formData.birthdate || !formData.gender)) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        birthdate: new Date(formData.birthdate),
        gender: formData.gender,
      });
      toast({
        title: "¡Bienvenido!",
        description: "Tu cuenta ha sido creada",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la cuenta",
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
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-2">
              <span className="bg-gradient-to-r from-primary to-brand-gold bg-clip-text text-transparent">
                Crear cuenta
              </span>
            </h1>
            <p className="text-muted-foreground">
              Paso {step} de 2
            </p>
          </div>

          <div className="backdrop-blur-xl bg-card/90 border border-card-border rounded-2xl p-8">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    data-testid="input-password"
                  />
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-primary to-brand-gold hover:opacity-90"
                  size="lg"
                  data-testid="button-next"
                >
                  Continuar
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <Label htmlFor="birthdate">Fecha de nacimiento</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                    required
                    data-testid="input-birthdate"
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Género</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger data-testid="select-gender">
                      <SelectValue placeholder="Selecciona tu género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hombre">Hombre</SelectItem>
                      <SelectItem value="mujer">Mujer</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-primary to-brand-gold hover:opacity-90"
                  size="lg"
                  disabled={loading}
                  data-testid="button-submit"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Crear cuenta
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
