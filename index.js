const express = require("express")
const app = express()
const port = 3000
app.use(express.json())
const uuid = require("uuid")


const orders = []

//Middlewares********************************************
const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Order not found" })
    }
    request.orderIndex = index
    request.orderId = id

    next()
}

const checkMethod = (request, response, next) => {
    console.log(`Método da requisição: ${request.method} url: ${request.url}`)

    next()
}
//FIM Middlewares*****************************************

//Rota GET **********************************************
app.get('/order', checkMethod, (request, response) => {
    return response.json(orders)
})
//FIM ROTA GET ******************************************

//Rota POST **********************************************
app.post('/order', checkMethod, (request, response) => {
    const { order, clientName, price, status } = request.body
    const newOrder = { id: uuid.v4(), order, clientName, price, status }
    orders.push(newOrder)
    return response.status(201).json(newOrder)
})
//FIM ROTA POST ******************************************

//Rota PUT **********************************************
app.put('/order/:id', checkOrderId, checkMethod, (request, response) => {
    
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId
    const updateOrder = { id, order, clientName, price, status }
    
    orders[index] = updateOrder
    return response.json(updateOrder)
})
//FIM ROTA PUT ******************************************

//Rota DELETE **********************************************
app.delete('/order/:id', checkOrderId, checkMethod, (request, response) => {
    const index = request.orderIndex
    orders.splice(index, 1)

    return response.status(204).json()
})
//FIM ROTA DELETE ******************************************

//Rota PATCH **********************************************
app.patch('/order/:id', checkOrderId, checkMethod, (request, response) => {
    const {order, clientName, price, status} = request.body
    
    const index = request.orderIndex
    const id = request.orderId

    const updatedStatus = {id, order:orders[index].order, clientName:orders[index].clientName, price:orders[index].price, status:"Pronto"}
    

    orders[index] = updatedStatus

    return response.json(updatedStatus)
})
//FIM ROTA PATCH ******************************************




app.listen(port, () => {
    console.log(`🛜   Server started on port ${port}`)
})