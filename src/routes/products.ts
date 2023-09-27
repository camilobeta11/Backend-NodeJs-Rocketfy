import express, { Request, Response } from 'express';
import Product from '../models/product';

const router = express.Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  });

export default router;
