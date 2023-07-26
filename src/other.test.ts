import { adminAuthRegister, adminAuthLogin } from './auth.js';
import {
  adminQuizCreate, adminQuizRemove, adminQuizNameUpdate,
  adminQuizDescriptionUpdate
} from './quiz.js';
import { clear } from './other.js';

test('test clear', () => {
  expect(clear()).toStrictEqual({ });
});

describe('test adminAuthregister', () => {
  beforeEach(() => {
    adminAuthRegister('random@gmail.com', 'Short1', 'Jack', 'Smith');
  });

  test('clears one registered user', () => {
    expect(clear()).toStrictEqual({ });
  });

  test('clears three registered users', () => {
    adminAuthRegister('email@ad.unsw.edu.au', 'Random1234',
      'Maria', 'Wang');
    adminAuthRegister('email2@ad.unsw.edu.au', 'Random1234',
      'James', 'Lee');
    expect(clear()).toStrictEqual({ });
  });
});

describe('test adminQuizCreate', () => {
  let user;
  beforeEach(() => {
    user = adminAuthRegister('random@gmail.com', 'Short1', 'Jack', 'Smith');
    adminQuizCreate(user.authUserId, 'CityQuiz', 'Make something up');
  });

  describe('clears new quizzes (one user)', () => {
    test('clears one new quiz', () => {
      expect(clear()).toStrictEqual({ });
    });
    test('clears two new quizzes', () => {
      const user2 = adminAuthRegister('random2@gmail.com', 'Short12', 'Bobbi', 'Brown');
      adminQuizCreate(user2.authUserId, 'QuizName', 'funny quiz');
      expect(clear()).toStrictEqual({ });
    });
  });
});

describe('test functions that change field values', () => {
  let user;
  let quiz;
  beforeEach(() => {
    user = adminAuthRegister('random@gmail.com', 'Short1', 'Jack', 'Smith');
    quiz = adminQuizCreate(user.authUserId, 'CityQuiz', 'Make something up');
  });

  test('clear adminAuthLogin', () => {
    adminAuthLogin('random@gmail.com', 'Random1234');
    expect(clear()).toStrictEqual({ });
  });

  test('clear adminQuizRemove', () => {
    adminQuizRemove(user.authUserId, quiz.quizId);
    expect(clear()).toStrictEqual({ });
  });

  test('clear adminQuizDescriptionUpdate', () => {
    adminQuizDescriptionUpdate(user.authUserId, quiz.quizId, 'trees are nice');
    expect(clear()).toStrictEqual({ });
  });

  test('clear adminQuizNameUpdate', () => {
    adminQuizNameUpdate(user.authUserId, quiz.quizId, 'change new name');
  });
});
