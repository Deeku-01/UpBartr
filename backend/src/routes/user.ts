import { Router } from 'express';

const router = Router();

router.get('/profile', (req, res) => {
  res.json({ message: 'User profile endpoint' });
});

router.put('/profile', (req, res) => {
  res.json({ message: 'Update profile endpoint' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id}` });
});

export default router;