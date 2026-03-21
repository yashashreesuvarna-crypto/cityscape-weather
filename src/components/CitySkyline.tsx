const CitySkyline = () => {
  return (
    <>
      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-glow-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-glow-secondary/5 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-glow-accent/5 blur-[80px]" />
      </div>

      {/* City skyline layers */}
      <div
        className="fixed bottom-0 left-0 w-[200%] h-[40%] opacity-20 pointer-events-none z-0"
        style={{
          background: `repeating-linear-gradient(
            to right,
            hsl(195 100% 50% / 0.12) 0,
            hsl(195 100% 50% / 0.12) 18px,
            transparent 18px,
            transparent 40px
          )`,
          animation: "cityMove 80s linear infinite",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              to right,
              hsl(260 60% 55% / 0.15) 0,
              hsl(260 60% 55% / 0.15) 30px,
              transparent 30px,
              transparent 70px
            )`,
            animation: "cityMoveReverse 140s linear infinite",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Scan line effect */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            hsl(195 100% 50% / 0.1) 2px,
            hsl(195 100% 50% / 0.1) 4px
          )`,
        }}
      />
    </>
  );
};

export default CitySkyline;
