import '@tensorflow/tfjs-node';

import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import { PrismaClient } from '@prisma/client';
import * as toxicity from '@tensorflow-models/toxicity';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import translate from '@vitalets/google-translate-api';

import loadAndPredict from './model';

const prisma = new PrismaClient();

const {
  CONFIDENCE_THRESHOLD = 0.9,
  MODEL_FEEDBACK_CATEGORY_CLASSIFIER_URL,
  PORT = 3000,
} = process.env;

const CATEGORY_MAP = ['insightful', 'non-insightful', 'low-quality'] as const;

const predictFeedbackCategory = async (text: string) => {
  const dataArray = await loadAndPredict(
    MODEL_FEEDBACK_CATEGORY_CLASSIFIER_URL,
    await (await use.load()).embed(text)
  );

  let category: typeof CATEGORY_MAP[keyof typeof CATEGORY_MAP] = 'low-quality';
  if (dataArray) {
    // Find the index of the highest confidence score.
    const idx = Array.from(dataArray).indexOf(Math.max(...dataArray));
    category = CATEGORY_MAP[idx];
  }

  return category;
};

const predictPriority = async (
  text: string,
  category: typeof CATEGORY_MAP[keyof typeof CATEGORY_MAP],
  rating: number
) => {
  const model = await toxicity.load(Number(CONFIDENCE_THRESHOLD), ['toxicity']);

  const predictions = await model.classify(text);

  const isToxic = predictions.some((prediction) =>
    prediction.results.some((result) => result.match)
  );

  let priority = 0;
  if (isToxic) {
    priority++;
  }
  if (rating < 5) {
    priority++;
  }
  if (category === 'insightful') {
    priority++;
  }

  return priority;
};

const app = express();

app.use(express.json());

app.get('/', (_, res) => {
  res.send('🚀 Apollo API');
});

app.post('/feedbacks', async (req, res) => {
  const { name, email, contactNo, product, rating = 0, verbatim } = req.body;

  const translationResult = await translate(verbatim);

  const category = await predictFeedbackCategory(translationResult.text); // Use translated text to support other languages...

  const priority = await predictPriority(
    translationResult.text,
    category,
    rating
  );

  const feedback = await prisma.feedback.create({
    data: {
      id: uuidv4(),
      name,
      email,
      contactNo,
      priority,
      product,
      rating,
      verbatim,
      category,
    },
  });
  res.json(feedback);
});

app.get('/feedbacks', async (req, res) => {
  const { limit, offset, keyword, rating, product, priority, category } =
    req.query;
  const feedbacks = await prisma.feedback.findMany({
    where: {
      category: category?.toString(),
      email: { contains: keyword?.toString() },
      name: { contains: keyword?.toString() },
      product: product?.toString(),
      priority: priority ? Number(priority) : undefined,
      rating: rating ? Number(rating) : undefined,
    },
    orderBy: { createdAt: 'desc' },
    take: limit ? Number(limit) : undefined,
    skip: offset ? Number(offset) : undefined,
  });

  const count = await prisma.feedback.count();
  res.setHeader('X-Total-Count', count);

  // Sorting hack after fetched from database.
  const sortedFeedbacks = feedbacks.sort(
    (f1, f2) =>
      CATEGORY_MAP.indexOf(f1.category as any) -
      CATEGORY_MAP.indexOf(f2.category as any)
  );
  res.json(sortedFeedbacks);
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
