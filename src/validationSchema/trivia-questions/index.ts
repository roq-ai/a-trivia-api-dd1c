import * as yup from 'yup';
import { triviaAnswerValidationSchema } from 'validationSchema/trivia-answers';

export const triviaQuestionValidationSchema = yup.object().shape({
  question: yup.string().required(),
  category: yup.string().required(),
  difficulty: yup.number().integer().required(),
  creator_id: yup.string().nullable().required(),
  trivia_answer: yup.array().of(triviaAnswerValidationSchema),
});
