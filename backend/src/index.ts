import app from './app';

const { NODE_ENV, HOST, PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});