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

interface ForecastItem {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number };
  weather: { description: string; main: string; icon: string }[];
}

interface DayForecast {
  date: string;
  dayName: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
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

const API_KEY = "2b3cc35e531c62c5694d0540a058caa3";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`),
      ]);
      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      if (currentData.cod !== 200) {
        setError("City not found");
        setWeather(null);
        setForecast([]);
      } else {
        setWeather(currentData);
        setForecast(parseForecast(forecastData.list));
        setError("");
      }
    } catch {
      setError("Something went wrong");
      setWeather(null);
      setForecast([]);
    }
    setLoading(false);
  };

  const parseForecast = (list: ForecastItem[]): DayForecast[] => {
    const days: Record<string, { temps: number[]; conditions: string[]; icons: string[] }> = {};
    const today = new Date().toDateString();

    list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const key = date.toDateString();
      if (key === today) return;
      if (!days[key]) days[key] = { temps: [], conditions: [], icons: [] };
      days[key].temps.push(item.main.temp);
      days[key].conditions.push(item.weather[0].main);
      days[key].icons.push(item.weather[0].main);
    });

    return Object.entries(days).slice(0, 5).map(([dateStr, data]) => {
      const date = new Date(dateStr);
      const conditionCounts = data.conditions.reduce((acc, c) => {
        acc[c] = (acc[c] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const topCondition = Object.entries(conditionCounts).sort((a, b) => b[1] - a[1])[0][0];

      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        tempMin: Math.round(Math.min(...data.temps)),
        tempMax: Math.round(Math.max(...data.temps)),
        condition: topCondition,
        icon: topCondition,
      };
    });
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
        className="glass rounded-2xl overflow-hidden"
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
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 pl-11
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
              className="bg-primary text-primary-foreground rounded-xl px-5
                hover:bg-primary/90 transition-all duration-300 flex items-center gap-2
                disabled:opacity-50 font-display text-xs tracking-widest uppercase
                shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
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

        {/* Current Weather */}
        <AnimatePresence mode="wait">
          {weather && (
            <motion.div
              key={weather.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="px-8 pb-6"
            >
              <div className="h-px bg-border mb-6" />

              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display text-lg font-bold tracking-wider text-foreground">
                    {weather.name}
                  </h2>
                  <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase mt-1">
                    {weather.sys.country} · {weather.weather[0].description}
                  </p>
                </div>
                <span className="text-4xl" style={{ animation: "float 3s ease-in-out infinite" }}>
                  {weatherIcons[weather.weather[0].main] || "🌤️"}
                </span>
              </div>

              <div className="mb-6">
                <span className="font-display text-5xl font-bold text-gradient">
                  {Math.round(weather.main.temp)}°
                </span>
                <span className="text-muted-foreground text-sm ml-2 tracking-wide">
                  Feels like {Math.round(weather.main.feels_like)}°C
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={<Droplets className="w-4 h-4" />} label="Humidity" value={`${weather.main.humidity}%`} />
                <StatCard icon={<Wind className="w-4 h-4" />} label="Wind" value={`${weather.wind.speed} m/s`} />
                <StatCard icon={<Thermometer className="w-4 h-4" />} label="Pressure" value={`${weather.main.pressure} hPa`} />
                <StatCard icon={<Eye className="w-4 h-4" />} label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5-Day Forecast */}
        <AnimatePresence>
          {forecast.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="px-8 pb-8"
            >
              <div className="h-px bg-border mb-5" />
              <h3 className="font-display text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-4">
                5-Day Forecast
              </h3>
              <div className="space-y-2">
                {forecast.map((day, i) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl
                      bg-secondary/30 hover:bg-secondary/50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-[100px]">
                      <span className="text-lg">{weatherIcons[day.icon] || "🌤️"}</span>
                      <div>
                        <p className="font-display text-xs font-semibold tracking-wider text-foreground">
                          {day.dayName}
                        </p>
                        <p className="text-xs text-muted-foreground tracking-wide">{day.date}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground tracking-wider capitalize">
                      {day.condition}
                    </p>
                    <div className="flex items-center gap-2 font-display text-xs font-semibold">
                      <span className="text-foreground">{day.tempMax}°</span>
                      <span className="text-muted-foreground">{day.tempMin}°</span>
                    </div>
                  </motion.div>
                ))}
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
    className="bg-secondary/40 border border-border/50 rounded-xl p-3 transition-colors hover:border-primary/20"
  >
    <div className="flex items-center gap-2 text-primary mb-1">
      {icon}
      <span className="text-xs text-muted-foreground tracking-[0.15em] uppercase">{label}</span>
    </div>
    <p className="font-display text-sm font-semibold text-foreground tracking-wider">{value}</p>
  </motion.div>
);

export default WeatherApp;
