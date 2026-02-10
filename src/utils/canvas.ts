export const createScratchCanvas = (
  width: number,
  height: number,
  coverImage?: string
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  if (coverImage) {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = coverImage;
  } else {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#c0c0c0');
    gradient.addColorStop(1, '#808080');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  return canvas;
};

export const scratchAt = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  radius: number = 20
): number => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  return calculateScratchPercentage(canvas);
};

export const calculateScratchPercentage = (canvas: HTMLCanvasElement): number => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let transparentPixels = 0;

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] < 128) {
      transparentPixels++;
    }
  }

  return (transparentPixels / (pixels.length / 4)) * 100;
};

export const createConfettiParticle = (
  x: number,
  y: number,
  color: string
): {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
} => {
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 10,
    vy: Math.random() * -15 - 5,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    color,
    size: Math.random() * 8 + 4
  };
};

export const drawConfetti = (
  ctx: CanvasRenderingContext2D,
  particles: ReturnType<typeof createConfettiParticle>[]
): void => {
  particles.forEach(particle => {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate((particle.rotation * Math.PI) / 180);
    ctx.fillStyle = particle.color;
    ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
    ctx.restore();
  });
};

export const updateConfettiParticles = (
  particles: ReturnType<typeof createConfettiParticle>[],
  gravity: number = 0.5
): ReturnType<typeof createConfettiParticle>[] => {
  return particles
    .map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      vy: particle.vy + gravity,
      rotation: particle.rotation + particle.rotationSpeed
    }))
    .filter(particle => particle.y < window.innerHeight + 100);
};

export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string): void => {
  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
};

export const canvasToBlob = async (canvas: HTMLCanvasElement): Promise<Blob | null> => {
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob));
  });
};
