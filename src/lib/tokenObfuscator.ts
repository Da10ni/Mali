const encodeMap: Record<string, string> = {
    A: "Q", B: "W", C: "E", D: "R", E: "T", F: "Y", G: "U", H: "I", I: "O", J: "P",
    K: "A", L: "S", M: "D", N: "F", O: "G", P: "H", Q: "J", R: "K", S: "L", T: "Z",
    U: "X", V: "C", W: "V", X: "B", Y: "N", Z: "M",
    a: "q", b: "w", c: "e", d: "r", e: "t", f: "y", g: "u", h: "i", i: "o", j: "p",
    k: "a", l: "s", m: "d", n: "f", o: "g", p: "h", q: "j", r: "k", s: "l", t: "z",
    u: "x", v: "c", w: "v", x: "b", y: "n", z: "m",
    "0": "5", "1": "6", "2": "7", "3": "8", "4": "9", "5": "0", "6": "1", "7": "2", "8": "3", "9": "4",
    ".": "_", "_": ".", "-": "~", "~": "-"
  };
  
  const decodeMap = Object.fromEntries(Object.entries(encodeMap).map(([k, v]) => [v, k]));
  
  export function encodeToken(token: string): string {
    return token
      .split("")
      .map((char) => encodeMap[char] || char)
      .join("");
  }
  
  export function decodeToken(token: string): string {
    return token
      .split("")
      .map((char) => decodeMap[char] || char)
      .join("");
  }
  