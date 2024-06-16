export function contrastColor(hex: string): string {
  const rgb = hexToRgb(hex);

  if (rgb == null) {
    return "#000000";
  } else {
    // Calculate the perceptive luminance (aka luma) - human eye favors green color...
    const luma = (0.299 * rgb.r) + (0.587 * rgb.g) + (0.114 * rgb.b)

    // Return black for bright colors, white for dark colors
    if (luma > 60) {
      return "#000000"
    } else {
      return "#FFFFFF"
    }
  }
}

type rgb = {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): rgb | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}