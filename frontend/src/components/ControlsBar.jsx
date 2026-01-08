export default function ControlsBar({
  isNight,
  toggleNight,
  isRainMuted,
  toggleRain
}) {
  return (
    <>
      <button
        onClick={toggleRain}
        style={{
          position: "absolute",
          bottom: 20,
          left: 20
        }}
      >
        {isRainMuted ? "🔇 Rain" : "🌧️ Rain"}
      </button>

      <button
        onClick={toggleNight}
        style={{
          position: "absolute",
          bottom: 20,
          left: 140
        }}
      >
        {isNight ? "🌙 Night" : "🌞 Day"}
      </button>
    </>
  );
}
