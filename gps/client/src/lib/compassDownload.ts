export const compassImageUrl = "/assets/north-star-compass-sean-ali.png";

export function compassLabels(name: string, goal: string) {
  return {
    name: name.trim().split(/\s+/)[0] || "You",
    goal: goal.replace(/\s+/g, " ").trim(),
  };
}

// One reusable image, composed locally. No API, per-user generation fee or upload.
export async function createPersonalizedCompass(name: string, goal: string): Promise<string> {
  const image = new Image();
  image.src = compassImageUrl;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 1254;
  canvas.height = 1374;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image export unavailable");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 120, 1254, 1254);
  const labels = compassLabels(name, goal);
  ctx.textAlign = "center";
  // Use ink bounds to center the lettering itself, not its font line box.
  const centeredText = (text: string, x: number, y: number, width: number, size: number, minimum: number) => {
    ctx.font = `bold ${size}px Georgia, serif`;
    while (size > minimum && ctx.measureText(text).width > width) {
      ctx.font = `bold ${--size}px Georgia, serif`;
    }
    while (ctx.measureText(text).width > width && text.length > 1) {
      text = Array.from(text.replace(/…$/, "")).slice(0, -1).join("") + "…";
    }
    const metrics = ctx.measureText(text);
    const baseline = y + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
    ctx.strokeStyle = "#fffdf4";
    ctx.lineWidth = 7;
    ctx.lineJoin = "round";
    const centerX = x + (metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) / 2;
    ctx.strokeText(text, centerX, baseline);
    ctx.fillStyle = "#123f35";
    ctx.fillText(text, centerX, baseline);
  };
  // Artwork's upper North Star center is (627, 142), plus the header offset.
  centeredText(labels.goal, 627, 55, 1140, 38, 25);
  centeredText(labels.name, 627, 262, 170, 38, 19);
  return canvas.toDataURL("image/png");
}

export async function downloadCompassImage(image: string) {
  if (!image.startsWith("data:image/png")) throw new Error("Personal compass unavailable");
  const link = document.createElement("a");
  link.href = image;
  link.download = "My-North-Star-Compass-by-Sean-Ali.png";
  document.body.append(link);
  link.click();
  link.remove();
}
