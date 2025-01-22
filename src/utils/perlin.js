function openSimplexNoise(clientSeed) {
  'use strict';
  const SQ3 = 1.7320508075688772; //Square root of 3
  const toNums = (s) => s.split(',').map(s => new Uint8Array(s.split('').map(v => Number(v))));// Transforms a string of numbers into an array of numbers
  const decode = (m, r, s) => new Int8Array(s.split('').map(v => parseInt(v, r) + m)); // m is the offset for normalization purposes, r is the base (radix), v is the value
  const NORM_2D = 1.0 / 47.0; // normalizes between -1 and 1
  const SQUISH_2D = (SQ3 - 1) / 2; // skewing the grid to make EQUILATERAL triangle shapes
  const STRETCH_2D = (1 / SQ3 - 1) / 2; // reverse
  var base2D = toNums('110101000,110101211'); // For accelerating the process of adding 1 or subtracting 1 to the x and y coordinates (apparently makes it faster)
  const gradients2D = decode(-5, 11, 'a77a073aa3700330'); // Unitary vectors on different directions to generate the noise
  var lookupPairs2D = () => new Uint8Array([0,1, 1,0, 4,1, 17,0, 20,2, 21,2, 22,5, 23, 5,26, 4,39, 3,42, 4,43, 3]); // Minimizes memory usage by using a lookup table during the multiplication by normal vectors phase
  var p2D = decode(-1, 4, '112011021322233123132111'); // Helps in the selection on which triangle to put each vertex, also helps with the orientation and the smoothing process

  const setOf = (count, cb = (i)=>i) => { var a = [],i = 0; while (i < count) { a.push(cb(i ++)); } return a; }; //Here it's only used for generating arrays from 0 to count
  const doFor = (count, cb) => { var i = 0; while (i < count && cb(i++) !== true); }; //Does something x times can be substituted for a for loop, can do other stuff but it's not used as shuch

  function shuffleSeed(seed,count = 1){ //might be more efficient without recursion?
    seed = seed * 1664525 + 1013904223 | 0;
    count -= 1;
    return count > 0 ? shuffleSeed(seed, count) : seed;
  }
  const types = {
    _2D : {
      base : base2D,
      squish : SQUISH_2D,
      dimensions : 2,
      pD : p2D,
      lookup : lookupPairs2D,
    },
  };

  function createContribution(type, baseSet, index) {
    var i = 0;
    const multiplier = baseSet[index ++];
    const c = { next : undefined };
    while(i < type.dimensions){
      const axis = ('xyzw')[i];
      c[axis + 'sb'] = baseSet[index + i];
      c['d' + axis] = - baseSet[index + i++] - multiplier * type.squish;
    }
    return c;
  }

  function createLookupPairs(lookupArray, contributions){
    var i;
    const a = lookupArray();
    const res = new Map();
    for (i = 0; i < a.length; i += 2) { res.set(a[i], contributions[a[i + 1]]); }
    return res;
  }

  function createContributionArray(type) {
    const conts = [];
    const d = type.dimensions;
    const baseStep = d * d;
    var k, i = 0;
    while (i < type.pD.length) {
      const baseSet = type.base[type.pD[i]];
      let previous, current;
      k = 0;
      do {
        current = createContribution(type, baseSet, k);
        if (!previous) { conts[i / baseStep] = current; }
        else { previous.next = current; }
        previous = current;
        k += d + 1;
      } while(k < baseSet.length);

      current.next = createContribution(type, type.pD, i + 1);
      if (d >= 3) { current.next.next = createContribution(type, type.pD, i + d + 2); }
      if (d === 4) { current.next.next.next = createContribution(type, type.pD, i + 11); }
      i += baseStep;
    }
    const result = [conts, createLookupPairs(type.lookup, conts)];
    type.base = undefined;
    type.lookup = undefined;
    return result;
  }

  const [contributions2D, lookup2D] = createContributionArray(types._2D); //Yup, it's unused, KILL IT!
  const perm = new Uint8Array(256);
  const perm2D = new Uint8Array(256);
  const source = new Uint8Array(setOf(256, i => i));
  var seed = shuffleSeed(clientSeed, 3);
  doFor(256, i => {
    i = 255 - i;
    seed = shuffleSeed(seed);
    var r = (seed + 31) % (i + 1);
    r += r < 0 ? i + 1 : 0;
    perm[i] = source[r];
    perm2D[i] = perm[i] & 0x0E;
    source[r] = source[i];
  });
  base2D = undefined;
  lookupPairs2D = undefined;
  p2D = undefined;

  const API = {
    noise2D(x, y) {
      const pD = perm2D;
      const p = perm;
      const g = gradients2D;
      const stretchOffset = (x + y) * STRETCH_2D;
      const xs = x + stretchOffset, ys = y + stretchOffset;
      const xsb = Math.floor(xs), ysb = Math.floor(ys);
      const squishOffset	= (xsb + ysb) * SQUISH_2D;
      const dx0 = x - (xsb + squishOffset), dy0 = y - (ysb + squishOffset);
      var c = (() => { //Contribution part of the algorithm
        const xins = xs - xsb, yins = ys - ysb;
        const inSum = xins + yins;
        return lookup2D.get( //createContribution -> createContributions->lookup2D
          (xins - yins + 1) |
					(inSum << 1) |
					((inSum + yins) << 2) |
					((inSum + xins) << 4) //Prevents overlap of bits
        );
      })();
      var i, value = 0;
      while (c !== undefined) { //Attenuation part of the algorithm
        const dx = dx0 + c.dx; //Contribution for x
        const dy = dy0 + c.dy; //Contribution for y
        let attn = 2 - dx * dx - dy * dy;
        if (attn > 0) {
          i = pD[(p[(xsb + c.xsb) & 0xFF] + (ysb + c.ysb)) & 0xFF];
          attn *= attn;
          value += attn * attn * (g[i++] * dx + g[i] * dy);
        }
        c = c.next;
      }
      return value * NORM_2D;
    },

  };
  return API;
}

export default openSimplexNoise;
