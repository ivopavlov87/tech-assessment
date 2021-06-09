const express = require('express');
const app = express();
const itemsInventory = require("../data/items.json")
const customers = require("../data/customers.json")
const fs = require('fs')
const jsonReader = require("./jsonReader")

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/orders', (req, res) => {
  jsonReader('../data/orders.json', (err, ordersDB) => {
    if (err) {
      console.log('Error reading file:',err)
      return
    }
    
    res.send(ordersDB)
  })
})

app.get('/orders/byCustomer/:id', (req, res) => {
  console.log(req)
  jsonReader('../data/orders.json', (err, ordersDB) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }

    const filteredOrders = {}
    
    for (const [orderId, order] of Object.entries(ordersDB)) {
      if (order.customer.id === req.params.id) {
        filteredOrders[orderId] = order
      }
    }

    res.send(filteredOrders)
  })
})

app.post('/orders', (req, res) => {
  jsonReader('../data/orders.json', (err, ordersDB) => {
    if (err) {
        console.log('Error reading file:',err)
        return
    }

    const order = req.body
    const customer = Object.values(customers).find(customer => customer.id === order.customerId)
    const itemsDesired = order.items

    const itemsOrdered = {
      items: {}
    }

    for (const [itemBarcode, quantity] of Object.entries(itemsDesired)) {
      const itemToAdd = Object.values(itemsInventory).find(itemRecords => itemRecords.id === itemBarcode)
      const dataRow = {
        ...itemToAdd,
        quantity,
        cost: `$${(quantity * itemToAdd.price).toFixed(2)}`
      }

      const itemNumber = (Object.keys(itemsOrdered.items).length).toString()
      itemsOrdered.items[itemNumber] = dataRow
    }

    let finalCost = 0
    Object.values(itemsOrdered.items).forEach(item => (finalCost += item.price * item.quantity))

    const finalOrderInfo = {
      customer,
      ...itemsOrdered,
      status: "initiated",
      finalCost: `$${finalCost.toFixed(2)}`
    }

    const orderNumber = Object.keys(ordersDB).length.toString()

    const orderEntry = {}
    orderEntry[orderNumber] = finalOrderInfo

    fs.writeFile('../data/orders.json', JSON.stringify({...ordersDB, ...orderEntry}, null, 2), (err) => {
      if (err) console.log('Error writing file:', err)
    })

    res.send("order placed")
  })
})

app.put('/orders/:id', (req, res) => {
  jsonReader('../data/orders.json', (err, ordersDB) => {
    if (err) {
      console.log('Error reading file:',err)
      return
    }

    const order = req.body
    const customer = Object.values(customers).find(customer => customer.id === order.customerId)
    const itemsDesired = order.items

    const itemsOrdered = {
      items: {}
    }

    for (const [itemBarcode, quantity] of Object.entries(itemsDesired)) {
      const itemToAdd = Object.values(itemsInventory).find(itemRecords => itemRecords.id === itemBarcode)
      const dataRow = {
        ...itemToAdd,
        quantity,
        cost: `$${(quantity * itemToAdd.price).toFixed(2)}`
      }

      const itemNumber = (Object.keys(itemsOrdered.items).length).toString()
      itemsOrdered.items[itemNumber] = dataRow
    }

    let finalCost = 0
    Object.values(itemsOrdered.items).forEach(item => (finalCost += item.price * item.quantity))
    
    const finalOrderInfo = {
      customer,
      ...itemsOrdered,
      status: order.status,
      finalCost: `$${finalCost.toFixed(2)}`
    }

    const orderEntry = {}
    orderEntry[req.params.id] = finalOrderInfo

    fs.writeFile('../data/orders.json', JSON.stringify({...ordersDB, ...orderEntry}, null, 2), (err) => {
      if (err) console.log('Error writing file:', err)
    })

    res.send("order updated")
  })
})

app.delete('/orders/:id', (req, res) => {
  jsonReader('../data/orders.json', (err, ordersDB) => {
    if (err) {
      console.log('Error reading file:',err)
      return
    }

    const orderToCancel = ordersDB[req.params.id]
    orderToCancel.status = "Cancelled"

    fs.writeFile('../data/orders.json', JSON.stringify(ordersDB, null, 2), (err) => {
      if (err) console.log('Error writing file:', err)
    })

    res.send("order cancelled")
  })
})

app.get('/customers', (req, res) => {
  jsonReader('../data/customers.json', (err, customers) => {
    if (err) {
      console.log('Error reading file:',err)
      return
    }

    res.send(customers)
  })
});

module.exports = app;