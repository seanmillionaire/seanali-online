export const compassImageUrl = "/assets/north-star-compass-sean-ali.png";

export async function downloadCompassImage() {
  const response = await fetch(compassImageUrl);
  if (!response.ok) throw new Error("Compass image unavailable");
  const blob = await response.blob();
  if (!blob.type.startsWith("image/")) throw new Error("Invalid compass image");
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "North-Star-Compass-by-Sean-Ali.png";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
