const request = require('supertest');
const app = require('./app');
const items = require('./fakeDb');

beforeEach(() => {
  // Clear the items array before each test
  items.length = 0;
});

describe('GET /items', () => {
  test('It should respond with an array of items', async () => {
    const testItem = { name: 'popsicle', price: 1.45 };
    items.push(testItem);
    
    const response = await request(app).get('/items');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([testItem]);
  });
});

describe('POST /items', () => {
  test('It should add an item', async () => {
    const newItem = { name: 'cheerios', price: 3.40 };
    
    const response = await request(app)
      .post('/items')
      .send(newItem);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ added: newItem });
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual(newItem);
  });
});

describe('GET /items/:name', () => {
  test('It should return a single item', async () => {
    const testItem = { name: 'popsicle', price: 1.45 };
    items.push(testItem);
    
    const response = await request(app).get(`/items/${testItem.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(testItem);
  });

  test('It should return 404 for non-existent item', async () => {
    const response = await request(app).get('/items/nonexistent');
    expect(response.statusCode).toBe(404);
  });
});

describe('PATCH /items/:name', () => {
  test('It should update an item', async () => {
    const initialItem = { name: 'popsicle', price: 1.45 };
    items.push(initialItem);
    
    const updatedItem = { name: 'new popsicle', price: 2.45 };
    const response = await request(app)
      .patch(`/items/${initialItem.name}`)
      .send(updatedItem);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ updated: updatedItem });
    expect(items[0]).toEqual(updatedItem);
  });

  test('It should return 404 for non-existent item', async () => {
    const response = await request(app)
      .patch('/items/nonexistent')
      .send({ name: 'new name', price: 1.00 });
    expect(response.statusCode).toBe(404);
  });
});

describe('DELETE /items/:name', () => {
  test('It should delete an item', async () => {
    const testItem = { name: 'popsicle', price: 1.45 };
    items.push(testItem);
    
    const response = await request(app).delete(`/items/${testItem.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Deleted' });
    expect(items).toHaveLength(0);
  });

  test('It should return 404 for non-existent item', async () => {
    const response = await request(app).delete('/items/nonexistent');
    expect(response.statusCode).toBe(404);
  });
});