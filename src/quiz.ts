import { getData, setData } from './dataStore.js';

function adminQuizList (authUserId) {
  const data = getData();
  const validUser = data.users.find(user => user.authUserId === authUserId);

  // Check if authUserId belongs to user
  if (!validUser) {
    return {
      error: 'Invalid AuthUserId'
    };
  }

  // Finding index of user in 'users' array in data
  const userIdx = data.users.findIndex(users => users.authUserId === authUserId);
  const quizList = data.users[userIdx].quizzes;

  return {
    quizzes: quizList,
  };
}

/**
  * Given basic details about a new quiz, create one for the logged in user.
  *
  * @param {number} authUserId
  * @param {string} name
  * @param {string} description
  * ...
  *
  * @returns {number} quizId
*/

function adminQuizCreate(authUserId, name, description) {
  const data = getData();

  // see if we can find the users with authUserId in the dataStore
  const user = data.users.find(user => user.authUserId === authUserId);

  // if cannot find, return error
  if (!user) {
    return {
      error: 'Invalid AuthUserId'
    };
  }

  // check if the name is valid
  const ifNameValid = /[^a-zA-Z0-9 ]/;
  if (ifNameValid.test(name)) {
    return {
      error: 'Quiz name contains invalid character or have space'
    };
  }

  // check name length
  if (name.length < 3) {
    return {
      error: 'Quiz name should be at least 3 characters long'
    };
  }

  if (name.length > 30) {
    return {
      error: 'Quiz name should not be greater than 30 characters'
    };
  }

  // check if the quizname is already used by the authId for another quiz
  const nameIsUsed = data.quizzes.find(quizzes => quizzes.authUserId === authUserId && quizzes.name === name);

  if (nameIsUsed) {
    return {
      error: 'Repeated Quiz name with another existing quiz'
    };
  }

  if (description.length > 100) {
    return {
      error: 'Description is too long'
    };
  }

  // correct return type, push up to the dataStore
  let quizId;
  if (data.quizzes.length > 0) {
    const lastQuizId = data.quizzes[data.quizzes.length - 1].id;
    quizId = lastQuizId + 1;
  } else {
    quizId = 1;
  }

  data.quizzes.push({
    id: quizId,
    name: name,
    description: description,
    authUserId: authUserId,
    timeCreated: Math.floor(Date.now() / 1000),
    timeLastEdited: Math.floor(Date.now() / 1000),
  });

  // after creating the quiz, push up the quizId and quizName, by firsting finding
  // the index of the user mamching the authUserId
  const userIdx = data.users.findIndex(users => users.authUserId === authUserId);
  data.users[userIdx].quizzes.push({
    quizId: quizId,
    name: name
  });

  // set data
  setData(data);

  return {
    quizId: quizId,
  };
}

/**
  *
  * Given a particular quiz, permanently remove the quiz.
  *
  * @param {number} authUserIdn
  * @param {number} quizId
  * ...
  *
  * @returns {} - empty
*/

function adminQuizRemove(authUserId, quizId) {
  const data = getData();
  // see if we can find the users with authUserId in the dataStore
  const user = data.users.find(user => user.authUserId === authUserId);

  if (!user) {
    return {
      error: 'Invalid AuthUserId'
    };
  }

  // check if quiz qith quizId exist in dataStore
  const ifQuizValid = data.quizzes.find(quiz => quiz.id === quizId);

  if (!ifQuizValid) {
    return {
      error: 'Not a valid QuizId'
    };
  }

  // find the quiz with quizId and make sure it's owned by authUser
  const isOwnedByUser = data.quizzes.find(quiz => quiz.authUserId === authUserId && quiz.id === quizId);

  if (!isOwnedByUser) {
    return {
      error: 'Not a quiz owned by the user'
    };
  }

  // Remove quiz by filtering all quizzes that does not match quizId
  data.quizzes = data.quizzes.filter(quiz => quiz.id !== quizId);
  const userIdx = data.users.findIndex(user => user.authUserId === authUserId);
  data.users[userIdx].quizzes = data.users[userIdx].quizzes.filter(
    quiz => quiz.quizId !== quizId);

  // set Data
  setData(data);
  // return empty
  return {};
}

/**
  * Update the description of the relevant quiz.
  *
  * @param {number} authUserIdn
  * @param {number} quizId
  * @param {string} description
  *
  * @returns {} - empty
*/

