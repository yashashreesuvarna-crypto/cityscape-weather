import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Thermometer, Wind, Droplets, Eye, MapPin, CloudRain } from "lucide-react";

interface WeatherData {
  name: string;
  main: { temp: number; humidity: number; feels_like: number; pressure: number };
  weather: { description: string; icon: string; main: string }[];
  wind: { speed: number };
  visibility: number;
  sys: { country: string };
}

const weatherIcons: Record<string, string> = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Haze: "🌫️",
  Fog: "🌫️",
};

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    try {
      const apiKey = "2b3cc35e531c62c5694d0540a058caa3";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      if (data.cod !== 200) {
        setError("City not found");
        setWeather(null);
      } else {
        setWeather(data);
        setError("");
      }
    } catch {
      setError("Something went wrong");
      setWeather(null);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") fetchWeather();
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass glow-primary rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <CloudRain className="w-5 h-5 text-primary" />
            <h1 className="font-display text-sm font-semibold tracking-[0.3em] uppercase text-gradient">
              Weather
            </h1>
          </div>
          <p className="text-muted-foreground text-sm tracking-wide mt-1">
            Real-time weather intelligence
          </p>
        </div>

        {/* Search */}
        <div className="px-8 pb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter city name..."
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 pl-11
                  text-foreground text-sm tracking-wide placeholder:text-muted-foreground
                  focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                  transition-all duration-300"
              />
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchWeather}
              disabled={loading}
              className="bg-primary/10 border border-primary/30 text-primary rounded-xl px-5
                hover:bg-primary/20 transition-all duration-300 flex items-center gap-2
                disabled:opacity-50 font-display text-xs tracking-widest uppercase"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-8 pb-4"
            >
              <p className="text-destructive text-sm tracking-wide text-center">{error} ❌</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weather Data */}
        <AnimatePresence mode="wait">
          {weather && (
            <motion.div
              key={weather.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="px-8 pb-8"
            >
              {/* Divider */}
              <div className="h-px bg-border mb-6" />

              {/* City & Temp */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display text-lg font-bold tracking-wider text-foreground">
                    {weather.name}
                  </h2>
                  <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase mt-1">
                    {weather.sys.country} · {weather.weather[0].description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-4xl" style={{ animation: "float 3s ease-in-out infinite" }}>
                    {weatherIcons[weather.weather[0].main] || "🌤️"}
                  </span>
                </div>
              </div>

              {/* Temperature display */}
              <div className="mb-6">
                <span className="font-display text-5xl font-bold text-gradient glow-text">
                  {Math.round(weather.main.temp)}°
                </span>
                <span className="text-muted-foreground text-sm ml-2 tracking-wide">
                  Feels like {Math.round(weather.main.feels_like)}°C
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={<Droplets className="w-4 h-4" />} label="Humidity" value={`${weather.main.humidity}%`} />
                <StatCard icon={<Wind className="w-4 h-4" />} label="Wind" value={`${weather.wind.speed} m/s`} />
                <StatCard icon={<Thermometer className="w-4 h-4" />} label="Pressure" value={`${weather.main.pressure} hPa`} />
                <StatCard icon={<Eye className="w-4 h-4" />} label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-muted/30 border border-border/50 rounded-xl p-3 transition-colors hover:border-primary/20"
  >
    <div className="flex items-center gap-2 text-primary mb-1">{icon}
      <span className="text-xs text-muted-foreground tracking-[0.15em] uppercase">{label}</span>
    </div>
    <p className="font-display text-sm font-semibold text-foreground tracking-wider">{value}</p>
  </motion.div>
);

export default WeatherApp;
