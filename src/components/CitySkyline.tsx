const CitySkyline = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, hsl(210 60% 88%) 0%, hsl(210 30% 96%) 60%, hsl(30 40% 92%) 100%)`,
        }}
      />

      {/* Clouds */}
      <svg className="absolute top-[8%] w-full opacity-40" style={{ animation: "cloud-drift 120s linear infinite" }} viewBox="0 0 800 100" preserveAspectRatio="none">
        <ellipse cx="200" cy="50" rx="80" ry="30" fill="white" />
        <ellipse cx="250" cy="45" rx="60" ry="25" fill="white" />
        <ellipse cx="160" cy="48" rx="50" ry="22" fill="white" />
      </svg>
      <svg className="absolute top-[15%] w-full opacity-25" style={{ animation: "cloud-drift 180s linear infinite", animationDelay: "-40s" }} viewBox="0 0 800 100" preserveAspectRatio="none">
        <ellipse cx="550" cy="50" rx="70" ry="28" fill="white" />
        <ellipse cx="600" cy="46" rx="55" ry="22" fill="white" />
        <ellipse cx="510" cy="52" rx="45" ry="20" fill="white" />
      </svg>

      {/* Background buildings (far) */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ height: "45%" }}>
        {/* Far layer */}
        <g fill="hsl(220 18% 82%)" opacity="0.5">
          <rect x="0" y="180" width="45" height="220" />
          <rect x="55" y="140" width="50" height="260" />
          <rect x="120" y="200" width="35" height="200" />
          <rect x="170" y="100" width="55" height="300" />
          <rect x="240" y="160" width="40" height="240" />
          <rect x="300" y="120" width="60" height="280" />
          <rect x="380" y="190" width="45" height="210" />
          <rect x="440" y="80" width="50" height="320" />
          <rect x="510" y="150" width="55" height="250" />
          <rect x="580" y="170" width="40" height="230" />
          <rect x="640" y="110" width="60" height="290" />
          <rect x="720" y="190" width="45" height="210" />
          <rect x="780" y="60" width="55" height="340" />
          <rect x="850" y="150" width="50" height="250" />
          <rect x="920" y="180" width="40" height="220" />
          <rect x="980" y="130" width="55" height="270" />
          <rect x="1050" y="100" width="45" height="300" />
          <rect x="1110" y="170" width="60" height="230" />
          <rect x="1190" y="140" width="50" height="260" />
          <rect x="1260" y="90" width="45" height="310" />
          <rect x="1320" y="160" width="55" height="240" />
          <rect x="1390" y="120" width="50" height="280" />
        </g>

        {/* Mid layer */}
        <g fill="hsl(220 18% 75%)" opacity="0.7">
          <rect x="20" y="220" width="60" height="180" rx="2" />
          <rect x="100" y="180" width="70" height="220" rx="2" />
          <rect x="190" y="240" width="50" height="160" rx="2" />
          <rect x="260" y="150" width="65" height="250" rx="2" />
          <rect x="350" y="200" width="55" height="200" rx="2" />
          <rect x="430" y="130" width="70" height="270" rx="2" />
          <rect x="520" y="210" width="50" height="190" rx="2" />
          <rect x="590" y="160" width="65" height="240" rx="2" />
          <rect x="680" y="190" width="55" height="210" rx="2" />
          <rect x="760" y="140" width="60" height="260" rx="2" />
          <rect x="840" y="220" width="50" height="180" rx="2" />
          <rect x="910" y="170" width="70" height="230" rx="2" />
          <rect x="1000" y="200" width="55" height="200" rx="2" />
          <rect x="1080" y="150" width="65" height="250" rx="2" />
          <rect x="1170" y="210" width="50" height="190" rx="2" />
          <rect x="1240" y="160" width="60" height="240" rx="2" />
          <rect x="1330" y="190" width="55" height="210" rx="2" />
        </g>

        {/* Front layer with windows */}
        <g fill="hsl(220 20% 68%)">
          <rect x="10" y="260" width="80" height="140" rx="2" />
          <rect x="110" y="220" width="90" height="180" rx="2" />
          <rect x="220" y="270" width="65" height="130" rx="2" />
          <rect x="310" y="200" width="75" height="200" rx="2" />
          <rect x="410" y="250" width="70" height="150" rx="2" />
          <rect x="500" y="180" width="85" height="220" rx="2" />
          <rect x="610" y="240" width="65" height="160" rx="2" />
          <rect x="700" y="210" width="80" height="190" rx="2" />
          <rect x="800" y="260" width="70" height="140" rx="2" />
          <rect x="895" y="190" width="85" height="210" rx="2" />
          <rect x="1005" y="250" width="65" height="150" rx="2" />
          <rect x="1090" y="210" width="80" height="190" rx="2" />
          <rect x="1195" y="240" width="70" height="160" rx="2" />
          <rect x="1285" y="200" width="75" height="200" rx="2" />
          <rect x="1380" y="250" width="60" height="150" rx="2" />
        </g>

        {/* Windows on front buildings */}
        <g fill="hsl(45 60% 80%)" opacity="0.6">
          {[10, 110, 310, 500, 700, 895, 1090, 1285].map((bx, i) => {
            const bw = [80, 90, 75, 85, 80, 85, 80, 75][i];
            const by = [260, 220, 200, 180, 210, 190, 210, 200][i];
            const rows = Math.floor((400 - by) / 18);
            const cols = Math.floor(bw / 14);
            return Array.from({ length: rows }, (_, r) =>
              Array.from({ length: cols }, (_, c) => (
                <rect
                  key={`${i}-${r}-${c}`}
                  x={bx + 6 + c * 14}
                  y={by + 8 + r * 18}
                  width="6"
                  height="10"
                  rx="1"
                  opacity={Math.random() > 0.3 ? 0.7 : 0.2}
                />
              ))
            );
          })}
        </g>

        {/* Antenna/spires on some buildings */}
        <g stroke="hsl(220 18% 72%)" strokeWidth="2" fill="none">
          <line x1="155" y1="220" x2="155" y2="200" />
          <line x1="347" y1="200" x2="347" y2="175" />
          <line x1="542" y1="180" x2="542" y2="155" />
          <line x1="937" y1="190" x2="937" y2="165" />
          <line x1="1130" y1="210" x2="1130" y2="185" />
        </g>
      </svg>
    </div>
  );
};

export default CitySkyline;
