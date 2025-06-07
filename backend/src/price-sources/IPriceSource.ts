export interface IPriceSource {
  readonly name: string;
  getClose(code: number, date: Date): Promise<number>;
}
