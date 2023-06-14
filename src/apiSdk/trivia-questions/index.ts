import axios from 'axios';
import queryString from 'query-string';
import { TriviaQuestionInterface, TriviaQuestionGetQueryInterface } from 'interfaces/trivia-question';
import { GetQueryInterface } from '../../interfaces';

export const getTriviaQuestions = async (query?: TriviaQuestionGetQueryInterface) => {
  const response = await axios.get(`/api/trivia-questions${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTriviaQuestion = async (triviaQuestion: TriviaQuestionInterface) => {
  const response = await axios.post('/api/trivia-questions', triviaQuestion);
  return response.data;
};

export const updateTriviaQuestionById = async (id: string, triviaQuestion: TriviaQuestionInterface) => {
  const response = await axios.put(`/api/trivia-questions/${id}`, triviaQuestion);
  return response.data;
};

export const getTriviaQuestionById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/trivia-questions/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTriviaQuestionById = async (id: string) => {
  const response = await axios.delete(`/api/trivia-questions/${id}`);
  return response.data;
};
