/* eslint-disable */
import express from 'express';
import router from './routes/index';

const app = express();

router(app);


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
