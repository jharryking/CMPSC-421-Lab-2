const express = require('express');
const Order = require('../models/order');
const router = express.Router();


/**
 * @swagger
 *  components:
 *      schemas:
 *          Order:
 *              type: object
 *              properties:
 *                  productName:
 *                      type: string
 *                      minlength: 5,
 *                      maxlength: 60
 *                      description: The product's name
 *                  productPrice:
 *                      type: number
 *                      description: Price of the product
 *                      min: 0
 *                  productQuantity:
 *                      type: integer
 *                      min: 1
 *                      description: Quantity of product
 *  
 */

/**
 * @swagger
 * /api/orders/{orderId}:
 *      delete:
 *          summary: Delete order with given id
 *          parameters:
 *              - in: path
 *                name: orderId
 *          responses:
 *              200:
 *                  description: Order with given id was deleted
 *              404:
 *                  description: Order was not found
 */

router.delete('/:id', async(req, res) => {
    try
    {
        const result = await Order.deleteOne({_id: req.params.id});
        return res.send(`Order with id ${req.params.id} deleted`);
    }
    catch(ex){
        let errStr = `The order with id ${req.params.id} was not found`;
        return res.status(404).send(errStr);
    }
});

/**
 * @swagger
 * /api/orders/complete/{orderId}:
 *      put:
 *          summary: Completes the order
 *          parameters:
 *              - in: path
 *                name: orderId
 *          responses:
 *              200:
 *                  description: Order was completed
 *              400:
 *                  description: Order was already completed, or order was canceled
 *              404:
 *                  description: Order was not found
 */

router.put('/complete/:id', async(req, res) => {
    try{
        let order = await Order.findById(req.params.id);
        if (order.completed){
            return res.status(400).send('Order already completed');
        }
        if (order.canceled){
            return res.status(400).send('Order is canceled, cannot compelete');
        }


        //simulate transaction logic
        setTimeout( async function() {
            order.completed = true;
            order.completionDate = Date.now();    
            order = await order.save();
            console.log('Transaction compelete!')
            return res.send(order);    
        }, 5000)
        
    }
    catch(ex){
        let errStr = `The order with id ${req.params.id} was not found`;
        return res.status(404).send(errStr);
    }
});

/**
 * @swagger
 * /api/orders/cancel/{orderId}:
 *      put:
 *          summary: cancels the order
 *          parameters:
 *              - in: path
 *                name: orderId
 *          responses:
 *              200:
 *                  description: Order was canceled
 *              400:
 *                  description: Order was already completed, or order was canceled
 *              404:
 *                  description: Order was not found
 */

router.put('/cancel/:id', async(req,res) => {
    try{
        let order = await Order.findById(req.params.id);
        if (order.completed){
            return res.status(400).send('Order already completed');
        }
        if (order.canceled){
            return res.status(400).send('Order is canceled, cannot compelete');
        }        
        order.canceled = true;
        order.completionDate = Date.now();
        order = await order.save();
        return res.send(order);
    }
    catch(ex){
        let errStr = `The order with id ${req.params.id} was not found`;
        return res.status(404).send(errStr);
    }
});


/**
 * @swagger
 * /api/orders/{orderId}:
 *      get:
 *          summary: Retrieve order with given id
 *          parameters:
 *              - in: path
 *                name: orderId
 *          responses:
 *              200:
 *                  description: Order with given id
 *              404:
 *                  description: Order was not found 
 */

router.get('/:id', async (req, res) => {
    try{
        const order = await Order.findById(req.params.id);
        return res.send(order);
    }
    catch(ex){
        let errStr = `The order with id ${req.params.id} was not found`;
        return res.status(404).send(errStr);
    }
});



/**
 * @swagger
 * /api/orders:
 *      post:
 *          summary: Create a new order
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Order'
 *          responses:
 *              200:
 *                  description: Created Order
 *              400:
 *                  description: Unsuccessful order creation 
 */

router.post('/', async (req, res) => {
    try{
        let order = new Order(req.body);
        order = await order.save();
        return res.send(order);
    }
    catch(ex){
        let errStr = "";
        for (field in ex.errors){
            errStr += (ex.errors[field].message) + "\n";
        }
        return res.status(400).send(errStr);
    }
});

module.exports = router;