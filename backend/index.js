const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const taskRoutes = require('./routes/task.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', taskRoutes);

sequelize.sync().then(() => {
  app.listen(5000, () => console.log('Backend running on port 5000'));
}).catch(err => console.log(err));
