declare global {
  interface Window {
    tronWeb?: import("tronweb").TronWeb;
    tronLink?: any;
  }
}

export {};