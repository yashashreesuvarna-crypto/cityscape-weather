import CitySkyline from "@/components/CitySkyline";
import WeatherApp from "@/components/WeatherApp";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <CitySkyline />
      <WeatherApp />
    </div>
  );
};

export default Index;
