process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('./app');
let items = require('./fakeDb');

beforeEach(function() {
    items.push({'name':'flan', 'price':4.99});
})

afterEach(function() {
    items.length = 0;
})

describe('GET /items', () => {
    test ('Get all shopping list items', async() => {
        const res = await request(app).get('/items');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{'name':'flan', 'price':4.99}]);
    })
    test('Return empty list if no items', async() => {
        items.length = 0;
        const res = await request(app).get('/items');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);

    })
})

describe('POST /items', () => {
    test ('Add new item to shopping list', async() => {
        const res = await request(app).post('/items')
                .send({'name':'grapes', 'price':2.49});

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({'added': {'name':'grapes', 'price':2.49}});
        expect(items).toContainEqual({'name':'grapes', 'price':2.49});
    })
    test('404 error if name is not included', async() => {
        const res = await request(app).post('/items')
            .send({'price':2.49});

        expect(res.statusCode).toBe(404);
    })
    test('404 error if price is not included', async() => {
        const res = await request(app).post('/items')
            .send({'name':'beans'});

        expect(res.statusCode).toBe(404);
    })
})

describe('GET /items/:name', () => {
    test ('Shows given item name and price', async() => {
        const res = await request(app).get('/items/flan');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({'name':'flan', 'price':4.99});
    })
    test('404 error if item not found', async() => {
        const res = await request(app).get('/items/wine');

        expect(res.statusCode).toBe(404);
    })
})

describe('PATCH /items/:name', () => {
    test ('Updates given item name and/or price', async() => {
        const res = await request(app).patch('/items/flan')
            .send({'name':'newFlan', 'price':9.99});

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({'updated': {'name':'newFlan','price':9.99}});
        expect(items).toContainEqual({'name':'newFlan', 'price':9.99});
    })
    test('404 error if item not found', async() => {
        const res = await request(app).patch('/items/cheetos')
            .send({'name':'newFlan', 'price':9.99});

        expect(res.statusCode).toBe(404);
    })
})

describe('DELETE /items/:name', () => {
    test('Deletes given item from shopping list', async() => {
        const res = await request(app).delete('/items/flan');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({'message': 'Deleted'});
        expect(items).toEqual([]);
    })
    test('404 error if item not found', async() => {
        const res = await request(app).delete('/items/cheetos');

        expect(res.statusCode).toBe(404);
    })
})