import type { SeriesData } from "../../types/plotStudio";

export interface FFTResult {
  frequency: Float64Array;
  magnitude: Float64Array;
}

function fftInPlace(real: Float64Array, imag: Float64Array, n: number): void {
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

export function computeFFT(data: SeriesData, sampleRateOverride: number | null): FFTResult {
  const n = data.value.length;
  const nextPow2 = Math.pow(2, Math.ceil(Math.log2(n)));

  const real = new Float64Array(nextPow2);
  const imag = new Float64Array(nextPow2);
  real.set(data.value);

  fftInPlace(real, imag, nextPow2);

  let sampleRate: number;
  if (sampleRateOverride && sampleRateOverride > 0) {
    sampleRate = sampleRateOverride;
  } else {
    const dt = (data.time[n - 1] - data.time[0]) / (n - 1);
    sampleRate = 1000 / dt;
  }

  const halfN = nextPow2 / 2;
  const frequency = new Float64Array(halfN);
  const magnitude = new Float64Array(halfN);
  for (let i = 0; i < halfN; i++) {
    frequency[i] = (i * sampleRate) / nextPow2;
    magnitude[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]) / n;
  }

  return { frequency, magnitude };
}
