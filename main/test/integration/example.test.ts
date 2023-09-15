import app from '../../src/app'; // Replace with the correct import path to your Express app
import request from 'supertest';

describe('GET /historical-balances', () => {
  it('should return a 200 status code and an array of historical balances', async () => {
    const response = await request(app).get('/historical-balances');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect((response.body as any[]).length).toBeGreaterThan(0); // Check if it's not an empty array
  });

  it('should return an empty array when "outofdate" is provided as a query parameter', async () => {
    const response = await request(app)
      .get('/historical-balances')
      .query({ from: 'outofdate', to: 'outofdate' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect((response.body as any[]).length).toBe(0); // Check if it's an empty array
  });

  it('should return data within the specified date range', async () => {
    // Define the date range for the query
    const fromDate = '2023-01-01';
    const toDate = '2023-12-31';

    const response = await request(app)
      .get('/historical-balances')
      .query({ from: fromDate, to: toDate });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // Check if all returned records are within the specified date range
    const allDatesWithinRange = response.body.every((record: any) => {
      const recordDate = new Date(record.date);
      return recordDate >= new Date(fromDate) && recordDate <= new Date(toDate);
    });
    
    expect(allDatesWithinRange).toBe(true);
  });

  it('should return transactions in ascending order when "asc" is provided as a query parameter', async () => {
    // Send a request with "asc" query parameter
    const response = await request(app)
      .get('/historical-balances')
      .query({ sort: 'asc' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // Check if transactions are ordered in ascending order
    const isAscendingOrder = isSortedAscending(response.body, 'date');
    expect(isAscendingOrder).toBe(true);
  });

  it('should return transactions in descending order when "desc" is provided as a query parameter', async () => {
    // Send a request with "desc" query parameter
    const response = await request(app)
      .get('/historical-balances')
      .query({ sort: 'desc' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // Check if transactions are ordered in descending order
    const isDescendingOrder = isSortedDescending(response.body, 'date');
    expect(isDescendingOrder).toBe(true);
  });

  // Add more test cases as needed
});

// Helper function to check if an array of objects is sorted in ascending order
function isSortedAscending(arr: any[], prop: string) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i][prop] < arr[i - 1][prop]) {
      return false;
    }
  }
  return true;
}

// Helper function to check if an array of objects is sorted in descending order
function isSortedDescending(arr: any[], prop: string) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i][prop] > arr[i - 1][prop]) {
      return false;
    }
  }
  return true;
}

