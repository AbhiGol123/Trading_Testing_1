"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlestickModule = void 0;
const common_1 = require("@nestjs/common");
const candlestick_service_1 = require("./candlestick.service");
const candlestick_gateway_1 = require("./candlestick.gateway");
const database_module_1 = require("../provider/database.module");
const binance_service_1 = require("../binance/binance.service");
const binance_module_1 = require("../binance/binance.module");
let CandlestickModule = class CandlestickModule {
};
exports.CandlestickModule = CandlestickModule;
exports.CandlestickModule = CandlestickModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            binance_module_1.BinanceModule,
        ],
        providers: [candlestick_service_1.CandlestickService, candlestick_gateway_1.CandlestickGateway, binance_service_1.BinanceService],
        exports: [candlestick_service_1.CandlestickService],
    })
], CandlestickModule);
//# sourceMappingURL=candlestick.module.js.map