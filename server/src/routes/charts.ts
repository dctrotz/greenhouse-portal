import { Router, Request, Response } from 'express';
import { GreenhouseDatabase } from '../db/database';

export function createChartsRouter(db: GreenhouseDatabase): Router {
  const router = Router();

  router.get('/day/:date', (req: Request, res: Response) => {
    try {
      // Date format: YYYY-MM-DD
      // Parse as UTC to avoid timezone issues - the date string represents a calendar date, not a moment in time
      const dateStr = req.params.date;
      const date = new Date(dateStr + 'T00:00:00Z');
      
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      }

      const data = db.getChartDataForDay(date);
      res.json(data);
    } catch (error) {
      console.error('Error fetching chart data for day:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/month/:year/:month', (req: Request, res: Response) => {
    try {
      const year = parseInt(req.params.year, 10);
      const month = parseInt(req.params.month, 10);
      
      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: 'Invalid year or month' });
      }

      const data = db.getChartDataForMonth(year, month);
      res.json(data);
    } catch (error) {
      console.error('Error fetching chart data for month:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/year/:year', (req: Request, res: Response) => {
    try {
      const year = parseInt(req.params.year, 10);
      
      if (isNaN(year)) {
        return res.status(400).json({ error: 'Invalid year' });
      }

      const data = db.getChartDataForYear(year);
      res.json(data);
    } catch (error) {
      console.error('Error fetching chart data for year:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}

