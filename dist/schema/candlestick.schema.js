"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlestickSchema = void 0;
const mongoose = require("mongoose");
exports.CandlestickSchema = new mongoose.Schema({
    t: Date,
    o: Number,
    h: Number,
    l: Number,
    c: Number,
});
//# sourceMappingURL=candlestick.schema.js.map