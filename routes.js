const express = require('express');
const app = express();

app.use(express.json());

const items = require('./fakeDb');

app.get('/items', (req, res) => {
    res.json(items);
});

app.post('/items', (req, res) => {
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    res.status(201).json({ added: newItem });
});

app.get('/items/:name', (req, res) => {
    const item = items.find(i => i.name === req.params.name);
    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
});

app.patch('/items/:name', (req, res) => {
    const { name } = req.params;
    const { name: newName, price: newPrice } = req.body;
    const item = items.find(i => i.name === name);
    if (item) {
        item.name = newName || item.name;
        item.price = newPrice || item.price;
        res.json({ updated: item });
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

app.delete('/items/:name', (req, res) => {
    const { name } = req.params;
    const index = items.findIndex(i => i.name === name);
    if (index !== -1) {
        items.splice(index, 1);
        res.json({ message: 'Deleted' });
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

module.exports = app;