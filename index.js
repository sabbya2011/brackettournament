const app = require('./server/server');

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log('Listening');
});
