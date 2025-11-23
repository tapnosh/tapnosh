export function navigateToLocation(latitude: number, longitude: number) {
  const destination = `${latitude},${longitude}`;

  // Use the navigator protocol which lets the user choose their preferred maps app
  if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
    window.open(`maps://maps.apple.com/?daddr=${destination}`, "_self");
  } else if (navigator.userAgent.match(/Android/i)) {
    window.open(`geo:0,0?q=${destination}`, "_self");
  } else {
    // Fallback for desktop
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
      "_blank",
    );
  }
}