function adminQuizDescriptionUpdate(authUserId, quizId, description) {
  const data = getData();

  // check if the AuthUserID is valid or not
  const user = data.users.find(user => user.authUserId === authUserId);

  if (!user) {
    return {
      error: 'Invalid AuthUserId'
    };
  }

  // check if the check quizID is valid or not
  const ifQuizValid = data.quizzes.find(quiz => quiz.id === quizId);

  if (!ifQuizValid) {
    return {
      error: 'Not a valid QuizId'
    };
  }

  // find the quiz with quizId and make sure it's owned by authUser
  const isOwnedByUser = data.quizzes.find(quiz => quiz.authUserId === authUserId && quiz.id === quizId);

  if (!isOwnedByUser) {
    return {
      error: 'Not a quiz owned by the user'
    };
  }

  // check if the description`s lenght is acceptable
  if (description.length > 100) {
    return {
      error: 'Description should be less than or equal to 100 characters long'
    };
  }

  const quizIndex = data.quizzes.findIndex(quiz => quiz.authUserId === authUserId && quiz.id === quizId);
  data.quizzes[quizIndex].description = description;
  data.quizzes[quizIndex].timeLastEdited = Math.floor(Date.now() / 1000);

  setData(data);
  return {
  };
}

/**
  * Get all of the relevant information about the current quiz.
  *
  * @param {number} authUserIdn
  * @param {number} quizId
  * ...
  *
  * @returns {
  * quizId,
  * name,
  * timeCreated,
  * timeLastEdited,
  * description,
  * }
*/

function adminQuizInfo(authUserId, quizId) {
  const data = getData();
  // Find the user from dataStore according to the authUserId
  const user = data.users.find(user => user.authUserId === authUserId);

  // Check if authUseId is not a valid user
  if (!user) {
    return {
      error: 'Invalid AuthUserId'
    };
  }

  // Check if Quiz ID does not refer to a valid quiz
  const ifQuizValid = data.quizzes.find(quiz => quiz.id === quizId);

  if (!ifQuizValid) {
    return {
      error: 'Not a valid QuizId'
    };
  }

  // Find the quiz with quizId and make sure it's owned by authUser
  const isOwnedByUser = data.quizzes.find(quiz => quiz.authUserId === authUserId && quiz.id === quizId);

  if (!isOwnedByUser) {
    return {
      error: 'Not a quiz owned by the user'
    };
  }

  // Find the currentQuiz which we want to check by quizId.
  const currentQuiz = data.quizzes.find(quiz => quiz.id === quizId);

  return {
    quizId: currentQuiz.id,
    name: currentQuiz.name,
    timeCreated: currentQuiz.timeCreated,
    timeLastEdited: currentQuiz.timeLastEdited,
    description: currentQuiz.description,
  };
}

/**
  * Update the name of the relevant quiz.
  *
  * @param {number} authUserIdn
  * @param {number} quizId
  * ...
  *
  * @returns {}   return empy
*/
function adminQuizNameUpdate(authUserId, quizId, name) {
  const data = getData();

  // Find the user from dataStore according to the authUserId
  const user = data.users.find(user => user.authUserId === authUserId);

  // Check if authUseId is not a valid user
  if (!user) {
    return {
      error: 'Invalid AuthUserId'
    };
  }

  // Check if Quiz ID does not refer to a valid quiz
  const ifQuizValid = data.quizzes.find(quiz => quiz.id === quizId);

  if (!ifQuizValid) {
    return {
      error: 'Not a valid QuizId'
    };
  }

  // find the quiz with quizId and make sure it's owned by authUser
  const isOwnedByUser = data.quizzes.find(quiz => quiz.authUserId === authUserId && quiz.id === quizId);

  if (!isOwnedByUser) {
    return {
      error: 'Not a quiz owned by the user'
    };
  }

  // Check if name contains any characters that are not alphanumeric or are spaces
  const ifNameValid = /[^a-zA-Z0-9 ]/;
  if (ifNameValid.test(name)) {
    return {
      error: 'Quiz name contains invalid character or have space'
    };
  }

  // Check if name is less than 3 characters long
  if (name.length < 3) {
    return {
      error: 'Quiz name should be at least 3 characters long'
    };
  }

  // Check if name is more than 30 characters long
  if (name.length > 30) {
    return {
      error: 'Quiz name should not be greater than 30 characters'
    };
  }

  // Check if the quizname is already used by the authId for another quiz
  const nameIsUsed = data.quizzes.find(quiz => quiz.authUserId === authUserId && quiz.name === name);

  if (nameIsUsed) {
    return {
      error: 'Repeated Quiz name with another existing quiz'
    };
  }

  // Find the quiz according to the quizId and update name and timeLastEdited.
  const currentQuizIndex = data.quizzes.findIndex(quiz => quiz.id === quizId);

  data.quizzes[currentQuizIndex].name = name;
  data.quizzes[currentQuizIndex].timeLastEdited = Math.floor(Date.now() / 1000);

  // Also find the user in dateStore and update the quiz name.
  const currentUserIndex = data.users.findIndex(user => user.quizzes.some(quiz => quiz.quizId === quizId));

  const quizIndex = data.users[currentUserIndex].quizzes.findIndex(quiz => quiz.quizId === quizId);
  data.users[currentUserIndex].quizzes[quizIndex].name = name;

  setData(data);

  return {};
}

export {
  adminQuizList, adminQuizCreate, adminQuizRemove, adminQuizInfo, adminQuizNameUpdate,
  adminQuizDescriptionUpdate
};
