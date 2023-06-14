import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { triviaQuestionValidationSchema } from 'validationSchema/trivia-questions';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTriviaQuestions();
    case 'POST':
      return createTriviaQuestion();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTriviaQuestions() {
    const data = await prisma.trivia_question
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'trivia_question'));
    return res.status(200).json(data);
  }

  async function createTriviaQuestion() {
    await triviaQuestionValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.trivia_answer?.length > 0) {
      const create_trivia_answer = body.trivia_answer;
      body.trivia_answer = {
        create: create_trivia_answer,
      };
    } else {
      delete body.trivia_answer;
    }
    const data = await prisma.trivia_question.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
