export const DexScreenerChart = () => {
  return (
    <div className="bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/60 rounded-2xl p-4 shadow-[0_0_30px_rgba(251,191,36,0.3)] relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-goblin-gold flex items-center gap-2">
          📈 Live Trading Chart
        </h3>
        <div className="text-xs text-muted-foreground">
          Powered by DexScreener
        </div>
      </div>

      {/* Embed Container */}
      <div className="relative w-full dex-embed-container">
        <style>{`
          .dex-embed-container {
            padding-bottom: 125%;
          }
          @media(min-width:1400px) {
            .dex-embed-container {
              padding-bottom: 65%;
            }
          }
        `}</style>
        <iframe
          src="https://dexscreener.com/solana/EMrpbqAmruGBfkejNXQPZVTkuFHt7pc6DUeHRfN8qSQV?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15"
          className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
          title="TRN Trading Chart"
        />
      </div>

      {/* Terro mascot overlay */}
      <div className="absolute bottom-6 right-6 w-12 h-12 opacity-40 hover:opacity-100 transition-opacity pointer-events-none z-10">
        <img
          src="/terrain-mascot.png"
          alt="Terro watching the market"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
};
