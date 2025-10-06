import { Bell, Shield, MapPin, Users, Heart, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [showOnline, setShowOnline] = useState(true);
  const [distance, setDistance] = useState([50]);
  const [ageRange, setAgeRange] = useState([18, 45]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6" data-testid="text-settings-title">
          Configuración
        </h1>

        <div className="space-y-6">
          <div className="backdrop-blur-xl bg-card/50 border border-card-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Notificaciones</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex-1">
                  <p className="font-medium">Notificaciones push</p>
                  <p className="text-sm text-muted-foreground">Recibe alertas de nuevos matches</p>
                </Label>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  data-testid="switch-notifications"
                />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-card/50 border border-card-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Preferencias de Descubrimiento</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">
                  <p className="font-medium mb-1">Mostrar</p>
                </Label>
                <Select defaultValue="todos">
                  <SelectTrigger data-testid="select-show-preference">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="hombres">Hombres</SelectItem>
                    <SelectItem value="mujeres">Mujeres</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="font-medium">Distancia máxima</Label>
                  <span className="text-sm text-muted-foreground" data-testid="text-distance-value">
                    {distance[0]} km
                  </span>
                </div>
                <Slider
                  value={distance}
                  onValueChange={setDistance}
                  max={100}
                  min={1}
                  step={1}
                  data-testid="slider-distance"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="font-medium">Rango de edad</Label>
                  <span className="text-sm text-muted-foreground" data-testid="text-age-range">
                    {ageRange[0]} - {ageRange[1]}
                  </span>
                </div>
                <Slider
                  value={ageRange}
                  onValueChange={setAgeRange}
                  max={80}
                  min={18}
                  step={1}
                  data-testid="slider-age-range"
                />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-card/50 border border-card-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Privacidad</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-online" className="flex-1">
                  <p className="font-medium">Mostrar cuando estoy en línea</p>
                  <p className="text-sm text-muted-foreground">Otros pueden ver si estás activo</p>
                </Label>
                <Switch
                  id="show-online"
                  checked={showOnline}
                  onCheckedChange={setShowOnline}
                  data-testid="switch-show-online"
                />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-card/50 border border-card-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-brand-gold" />
              <h2 className="font-bold text-lg">Chispa Plus</h2>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Mejora tu experiencia con funciones premium
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Heart className="w-4 h-4 text-primary" />
                <span>Likes ilimitados</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Passport para cambiar ubicación</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span>Ver quién te ha dado like</span>
              </div>
            </div>

            <button 
              className="w-full py-3 rounded-full bg-gradient-to-r from-primary to-brand-gold text-white font-bold hover:opacity-90 transition-opacity"
              data-testid="button-upgrade"
            >
              Actualizar a Plus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
