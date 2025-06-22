"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ message: 'Get all skills' });
});
router.post('/', (req, res) => {
    res.json({ message: 'Create skill' });
});
router.get('/:id', (req, res) => {
    res.json({ message: `Get skill ${req.params.id}` });
});
exports.default = router;
