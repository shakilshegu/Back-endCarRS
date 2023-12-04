
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

config(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary;
