import * as yup from 'yup';

export const triviaAnswerValidationSchema = yup.object().shape({
  answer: yup.string().required(),
  is_correct: yup.boolean().required(),
  question_id: yup.string().nullable().required(),
});
