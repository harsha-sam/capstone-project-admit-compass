import express from 'express';
import bodyParser from 'body-parser';
import programRoutes from './routes/programRoutes';
import ruleSetRoutes from './routes/ruleSetRoutes';
import rubricRoutes from './routes/rubricRoute';

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api/programs', programRoutes);
app.use('/api/rubrics', rubricRoutes);
app.use('/api/rulesets', ruleSetRoutes);

app.get('/', (req, res) => {
  res.send('Hello, world ! from the admit compass');
});

export default app;
