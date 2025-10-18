import { Router, Request, Response } from 'express';
import { getAIMetricsSummary } from '../utils/monitoring';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;
    const summary = await getAIMetricsSummary(userId);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch metrics' });
  }
});

export default router;
