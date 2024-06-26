import { BinanceService } from './binance.service';
export declare class BinanceController {
    private readonly binanceService;
    constructor(binanceService: BinanceService);
    placeOrder(): Promise<void>;
    placeFullBalanceOrder(): Promise<void>;
    fetchBalances(): Promise<any>;
    showBalances(): Promise<string>;
}
