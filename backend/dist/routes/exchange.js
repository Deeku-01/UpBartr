"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ message: 'Get exchanges' });
});
router.post('/', (req, res) => {
    res.json({ message: 'Create exchange request' });
});
router.put('/:id', (req, res) => {
    res.json({ message: `Update exchange ${req.params.id}` });
});
exports.default = router;
