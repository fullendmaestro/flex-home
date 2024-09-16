
import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, message } = req.body;

  // Fetch product knowledge and generate response
  const aiResponse = await generateResponse(message);

  // Save message to database
  await prisma.message.create({
    data: {
      chatId: userId,
      text: message,
      role: 'user',
    },
  });

  await prisma.message.create({
    data: {
      chatId: userId,
      text: aiResponse,
      role: 'bot',
    },
  });

  res.status(200).json({ response: aiResponse });
};

