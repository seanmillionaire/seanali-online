function svgBlob(svg: SVGSVGElement): Blob {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml;charset=utf-8" });
}
function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  // Allow the browser to consume the download URL before releasing it.
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
export function downloadEmblemSvg(svg: SVGSVGElement) {
  download(svgBlob(svg), "dream-life-emblem.svg");
}
export async function downloadEmblemPng(svg: SVGSVGElement) {
  const url = URL.createObjectURL(svgBlob(svg));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 1536;
    canvas.height = 1720;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image export is unavailable in this browser.");
    context.fillStyle = "#fffcf6";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("Could not create the image.")), "image/png"));
    download(blob, "dream-life-emblem.png");
  } finally {
    URL.revokeObjectURL(url);
  }
}
