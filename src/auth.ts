import { getData, setData } from './dataStore.js';
import validator from 'validator';

/**
  *
  * Register a user with an email, password, and names,
  * then returns their authUserId value.
  *
  * @param {string} email -
  * @param {string} password
  * @param {string} nameFirst
  * @param {string} nameLast
  * ...
  *
  * @returns {{ authUserId }}
*/

function adminAuthRegister(email, password, nameFirst, nameLast) {
  const data = getData();

  // Check if email is already used
  for (const user of data.users) {
    if (user.email === email) {
      return { error: 'Email address is used by another user' };
    }
  }

  // Check email
  if (!validator.isEmail(email)) {
    return { error: 'Email must be valid' };
  }

  // Must not contain characters other than lowercase letters, uppercase
  // letters, spaces, hyphens, or apostrophes, and be between 2-20 characters
  const isNameValid = /^[A-Za-z\s'-]{2,20}$/;

  // Check nameFirst and nameLast
  if (!validator.matches(nameFirst, isNameValid)) {
    return {
      error: 'First name must only contain letters, spaces, hyphens,' +
            ' or apostrophes and be between 2-20 characters'
    };
  }

  if (!validator.matches(nameLast, isNameValid)) {
    return {
      error: 'Last name must only contain letters, spaces, hyphens,' +
            ' or apostrophes and be between 2-20 characters'
    };
  }

  // Must be less than 8 characters and contain at least one number and letter
  const isPasswordValid = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

  // Check password
  if (!validator.matches(password, isPasswordValid)) {
    return {
      error: 'Password must contain at least 8 characters and at' +
            ' least one number and letter'
    };
  }

  let newUser;
  if (data.users.length > 0) {
    const lastUserId = data.users[data.users.length - 1].authUserId;
    newUser = lastUserId + 1;
  } else {
    newUser = 1;
  }

  data.users.push({
    authUserId: newUser,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    password: password,
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
    quizzes: [],
  });

  setData(data);

  return { authUserId: newUser };
}

/**
  *
  * Given a registered user's email and password returns their authUserId value.

  *
  * @param {string} email
  * @param {string} password
  *
  * @returns {{ authUserId }}
**/

function adminAuthLogin(email, password) {
  const data = getData();

  const emailExists = data.users.find(user => user.email === email);

  if (!emailExists) {
    return { error: 'Email does not exist' };
  }

  const passwordMatch = data.users.find(user => user.password === password &&
        user.email === email);

  if (!passwordMatch) {
    emailExists.numFailedPasswordsSinceLastLogin += 1;
    return { error: 'Password does not match email' };
  }

  // uopdate numSuccessfulLogins
  passwordMatch.numSuccessfulLogins += 1;
  // reset the numFailedPasswordsSinceLastLogin:
  passwordMatch.numFailedPasswordsSinceLastLogin = 0;

  const id = passwordMatch.authUserId;

  setData(data);

  return {
    authUserId: id
  };
}

/**
  * Given an admin user's authUserId, return details about the user.
  *
  * @param {number} authUserId
  * ...
  *
  * @returns {user: {
  * userId: 1,
  * name: 'Hayden Smith',
  * email: 'hayden.smith@unsw.edu.au',
  * numSuccessfulLogins: 3,
  * numFailedPasswordsSinceLastLogin: 1,
  *   }
  * }
  */

function adminUserDetails(authUserId) {
  const data = getData();
  const userIndex = data.users.findIndex(user => user.authUserId === authUserId);
  if (userIndex === -1) {
    return { error: 'Invalid AuthUserId' };
  }

  const foundUser = data.users[userIndex];
  return {
    user:
        {
          userId: foundUser.authUserId,
          name: foundUser.nameFirst + ' ' +
                foundUser.nameLast,
          email: foundUser.email,
          numSuccessfulLogins: foundUser.numSuccessfulLogins,
          numFailedPasswordsSinceLastLogin:
                foundUser.numFailedPasswordsSinceLastLogin
        }
  };
}

export { adminAuthRegister, adminAuthLogin, adminUserDetails };
