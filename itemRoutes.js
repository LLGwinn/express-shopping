const express = require('express');
const router = new express.Router();
const ExpressError = require('./expressError');
const fakeDb = require('./fakeDb');


router.get('/', (req, res, next) => {
    let shoppingList = items;
    try {
        if (!shoppingList) throw new ExpressError('No shopping list found', 404);
        return res.json(shoppingList);
    } catch(err) {
        return next(err);
    }
})

router.post('/', (req, res, next) => {
    let itemName = req.body.name;
    let itemPrice = req.body.price;
    try {
        if (!itemName || !itemPrice) throw new ExpressError(
            'Item must have name and price', 404);
        items.push({'name':itemName, 'price':itemPrice});
        return res.json({'added': {'name':itemName, 'price':itemPrice}});
    } catch(err) {
        return next(err);
    }
})

router.get('/:name', (req, res, next) => {
    try {
        const item = items.find(i => i.name === req.params.name);
        if (!item) throw new ExpressError('Item not found', 404);
        return res.json(item);
    } catch(err) {
        return next(err);
    }
})

router.patch('/:name', (req, res, next) => {
    try {
        const item = items.find(i => i.name === req.params.name);
        if (!item) throw new ExpressError('Item not found', 404);
        item.name = req.body.name;
        item.price = req.body.price;
        return res.json({'updated': {'name':item.name, 'price':item.price}});
    } catch(err) {
        return next(err);
    }
})

router.delete('/:name', (req, res, next) => {
    try {
        const itemIndex = items.findIndex(i => i.name === req.params.name);
        if (itemIndex < 0) throw new ExpressError('Item not found', 404);
        items.splice(itemIndex, 1);
        return res.json({'message': "Deleted"})
    } catch(err) {
        return next(err);
    }
})

module.exports = router;