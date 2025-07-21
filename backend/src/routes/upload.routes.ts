import express, { Request, Response } from 'express';
import upload from '../config/cloudinary'; // Use Cloudinary upload config

const router = express.Router();

router.post('/', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  res.status(200).json({
    message: 'Image uploaded to Cloudinary successfully',
    imageUrl: (req.file as any).path,
    public_id: (req.file as any).filename,
  });
});


export default router;
