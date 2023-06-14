import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { triviaAnswerValidationSchema } from 'validationSchema/trivia-answers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTriviaAnswers();
    case 'POST':
      return createTriviaAnswer();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTriviaAnswers() {
    const data = await prisma.trivia_answer
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'trivia_answer'));
    return res.status(200).json(data);
  }

  async function createTriviaAnswer() {
    await triviaAnswerValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.trivia_answer.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
