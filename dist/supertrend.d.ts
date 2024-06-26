interface Kline {
    high: number;
    low: number;
    close: number;
}
export declare function calculateATR(data: Kline[], period: number): number[];
export declare function calculateSupertrendWithSignals(data: Kline[], atrPeriod: number, multiplier: number): {
    supertrend: number[];
    finalUpperBand: number[];
    finalLowerBand: number[];
    trend: boolean[];
    signals: string[];
};
export {};
