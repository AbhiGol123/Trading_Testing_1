import { CandlestickGateway } from './candlestick.gateway';
import { DatabaseService } from '../provider/database.provider';
import { BinanceService } from '../binance/binance.service';
export declare class CandlestickService {
    private readonly databaseService;
    private readonly candlestickGateway;
    private readonly binanceService;
    private ws;
    private wps;
    private candlesticks;
    private signals;
    private recordedData;
    private csvFilePath;
    private csvWriter;
    last_time: any;
    count: number;
    signal_count: number;
    private lastSignal;
    lastMinute: number;
    private dbClient;
    constructor(databaseService: DatabaseService, candlestickGateway: CandlestickGateway, binanceService: BinanceService);
    onModuleInit(): Promise<void>;
    initializeCsvWriter(): void;
    startFetchingData(): Promise<void>;
    writeToCSV(): Promise<void>;
    calculateSupertrendFromCSV(): Promise<void>;
    readCSV(): Promise<any[]>;
    calculateSupertrend(data: any[], period?: number, multiplier?: number): {
        supertrend: any[];
        inUptrend: any[];
    };
    getSupertrend(): Promise<any[]>;
    saveCandlestickData(data: any): Promise<void>;
    saveSignalData(data: any): Promise<void>;
}
