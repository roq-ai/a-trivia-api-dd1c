import axios from 'axios';
import queryString from 'query-string';
import { TriviaAnswerInterface, TriviaAnswerGetQueryInterface } from 'interfaces/trivia-answer';
import { GetQueryInterface } from '../../interfaces';

export const getTriviaAnswers = async (query?: TriviaAnswerGetQueryInterface) => {
  const response = await axios.get(`/api/trivia-answers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTriviaAnswer = async (triviaAnswer: TriviaAnswerInterface) => {
  const response = await axios.post('/api/trivia-answers', triviaAnswer);
  return response.data;
};

export const updateTriviaAnswerById = async (id: string, triviaAnswer: TriviaAnswerInterface) => {
  const response = await axios.put(`/api/trivia-answers/${id}`, triviaAnswer);
  return response.data;
};

export const getTriviaAnswerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/trivia-answers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTriviaAnswerById = async (id: string) => {
  const response = await axios.delete(`/api/trivia-answers/${id}`);
  return response.data;
};
