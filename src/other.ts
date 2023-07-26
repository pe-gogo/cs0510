import { setData } from './dataStore.js';
/**
  * Reset the state of the application back to the start.
  *
  * @param {} - empty
  *
  * @returns {} - empty
*/
function clear() {
  setData({
    users: [],
    quizzes: []
  });
  return {};
}
export { clear };
