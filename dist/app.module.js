"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const candlestick_service_1 = require("./candlestick/candlestick.service");
const candlestick_gateway_1 = require("./candlestick/candlestick.gateway");
const candlestick_module_1 = require("./candlestick/candlestick.module");
const database_provider_1 = require("./provider/database.provider");
const database_module_1 = require("./provider/database.module");
const binance_module_1 = require("./binance/binance.module");
const binance_service_1 = require("./binance/binance.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            mongoose_1.MongooseModule.forRoot('mongodb+srv://abhi:9737477559@cluster0.vigx0aq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
            }),
            candlestick_module_1.CandlestickModule,
            database_module_1.DatabaseModule,
            binance_module_1.BinanceModule,
            config_1.ConfigModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, candlestick_service_1.CandlestickService, candlestick_gateway_1.CandlestickGateway, database_provider_1.DatabaseService, binance_service_1.BinanceService],
        exports: [database_provider_1.DatabaseService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map