const request = require('supertest');
const app = require('../app');
const fs = require('fs');

test('Should return 200 status for all orders', async () => {
    const response = await request(app).get('/orders');
    expect(response.statusCode).toBe(200);
});

test('Can get all orders', async () => {
    let expectedResult = JSON.stringify(JSON.parse(fs.readFileSync('../data/orders.json', 'utf8')))

    const response = await request(app).get('/orders')
    expect(response.text).toBe(expectedResult);
})

test('Can get all orders by customer', async () => {
    let expectedResult = {}
    
    Object.values(JSON.parse(fs.readFileSync('../data/orders.json', 'utf8')))
        .filter(order => order.customer.id === "0")
        .forEach((customerOrder, idx) => expectedResult[`${idx}`] = customerOrder)

    const response = await request(app).get('/orders/byCustomer/0')
    expect(JSON.parse(response.text)).toStrictEqual(expectedResult);
})

test('Create an order', async() => {
    const body = {
        "customerId": "1",
        "items": {
            "4": 2,
            "0": 2
        }
    };
    const currentNumberOfOrders = Object.keys(JSON.parse(fs.readFileSync('../data/orders.json', 'utf8'))).length
    await request(app).post('/orders').send(body)

    const updatedNumberOfOrders = Object.keys(JSON.parse(fs.readFileSync('../data/orders.json', 'utf8'))).length

    expect(updatedNumberOfOrders).toBe(currentNumberOfOrders+1);
});

test('Update an order', async() => {
    const body = {
        "customerId": "2",
        "items": {
            "4": 2,
            "0": 2
        }
    };
    const currentOrderNumbers = Object.keys(JSON.parse(fs.readFileSync('../data/orders.json', 'utf8')))
    const mostRecentOrderNumber = currentOrderNumbers[currentOrderNumbers.length - 1]

    await request(app).put(`/orders/${mostRecentOrderNumber}`).send(body)

    const allOrders = Object.values(JSON.parse(fs.readFileSync('../data/orders.json', 'utf8')))
    const mostRecentOrder = allOrders[allOrders.length - 1]

    expect(mostRecentOrder.customer.firstName).toBe("Steve");
});

test('Cancel an order', async() => {
    const body = {
        "customerId": "2",
        "items": {
            "4": 2,
            "0": 2
        }
    };
    const currentOrderNumbers = Object.keys(JSON.parse(fs.readFileSync('../data/orders.json', 'utf8')))
    const mostRecentOrderNumber = currentOrderNumbers[currentOrderNumbers.length - 1]
    
    await request(app).delete(`/orders/${mostRecentOrderNumber}`).send(body)

    const allOrders = Object.values(JSON.parse(fs.readFileSync('../data/orders.json', 'utf8')))
    const mostRecentOrder = allOrders[allOrders.length - 1]

    expect(mostRecentOrder.status).toBe("Cancelled");
});