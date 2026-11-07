const express = require('express');
const app = express();
const port = 3000;

const logger = require('./middleware/logger');

app.use(express.json());
app.use(logger);
app.use('/tasks', require('./routes/taskRoutes'));

app.use((req, res) => {
  res.status(404).json({ basarili: false, error: 'Route Bulunamadi' });
});

app.use((err, req, res, next) => {
    if(err.type === 'entity.parse.failed') {
        return res.status(400).json({ basarili: false, error: 'gecersiz JSON' });
    }
    res.status(500).json({ basarili: false, error: 'Sunucu Hatası' });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});