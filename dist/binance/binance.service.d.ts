export declare class BinanceService {
    private readonly logger;
    private apiKey;
    private apiSecret;
    private apiUrl;
    private balance;
    last_balance: number;
    private generateSignature;
    getAccountInfo(): Promise<any>;
    getUSDTBalances(): Promise<any>;
    getCurrentBTCPrice(): Promise<number>;
    showbalances(): Promise<string>;
    placeMarketOrder(symbol: string, side: string, quantity: number): Promise<any>;
    placeFullBalanceOrder(symbol: string, side: string): Promise<any>;
}
