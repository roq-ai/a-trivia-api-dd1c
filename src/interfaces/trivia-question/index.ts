import { TriviaAnswerInterface } from 'interfaces/trivia-answer';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface TriviaQuestionInterface {
  id?: string;
  question: string;
  category: string;
  difficulty: number;
  creator_id: string;
  created_at?: any;
  updated_at?: any;
  trivia_answer?: TriviaAnswerInterface[];
  user?: UserInterface;
  _count?: {
    trivia_answer?: number;
  };
}

export interface TriviaQuestionGetQueryInterface extends GetQueryInterface {
  id?: string;
  question?: string;
  category?: string;
  creator_id?: string;
}
