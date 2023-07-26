import {
  adminQuizCreate, adminQuizRemove, adminQuizInfo, adminQuizNameUpdate,
  adminQuizDescriptionUpdate, adminQuizList
} from './quiz.js';
import { adminAuthRegister } from './auth.js';
import { clear } from './other.js';

// simplify the error string
const ERROR = { error: expect.any(String) };

beforeEach(() => {
  clear();
});

// tests for adminQuizCreate
describe('tests for adminQuizCreate', () => {
  // initialise an auth before creating quiz
  let id;
  beforeEach(() => {
    id = adminAuthRegister('random@gmail.com', 'Random1234', 'Jack', 'Smith');
  });

  test('invalid AuthUserId', () => {
    const result = adminQuizCreate(id.authUserId + 1, 'CityQuiz',
      'City name quiz');
    expect(result).toEqual(ERROR);
  });

  test('Check no special character in Quiz name', () => {
    const result = adminQuizCreate(id.authUserId, 'City-+', 'City name quiz');
    expect(result).toEqual({
      error: 'Quiz name contains invalid character or' +
      ' have space'
    });
  });

  test('Check name length greater than 3', () => {
    const result = adminQuizCreate(id.authUserId, 'CQ', 'City name quiz');
    expect(result).toEqual(ERROR);
  });

  test('Check name length less than or equal to 30 characters', () => {
    const result = adminQuizCreate(id.authUserId,
      'TestYourKnowledgeAboutCityNames', 'City name quiz');
    expect(result).toEqual(ERROR);
  });

  // Test if Quiz name already used by the current user
  test('if Quiz name already used', () => {
    // create a quiz first and then a second time
    adminQuizCreate(id.authUserId, 'CityQuiz', 'City name quiz');
    const result = adminQuizCreate(id.authUserId, 'CityQuiz', 'City name quiz');
    expect(result).toEqual(ERROR);
  });

  // Test if description is more than 100 characters long
  test('if description is more than 100 characters long', () => {
    // test for empty strings as well
    const result = adminQuizCreate(id.authUserId, 'MyQuiz', 'TestYour' +
      'KnowledgeAboutCityNamesTestYourKnowledgeAboutCityNamesTestYour' +
        'KnowledgeAboutCityNamesTestYourKnowledgeAboutCityNames');
    expect(result).toEqual(ERROR);
  });

  test('correct return type', () => {
    // test for empty strings as well
    const result = adminQuizCreate(id.authUserId, 'CityQuiz',
      'City name quiz');
    expect(result.quizId).toStrictEqual(expect.any(Number));
  });
});

// test for adminQuizRemove
describe('tests for adminQuizRemove', () => {
  // initialise an auth before creating quiz
  let id;
  let quizId;
  beforeEach(() => {
    id = adminAuthRegister('random@gmail.com', 'Random1234', 'Jack', 'Smith');
    quizId = adminQuizCreate(id.authUserId, 'CityQuiz', 'City name quiz');
  });

  test('valid AuthUserId', () => {
    const result = adminQuizRemove(id.authUserId + 1, quizId.quizId);
    expect(result).toEqual(ERROR);
  });

  test('Check valid QuizId', () => {
    const result = adminQuizRemove(id.authUserId, quizId.quizId + 1);
    expect(result).toEqual(ERROR);
  });

  test('Check if Quiz is owned by the current user', () => {
    // ensure a different email address is used to create a new user
    const id2 = adminAuthRegister('ran@gmail.com', 'Random1234', 'Jack',
      'Smith');
    const quizId2 = adminQuizCreate(id2.authUserId, 'CityQuiz',
      'City name quiz');
    const result = adminQuizRemove(id.authUserId, quizId2.quizId);
    expect(result).toEqual(ERROR);
  });

  test('correct return type', () => {
    const result = adminQuizRemove(id.authUserId, quizId.quizId);
    expect(result).toEqual({});
  });
});

