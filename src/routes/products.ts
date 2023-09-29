import express, { Request, Response } from 'express';
import Product from '../models/product';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const pageParam: any = req.query.page;
    const pageSizeParam: any = req.query.pageSize;

    const page = parseInt(pageParam, 10) || 1;
    const pageSize = parseInt(pageSizeParam, 10) || 5;

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / pageSize);

    const products = await Product.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      currentPage: page,
      totalPages: totalPages,
      products: products,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
});

// Get product
router.get('/filter/:id', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not foun' });
    }

    res.json(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
});

// Create a new product
router.post('/', async (req: Request, res: Response) => {
  const product = new Product(req.body);

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
});

// Update a product for id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const updatedProductData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, {
      new: true
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (updatedProductData.hasOwnProperty('price')) {
      updatedProduct.priceHistory.push({
        price: updatedProduct.price,
        date: new Date(),
      });
      updatedProduct.price = updatedProductData.price;
    }

    if (updatedProductData.hasOwnProperty('stock')) {
      updatedProduct.stockHistory.push({
        stock: updatedProduct.stock,
        date: new Date(),
      });
      updatedProduct.stock = updatedProductData.stock;
    }
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
});

// Delete a product for id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndRemove(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product disposed of correctly' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
});

//  Search and filter products by specific criteria
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { price, stock, name } = req.query;
    const filter: any = {};

    if (price) {
      const parsedPrice = parseFloat(price as string);
      if (!isNaN(parsedPrice)) {
        filter.price = { $lte: parsedPrice };
      } else {
        res.json([]);
        return;
      }
    }

    if (stock) {
      const parsedStock = parseFloat(stock as string);
      if (!isNaN(parsedStock)) {
        filter.stock = { $lte: parsedStock };
      } else {
        res.json([]);
        return;
      }
    }

    if (name) {
      filter.name = { $regex: name as string, $options: 'i' };
    } else {
      res.json([]);
      return;
    }

    const products = await Product.find(filter);

    res.json(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
});

export default router;
