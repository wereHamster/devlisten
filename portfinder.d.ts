declare module 'portfinder' {
  export function getPort(config: any, cb: (err: Error, port: number) => void): void;
}