// adminQuizList tests
describe('adminQuizList', () => {
  // initialising a user and quiz before every test
  let userId1;
  let quizId1;

  beforeEach(() => {
    userId1 = adminAuthRegister('email@ad.unsw.edu.au', 'Random1234',
      'Maria', 'Wang');
    quizId1 = adminQuizCreate(userId1.authUserId, 'Puppy Quiz',
      'A quiz on the types of puppies!');
  });

  describe('errors', () => {
    test('empty authUserId', () => {
      expect(adminQuizList('')).toStrictEqual(ERROR);
    });

    test('authUserId does not belong to any user', () => {
      expect(adminQuizList(userId1.authUserId + 111111)).toStrictEqual(ERROR);
    });

    test('empty quiz list', () => {
      const userId2 = adminAuthRegister('email2@ad.unsw.edu.au', 'Random1234',
        'James', 'Lee');
      expect(adminQuizList(userId2.authUserId)).toStrictEqual({ quizzes: [] });
    });

    test('quiz deletion', () => {
      const quizId2 = adminQuizCreate(userId1.authUserId, 'second quiz',
        'A quiz on the types of kittens!');
      adminQuizRemove(userId1.authUserId, quizId1.quizId);
      const quizzes = adminQuizList(userId1.authUserId).quizzes;

      expect(quizzes.length).toStrictEqual(1);
      expect(quizzes[0].quizId).toStrictEqual(quizId2.quizId);
      expect(quizzes[0].name).toStrictEqual('second quiz');
    });
  });

  describe('returns correct list of quizzes', () => {
    test('returns correct quiz list for one quiz', () => {
      expect(adminQuizList(userId1.authUserId)).toStrictEqual({
        quizzes: [{ quizId: quizId1.quizId, name: 'Puppy Quiz' }]
      });
    });

    test('returns correct quiz list for three quizzes (same user)', () => {
      const quizId2 = adminQuizCreate(userId1.authUserId, 'Kitten Quiz',
        'A quiz on the types of kittens!');
      const quizId3 = adminQuizCreate(userId1.authUserId, 'Armadillo Quiz',
        'A quiz on the types of armadillos!');
      const quizInfo = [
        { quizId: quizId1.quizId, name: 'Puppy Quiz' },
        { quizId: quizId2.quizId, name: 'Kitten Quiz' },
        { quizId: quizId3.quizId, name: 'Armadillo Quiz' },
      ];
      expect(adminQuizList(userId1.authUserId)).toStrictEqual({
        quizzes: quizInfo
      });
    });

    test('returns correct quiz list for three quizzes (different users)', () => {
      const userId2 = adminAuthRegister('email2@ad.unsw.edu.au', 'Random1234',
        'James', 'Lee');
      const quizId2 = adminQuizCreate(userId1.authUserId, 'Kitten Quiz',
        'A quiz on the types of kittens!');
      adminQuizCreate(userId2.authUserId, 'Armadillo Quiz',
        'A quiz on the types of armadillos!');
      const quizInfo = [
        { quizId: quizId1.quizId, name: 'Puppy Quiz' },
        { quizId: quizId2.quizId, name: 'Kitten Quiz' },
      ];
      expect(adminQuizList(userId1.authUserId)).toStrictEqual({
        quizzes: quizInfo
      });
    });
  });
});

// test for adminQuizInfo
describe('tests for adminQuizInfo', () => {
  // initialise an auth before creating quiz
  let id;
  let quizId;
  beforeEach(() => {
    id = adminAuthRegister('random@gmail.com', 'Random1234', 'Jack', 'Smith');
    quizId = adminQuizCreate(id.authUserId, 'CityQuiz', 'City name quiz');
  });

  test('valid AuthUserId', () => {
    const result = adminQuizInfo(id.authUserId + 1, quizId.quizId);
    expect(result).toEqual(ERROR);
  });

  test('Check valid QuizId', () => {
    const result = adminQuizInfo(id.authUserId, quizId.quizId + 1);
    expect(result).toEqual(ERROR);
  });

  test('Check if Quiz is owned by the current user', () => {
    // ensure a different email address is used to create a new user
    const id2 = adminAuthRegister('ran@gmail.com', 'Random1234', 'Jack',
      'Smith');
    const quizId2 = adminQuizCreate(id2.authUserId, 'CityQuiz', 'City name' +
      ' quiz');
    const result = adminQuizInfo(id.authUserId, quizId2.quizId);
    expect(result).toEqual(ERROR);
  });

  test('correct return type', () => {
    const id2 = adminAuthRegister('ran@gmail.com', 'Random1234', 'Jack', 'Smith');
    const quizId2 = adminQuizCreate(id2.authUserId, 'CityQuiz', 'City name quiz');
    const result = adminQuizInfo(id2.authUserId, quizId2.quizId);
    expect(result).toStrictEqual({
      quizId: expect.any(Number),
      name: 'CityQuiz',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'City name quiz',
    });
  });

  test('Test successful quiz read - correct timestamp format', () => {
    const id2 = adminAuthRegister('ran@gmail.com', 'Random1234', 'Jack', 'Smith');
    const quizId2 = adminQuizCreate(id2.authUserId, 'CityQuiz', 'City name quiz');
    const quiz = adminQuizInfo(id2.authUserId, quizId2.quizId);
    expect(quiz.timeCreated.toString()).toMatch(/^\d{10}$/);
    expect(quiz.timeLastEdited.toString()).toMatch(/^\d{10}$/);
  });
});

