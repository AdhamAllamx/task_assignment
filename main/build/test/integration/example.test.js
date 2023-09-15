"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../../src/app")); // Replace with the correct import path to your Express app
const supertest_1 = __importDefault(require("supertest"));
describe('GET /historical-balances', () => {
    it('should return a 200 status code and an array of historical balances', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/historical-balances');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0); // Check if it's not an empty array
    }));
    it('should return an empty array when "outofdate" is provided as a query parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/historical-balances')
            .query({ from: 'outofdate', to: 'outofdate' });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0); // Check if it's an empty array
    }));
    it('should return data within the specified date range', () => __awaiter(void 0, void 0, void 0, function* () {
        // Define the date range for the query
        const fromDate = '2023-01-01';
        const toDate = '2023-12-31';
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/historical-balances')
            .query({ from: fromDate, to: toDate });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // Check if all returned records are within the specified date range
        const allDatesWithinRange = response.body.every((record) => {
            const recordDate = new Date(record.date);
            return recordDate >= new Date(fromDate) && recordDate <= new Date(toDate);
        });
        expect(allDatesWithinRange).toBe(true);
    }));
    it('should return transactions in ascending order when "asc" is provided as a query parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        // Send a request with "asc" query parameter
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/historical-balances')
            .query({ sort: 'asc' });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // Check if transactions are ordered in ascending order
        const isAscendingOrder = isSortedAscending(response.body, 'date');
        expect(isAscendingOrder).toBe(true);
    }));
    it('should return transactions in descending order when "desc" is provided as a query parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        // Send a request with "desc" query parameter
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/historical-balances')
            .query({ sort: 'desc' });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // Check if transactions are ordered in descending order
        const isDescendingOrder = isSortedDescending(response.body, 'date');
        expect(isDescendingOrder).toBe(true);
    }));
    // Add more test cases as needed
});
// Helper function to check if an array of objects is sorted in ascending order
function isSortedAscending(arr, prop) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i][prop] < arr[i - 1][prop]) {
            return false;
        }
    }
    return true;
}
// Helper function to check if an array of objects is sorted in descending order
function isSortedDescending(arr, prop) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i][prop] > arr[i - 1][prop]) {
            return false;
        }
    }
    return true;
}
