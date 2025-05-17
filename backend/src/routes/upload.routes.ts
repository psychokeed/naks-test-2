import express, { Request } from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Setup Multer disk storage
const storage = multer.diskStorage({
  destination(_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'uploads/');
  },
  filename(_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload endpoint
router.post('/', upload.single('image'), (req: Request & { file?: Express.Multer.File }, res) => {
  res.status(200).json({ imageUrl: `/uploads/${req.file?.filename}` });
});

export default router;
