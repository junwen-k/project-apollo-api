import '@tensorflow/tfjs-node';

import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import { PrismaClient } from '@prisma/client';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import translate from '@vitalets/google-translate-api';

import loadAndPredict from './model';

const prisma = new PrismaClient();

const { MODEL_FEEDBACK_CATEGORY_CLASSIFIER_URL, PORT = 3000 } = process.env;

const CATEGORY_MAP = ['insightful', 'non-insightful', 'low-quality'];

const app = express();

app.use(express.json());

app.get('/', (_, res) => {
  res.send('🚀 Apollo API');
});

app.post('/feedbacks', async (req, res) => {
  const { name, email, contactNo, product, rating, verbatim } = req.body;

  const translationResult = await translate(verbatim);

  const dataArray = await loadAndPredict(
    MODEL_FEEDBACK_CATEGORY_CLASSIFIER_URL,
    await (await use.load()).embed(translationResult.text) // Use translated text to support other languages...
  );

  let category = 'low-quality';
  if (dataArray) {
    // Find the index of the highest confidence score.
    const idx = Array.from(dataArray).indexOf(Math.max(...dataArray));
    category = CATEGORY_MAP[idx];
  }

  // TODO: implement priority ML

  const feedback = await prisma.feedback.create({
    data: {
      id: uuidv4(),
      name,
      email,
      contactNo,
      product,
      rating,
      verbatim,
      category,
    },
  });
  res.json(feedback);
});

app.get('/feedbacks', async (req, res) => {
  const { limit, offset, keyword, rating, product, category } = req.query;
  const feedbacks = await prisma.feedback.findMany({
    where: {
      category: category?.toString(),
      email: { contains: keyword?.toString() },
      name: { contains: keyword?.toString() },
      product: product?.toString(),
      rating: rating ? Number(rating) : undefined,
    },
    take: limit ? Number(limit) : undefined,
    skip: offset ? Number(offset) : undefined,
  });
  const count = await prisma.feedback.count();
  res.setHeader('X-Total-Count', count);
  res.json(feedbacks);
});

app.get('/feedbacks/:feedbackId', async (req, res) => {
  const { feedbackId } = req.params;
  const feedback = await prisma.feedback.findUnique({
    where: { id: feedbackId },
  });
  res.json(feedback);
});

app.put('/feedbacks/:feedbackId', async (req, res) => {
  const { name, email, contactNo, product, rating, verbatim } = req.body;
  const { feedbackId } = req.params;
  const feedback = await prisma.feedback.update({
    where: { id: feedbackId },
    data: {
      name,
      email,
      contactNo,
      product,
      rating,
      verbatim,
    },
  });
  res.json(feedback);
});

app.delete('/feedbacks/:feedbackId', async (req, res) => {
  const { feedbackId } = req.params;
  const feedback = await prisma.feedback.delete({
    where: { id: feedbackId },
  });
  res.json(feedback);
});

app.listen(PORT);

export default app;
