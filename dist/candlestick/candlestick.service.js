"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlestickService = void 0;
const common_1 = require("@nestjs/common");
const candlestick_gateway_1 = require("./candlestick.gateway");
const WebSocket = require("ws");
const csv_writer_1 = require("csv-writer");
const fs = require("fs");
const csv = require("csv-parser");
const database_provider_1 = require("../provider/database.provider");
const binance_service_1 = require("../binance/binance.service");
let CandlestickService = class CandlestickService {
    constructor(databaseService, candlestickGateway, binanceService) {
        this.databaseService = databaseService;
        this.candlestickGateway = candlestickGateway;
        this.binanceService = binanceService;
        this.candlesticks = [];
        this.signals = [];
        this.recordedData = [];
        this.last_time = null;
        this.count = 0;
        this.signal_count = 0;
        this.lastSignal = null;
        this.lastMinute = 0;
        this.initializeCsvWriter();
        this.csvFilePath = 'signals.csv';
    }
    async onModuleInit() {
        try {
            this.dbClient = this.databaseService.getClient();
            console.log('Database client initialized');
        }
        catch (error) {
            console.error('Error initializing database client:', error.message);
        }
        this.startFetchingData();
    }
    initializeCsvWriter() {
        this.csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: 'signals.csv',
            header: [
                { id: 'time', title: 'Time' },
                { id: 'open', title: 'Open' },
                { id: 'high', title: 'High' },
                { id: 'low', title: 'Low' },
                { id: 'close', title: 'Close' }
            ]
        });
    }
    async startFetchingData() {
        const symbol = 'btcusdt';
        const interval = '1m';
        const wsUrl = `wss://fstream.binancefuture.com/ws/${symbol}@kline_${interval}`;
        const wsPriceUrl = 'wss://fstream.binancefuture.com/ws/btcusdt@markPrice@1s';
        this.ws = new WebSocket(wsUrl);
        this.wps = new WebSocket(wsPriceUrl);
        this.ws.on('open', () => {
            console.log('WebSocket connected');
        });
        this.ws.on('message', async (data) => {
            const candlestickData = JSON.parse(data);
            const processedData = {
                t: new Date(candlestickData.k.t),
                o: parseFloat(candlestickData.k.o),
                h: parseFloat(candlestickData.k.h),
                l: parseFloat(candlestickData.k.l),
                c: parseFloat(candlestickData.k.c)
            };
            this.candlesticks.push(processedData);
            const currentMinute = processedData.t.getMinutes();
            if (this.lastMinute !== currentMinute && currentMinute !== 0) {
                this.lastMinute = currentMinute;
                this.writeToCSV();
                this.calculateSupertrendFromCSV();
            }
            this.candlestickGateway.server.emit('candlestickData', processedData);
            this.saveCandlestickData(processedData);
        });
        this.ws.on('close', () => {
            console.log('WebSocket disconnected');
            setTimeout(() => {
                this.startFetchingData();
            }, 1000);
        });
        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error.message);
        });
        this.wps.on('open', () => {
            console.log('Price WebSocket connected');
        });
        this.wps.on('message', (data) => {
            const tradeData = JSON.parse(data);
            const processedData = {
                p: parseFloat(tradeData.p)
            };
            this.candlestickGateway.server.emit('livePrice', processedData);
        });
        this.wps.on('close', () => {
            console.log('Price WebSocket disconnected');
            setTimeout(() => {
                this.startFetchingData();
            }, 1000);
        });
        this.wps.on('error', (error) => {
            console.error('Price WebSocket error:', error.message);
        });
    }
    async writeToCSV() {
        if (this.candlesticks.length === 0) {
            return;
        }
        const lastMinuteData = this.candlesticks.filter(data => data.t.getMinutes() === this.lastMinute - 1);
        const lastCandlestick = lastMinuteData[lastMinuteData.length - 1];
        if (!lastCandlestick) {
            return;
        }
        const newRow = `${new Date(lastCandlestick.t)},${lastCandlestick.o},${lastCandlestick.h},${lastCandlestick.l},${lastCandlestick.c}\n`;
        try {
            fs.appendFileSync('signals.csv', newRow);
            this.recordedData.push({
                t: new Date(lastCandlestick.t),
                o: lastCandlestick.o,
                h: lastCandlestick.h,
                l: lastCandlestick.l,
                c: lastCandlestick.c
            });
            this.candlestickGateway.server.emit('newCandle', this.recordedData);
        }
        catch (error) {
            console.error('Error writing to CSV:', error);
        }
    }
    async calculateSupertrendFromCSV() {
        this.getSupertrend();
    }
    readCSV() {
        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(this.csvFilePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                resolve(results.map(data => ({
                    t: new Date(data.Time),
                    o: parseFloat(data.Open),
                    h: parseFloat(data.High),
                    l: parseFloat(data.Low),
                    c: parseFloat(data.Close)
                })));
            })
                .on('error', (error) => reject(error));
        });
    }
    calculateSupertrend(data, period = 10, multiplier = 3) {
        const df = data.map(d => ({
            time: new Date(d.t),
            open: d.o,
            high: d.h,
            low: d.l,
            close: d.c,
        }));
        const tr = df.map((d, i) => {
            if (i === 0)
                return 0;
            const highLow = d.high - d.low;
            const highClose = Math.abs(d.high - df[i - 1].close);
            const lowClose = Math.abs(d.low - df[i - 1].close);
            return Math.max(highLow, highClose, lowClose);
        });
        const atr = tr.map((_, i) => {
            if (i < period - 1)
                return 0;
            const sum = tr.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            return sum / period;
        });
        const upperband = [];
        const lowerband = [];
        const inUptrend = new Array(df.length).fill(true);
        for (let i = 0; i < df.length; i++) {
            const middleBand = (df[i].high + df[i].low) / 2;
            upperband.push(middleBand + multiplier * atr[i]);
            lowerband.push(middleBand - multiplier * atr[i]);
            if (i === 0)
                continue;
            if (df[i].close > upperband[i - 1]) {
                inUptrend[i] = true;
            }
            else if (df[i].close < lowerband[i - 1]) {
                inUptrend[i] = false;
            }
            else {
                inUptrend[i] = inUptrend[i - 1];
                if (inUptrend[i]) {
                    lowerband[i] = Math.max(lowerband[i], lowerband[i - 1]);
                }
                else {
                    upperband[i] = Math.min(upperband[i], upperband[i - 1]);
                }
            }
        }
        const supertrend = inUptrend.map((trend, i) => (trend ? lowerband[i] : upperband[i]));
        return { supertrend, inUptrend };
    }
    async getSupertrend() {
        const data = await this.recordedData;
        const { inUptrend } = this.calculateSupertrend(data);
        const signals = [];
        const dbsignals = [];
        for (let i = 1; i < inUptrend.length; i++) {
            if (inUptrend[i] && !inUptrend[i - 1]) {
                const newSignal = { signal: 'Buy', open_time: new Date(data[i].t), low: data[i].l, signal_time: Date.now() };
                if (!this.lastSignal || this.lastSignal.type !== newSignal.signal || this.lastSignal.date !== newSignal.open_time) {
                    this.lastSignal = newSignal;
                    signals.push(newSignal);
                    dbsignals.push(newSignal);
                }
            }
            else if (!inUptrend[i] && inUptrend[i - 1]) {
                const newSignal = { signal: 'Sell', open_time: new Date(data[i].t), high: data[i].h, signal_time: Date.now() };
                if (!this.lastSignal || this.lastSignal.type !== newSignal.signal || this.lastSignal.date !== newSignal.open_time) {
                    this.lastSignal = newSignal;
                    signals.push(newSignal);
                    dbsignals.push(newSignal);
                }
            }
        }
        if (dbsignals.length > 0) {
            if (dbsignals.length >= 2) {
                const first = dbsignals[dbsignals.length - 2];
                const second = dbsignals[dbsignals.length - 1];
                if (first.signal == "Sell") {
                    const profit = first.high - second.low;
                    second.profit_or_loss = profit;
                }
                if (first.signal == "Buy") {
                    const profit = second.high - first.low;
                    second.profit_or_loss = profit;
                }
                await this.saveSignalData(dbsignals);
            }
            else {
                await this.saveSignalData(dbsignals);
            }
        }
        this.candlestickGateway.server.emit('signals', signals);
        return signals;
    }
    async saveCandlestickData(data) {
        try {
            if (!this.dbClient) {
                throw new Error('Database client is not initialized');
            }
            const db = this.dbClient.db('trading_data');
            const collection = db.collection('candlestick_data');
            await collection.insertOne(data);
        }
        catch (error) {
        }
    }
    async saveSignalData(data) {
        try {
            if (!this.dbClient) {
            }
            const db = this.dbClient.db('trading_data');
            const collection = db.collection('signals');
            for (const signal of data) {
                const existingSignal = await collection.findOne({ open_time: signal.open_time });
                if (!existingSignal) {
                    await collection.insertOne(signal);
                    const signal_type = (signal.signal).toUpperCase();
                    try {
                        const avbl = this.binanceService.showbalances();
                        if (signal_type !== "SELL" || this.signal_count >= 1) {
                            const orderResponse = this.binanceService.placeFullBalanceOrder("BTCUSDT", signal_type);
                            console.log('Order placed successfully:', orderResponse);
                            this.signal_count++;
                        }
                    }
                    catch (error) {
                        console.error('Error placing order:', error);
                    }
                }
                else {
                }
            }
        }
        catch (error) {
        }
    }
};
exports.CandlestickService = CandlestickService;
exports.CandlestickService = CandlestickService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_provider_1.DatabaseService,
        candlestick_gateway_1.CandlestickGateway,
        binance_service_1.BinanceService])
], CandlestickService);
//# sourceMappingURL=candlestick.service.js.map