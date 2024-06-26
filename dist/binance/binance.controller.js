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
exports.BinanceController = void 0;
const common_1 = require("@nestjs/common");
const binance_service_1 = require("./binance.service");
let BinanceController = class BinanceController {
    constructor(binanceService) {
        this.binanceService = binanceService;
    }
    async placeOrder() {
        try {
        }
        catch (error) {
            console.error('Error placing order:', error);
        }
    }
    async placeFullBalanceOrder() {
        try {
        }
        catch (error) {
        }
    }
    async fetchBalances() {
        return this.binanceService.getUSDTBalances();
    }
    async showBalances() {
        return this.binanceService.showbalances();
    }
};
exports.BinanceController = BinanceController;
__decorate([
    (0, common_1.Post)('place-order'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BinanceController.prototype, "placeOrder", null);
__decorate([
    (0, common_1.Post)('place-full-balance-order'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BinanceController.prototype, "placeFullBalanceOrder", null);
__decorate([
    (0, common_1.Get)('balances'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BinanceController.prototype, "fetchBalances", null);
__decorate([
    (0, common_1.Get)('show-balances'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BinanceController.prototype, "showBalances", null);
exports.BinanceController = BinanceController = __decorate([
    (0, common_1.Controller)('binance'),
    __metadata("design:paramtypes", [binance_service_1.BinanceService])
], BinanceController);
//# sourceMappingURL=binance.controller.js.map