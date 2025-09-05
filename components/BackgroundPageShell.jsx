export default function BackgroundPageShell({
  bgSrc,                 // e.g. "/Home.png" or "/Contact%20Us.png"
  overlay = true,        // show a dark overlay for contrast
  overlayOpacity = 0.55, // tweak per page (0.45–0.65 works well on light PNGs)
  children,
}) {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: `url(${bgSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {overlay && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
