import { TriviaQuestionInterface } from 'interfaces/trivia-question';
import { GetQueryInterface } from 'interfaces';

export interface TriviaAnswerInterface {
  id?: string;
  answer: string;
  is_correct: boolean;
  question_id: string;
  created_at?: any;
  updated_at?: any;

  trivia_question?: TriviaQuestionInterface;
  _count?: {};
}

export interface TriviaAnswerGetQueryInterface extends GetQueryInterface {
  id?: string;
  answer?: string;
  question_id?: string;
}
