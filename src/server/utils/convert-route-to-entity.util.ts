const mapping: Record<string, string> = {
  organizations: 'organization',
  'trivia-answers': 'trivia_answer',
  'trivia-questions': 'trivia_question',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