// test for adminQuizNameUpdate
describe('tests for adminQuizNameUpdate', () => {
  // initialise an auth before creating quiz
  let id;
  let quizId;
  beforeEach(() => {
    id = adminAuthRegister('random@gmail.com', 'Random1234', 'Jack', 'Smith');
    quizId = adminQuizCreate(id.authUserId, 'CityQuiz', 'City name quiz');
  });

  test('valid AuthUserId', () => {
    const result = adminQuizNameUpdate(id.authUserId + 1, quizId.quizId,
      'change');
    expect(result).toEqual(ERROR);
  });

  test('Check valid QuizId', () => {
    const result = adminQuizNameUpdate(id.authUserId, quizId.quizId + 1,
      'change');
    expect(result).toEqual(ERROR);
  });

  test('Check if Quiz is owned by the current user', () => {
    // ensure a different email address is used to create a new user
    const id2 = adminAuthRegister('ran@gmail.com', 'Random1234', 'Jack',
      'Smith');
    const quizId2 = adminQuizCreate(id2.authUserId, 'CityQuiz', 'City name' +
      ' quiz');
    const result = adminQuizNameUpdate(id.authUserId, quizId2.quizId,
      'change');
    expect(result).toEqual(ERROR);
  });

  test('Check no special character in Quiz name', () => {
    const result = adminQuizNameUpdate(id.authUserId, quizId.quizId,
      'City-+');
    expect(result).toEqual(ERROR);
  });

  test('Check name length greater than 3', () => {
    const result = adminQuizNameUpdate(id.authUserId, quizId.quizId, 'CQ');
    expect(result).toEqual(ERROR);
  });

  test('Check name length less than or equal to 30 characters', () => {
    const result = adminQuizNameUpdate(id.authUserId, quizId.quizId,
      'TestYourKnowledgeAboutCityNames');
    expect(result).toEqual(ERROR);
  });

  // Test if Quiz name already used by the current user
  test('if Quiz name already used', () => {
    // create a quiz first and then a second time
    adminQuizCreate(id.authUserId, 'CityQuiz',
      'City name quiz');
    const result = adminQuizNameUpdate(id.authUserId, quizId.quizId,
      'CityQuiz');
    expect(result).toEqual(ERROR);
  });

  test('correct return type', () => {
    const result = adminQuizNameUpdate(id.authUserId, quizId.quizId,
      'change new name');
    expect(result).toStrictEqual({});
  });
});

// test for adminQuizDesciptionUpdate
describe('tests for adminQuizDescriptionUpdate', () => {
  // initialise an auth before creating quiz
  let id;
  let quizId;
  beforeEach(() => {
    id = adminAuthRegister('random@gmail.com', 'Random1234', 'Jack', 'Smith');
    quizId = adminQuizCreate(id.authUserId, 'CityQuiz', 'City name quiz');
  });

  // test if the function can check the AuthUserId is invalid
  test('valid AuthUserId', () => {
    const result = adminQuizDescriptionUpdate(id.authUserId + 1,
      quizId.quizId, 'change');
    expect(result).toEqual(ERROR);
  });
  // test if the function can find the quizId is invalid
  test('Check valid QuizId', () => {
    const result = adminQuizDescriptionUpdate(id.authUserId,
      quizId.quizId + 1, 'change');
    expect(result).toEqual(ERROR);
  });
  // test if the function can find the quizId is not owned by user
  test('Check if Quiz is owned by the current user', () => {
    // ensure a different email address is used to create a new user
    const id2 = adminAuthRegister('ran@gmail.com', 'Random1234', 'Jack',
      'Smith');
    const quizId2 = adminQuizCreate(id2.authUserId, 'CityQuiz',
      'City name quiz');
    const result = adminQuizDescriptionUpdate(id.authUserId, quizId2.quizId,
      'change');
    expect(result).toEqual(ERROR);
  });
  // test if the function returns error for long string
  test('Check description length greater than 100', () => {
    const result = adminQuizDescriptionUpdate(id.authUserId, quizId.quizId, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    expect(result).toEqual(ERROR);
  });

  test('Correct return type', () => {
    const returnedQuiz = adminQuizDescriptionUpdate(id.authUserId, quizId.quizId, 'trees are nice');
    expect(returnedQuiz).toEqual({});
  });
});
