import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all skills' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create skill' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get skill ${req.params.id}` });
});

export default router;