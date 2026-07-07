import type { SignalPoint } from "../../types/plotStudio";

export interface FFTPoint {
  frequency: number;
  magnitude: number;
}

function fftInPlace(real: number[], imag: number[], n: number): void {
  let j = 0;
  for (let i = 0; i < n - 1; i++) {
    if (i < j) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
    let k = n / 2;
    while (k <= j) { j -= k; k /= 2; }
    j += k;
  }

  for (let len = 2; len <= n; len *= 2) {
    const halfLen = len / 2;
    const angle = (-2 * Math.PI) / len;
    const wReal = Math.cos(angle);
    const wImag = Math.sin(angle);

    for (let i = 0; i < n; i += len) {
      let curReal = 1;
      let curImag = 0;
      for (let jj = 0; jj < halfLen; jj++) {
        const uReal = real[i + jj];
        const uImag = imag[i + jj];
        const tReal = curReal * real[i + jj + halfLen] - curImag * imag[i + jj + halfLen];
        const tImag = curReal * imag[i + jj + halfLen] + curImag * real[i + jj + halfLen];

        real[i + jj] = uReal + tReal;
        imag[i + jj] = uImag + tImag;
        real[i + jj + halfLen] = uReal - tReal;
        imag[i + jj + halfLen] = uImag - tImag;

        const nextReal = curReal * wReal - curImag * wImag;
        const nextImag = curReal * wImag + curImag * wReal;
        curReal = nextReal;
        curImag = nextImag;
      }
    }
  }
}

export function computeFFT(data: SignalPoint[], sampleRateOverride: number | null): FFTPoint[] {
  const n = data.length;
  const nextPow2 = Math.pow(2, Math.ceil(Math.log2(n)));

  const real = new Array<number>(nextPow2).fill(0);
  const imag = new Array<number>(nextPow2).fill(0);

  for (let i = 0; i < n; i++) real[i] = data[i].value;

  fftInPlace(real, imag, nextPow2);

  let sampleRate: number;
  if (sampleRateOverride && sampleRateOverride > 0) {
    sampleRate = sampleRateOverride;
  } else {
    const dt = (data[data.length - 1].time - data[0].time) / (data.length - 1);
    sampleRate = 1000 / dt;
  }

  const result: FFTPoint[] = [];
  const halfN = nextPow2 / 2;
  for (let i = 0; i < halfN; i++) {
    const freq = (i * sampleRate) / nextPow2;
    const magnitude = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]) / n;
    result.push({ frequency: freq, magnitude });
  }

  return result;
}
