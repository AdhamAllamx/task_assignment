"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
app_1.default.listen(process.env.PORT, () => {
    console.log(`🚀 Server started on port ${process.env.PORT}!`);
    console.log(`📚 API docs are available on: http://localhost:${process.env.PORT}/api-docs`);
});
