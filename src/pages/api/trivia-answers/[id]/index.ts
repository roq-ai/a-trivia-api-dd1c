import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { triviaAnswerValidationSchema } from 'validationSchema/trivia-answers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.trivia_answer
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getTriviaAnswerById();
    case 'PUT':
      return updateTriviaAnswerById();
    case 'DELETE':
      return deleteTriviaAnswerById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTriviaAnswerById() {
    const data = await prisma.trivia_answer.findFirst(convertQueryToPrismaUtil(req.query, 'trivia_answer'));
    return res.status(200).json(data);
  }

  async function updateTriviaAnswerById() {
    await triviaAnswerValidationSchema.validate(req.body);
    const data = await prisma.trivia_answer.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteTriviaAnswerById() {
    const data = await prisma.trivia_answer.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
