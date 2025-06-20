import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get exchanges' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create exchange request' });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update exchange ${req.params.id}` });
});

export default router;