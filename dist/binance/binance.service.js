"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BinanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
let BinanceService = BinanceService_1 = class BinanceService {
    constructor() {
        this.logger = new common_1.Logger(BinanceService_1.name);
        this.apiKey = process.env.BINANCE_API_KEY;
        this.apiSecret = process.env.BINANCE_API_SECRET;
        this.apiUrl = 'https://testnet.binancefuture.com/fapi/v1';
        this.last_balance = 0;
    }
    generateSignature(queryString) {
        return crypto
            .createHmac('sha256', this.apiSecret)
            .update(queryString)
            .digest('hex');
    }
    async getAccountInfo() {
        const timestamp = Date.now();
        const queryString = `timestamp=${timestamp}`;
        const signature = this.generateSignature(queryString);
        const url = `https://testnet.binancefuture.com/fapi/v2/account?${queryString}&signature=${signature}`;
        const headers = {
            'X-MBX-APIKEY': this.apiKey,
        };
        this.logger.debug(`Request URL: ${url}`);
        this.logger.debug(`Headers: ${JSON.stringify(headers)}`);
        try {
            const response = await axios_1.default.get(url, { headers });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error fetching account info: ${error.message}`);
            if (error.response) {
                this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
                this.logger.error(`Response status: ${error.response.status}`);
                this.logger.error(`Response headers: ${JSON.stringify(error.response.headers)}`);
            }
            throw new Error(`Error fetching account info: ${error.message}`);
        }
    }
    async getUSDTBalances() {
        const accountInfo = await this.getAccountInfo();
        const usdtBalance = accountInfo.assets.find(asset => asset.asset === 'USDT');
        this.balance = usdtBalance ? usdtBalance.walletBalance : '0';
        return this.balance;
    }
    async getCurrentBTCPrice() {
        const url = `${this.apiUrl}/ticker/price?symbol=BTCUSDT`;
        try {
            const response = await axios_1.default.get(url);
            return parseFloat(response.data.price);
        }
        catch (error) {
            this.logger.error(`Error fetching ETH price: ${error.message}`);
            throw new Error(`Error fetching ETH price: ${error.message}`);
        }
    }
    async showbalances() {
        this.balance = await this.getUSDTBalances();
        return this.balance;
    }
    async placeMarketOrder(symbol, side, quantity) {
        const timestamp = Date.now();
        const queryString = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${quantity.toFixed(3)}&timestamp=${timestamp}`;
        const signature = this.generateSignature(queryString);
        const url = `${this.apiUrl}/order?${queryString}&signature=${signature}`;
        const headers = {
            'X-MBX-APIKEY': this.apiKey,
        };
        try {
            const response = await axios_1.default.post(url, null, { headers });
            if (response.data.status === 'FILLED') {
                this.logger.debug(`Order filled successfully: ${JSON.stringify(response.data)}`);
            }
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error placing order: ${error.message}`);
            throw new Error(`Error placing order: ${error.message}`);
        }
    }
    async placeFullBalanceOrder(symbol, side) {
        if (side === "BUY") {
            const usdtBalance = await this.getUSDTBalances();
            const btcPrice = await this.getCurrentBTCPrice();
            const quantity = parseFloat(usdtBalance) / btcPrice;
            const roundedQuantity = (Math.floor(quantity * 1e6) / 1e6);
            this.last_balance = roundedQuantity;
            return this.placeMarketOrder(symbol, side, roundedQuantity);
        }
        else {
            return this.placeMarketOrder(symbol, side, this.last_balance);
        }
    }
};
exports.BinanceService = BinanceService;
exports.BinanceService = BinanceService = BinanceService_1 = __decorate([
    (0, common_1.Injectable)()
], BinanceService);
//# sourceMappingURL=binance.service.js.map