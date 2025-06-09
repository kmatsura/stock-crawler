export interface IPriceSource {
  readonly name: string;
  getClose(code: number): Promise<number>;
}
