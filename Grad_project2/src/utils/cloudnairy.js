import  cloudinary from 'cloudinary';
import { config } from 'dotenv';
 config()         
cloudinary.config({ 
  cloud_name:'dbw7tvxxl', 
  api_key:'166793654189678', 
  api_secret:"LjBcvTsu1XK2QMFpeO7NFmxy5ak"
});


export default cloudinary.v2