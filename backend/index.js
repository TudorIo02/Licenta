const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Încarcă fișierele de configurare și variabilele de mediu

const app = express();
const port = process.env.PORT || 5001;

app.use(cors()); // Permite cereri de la frontend
app.use(express.json()); // Permite procesarea datelor JSON

// Rute pentru test
app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

// Start server
app.listen(port, () => {
  console.log(`Serverul rulează pe portul ${port}`);
});