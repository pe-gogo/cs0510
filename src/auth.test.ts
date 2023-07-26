import { adminAuthRegister, adminAuthLogin, adminUserDetails } from './auth.js';
import { clear } from './other.js';

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  clear();
});

describe('adminUserDetails tests', () => {
  let userId1;
  beforeEach(() => {
    userId1 = adminAuthRegister('email@ad.unsw.edu.au', 'Random1234', 'Maria',
      'Wang');
  });

  describe('invalid authUserId', () => {
    test('empty authUserId', () => {
      expect(adminUserDetails('')).toStrictEqual(ERROR);
    });
    test('authUserId does not belong to any user', () => {
      expect(adminUserDetails(userId1.authUserId + 1)).toStrictEqual(ERROR);
    });
  });

  describe('returns correct adminUserDetails', () => {
    test('one user', () => {
      expect(adminUserDetails(userId1.authUserId)).toStrictEqual({
        user: {
          userId: userId1.authUserId,
          name: 'Maria Wang',
          email: 'email@ad.unsw.edu.au',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        }
      });
    });

    test('two users', () => {
      const userId2 = adminAuthRegister('email2@ad.unsw.edu.au', 'Random1234',
        'James', 'Lee');
      expect(adminUserDetails(userId1.authUserId)).toStrictEqual({
        user: {
          userId: userId1.authUserId,
          name: 'Maria Wang',
          email: 'email@ad.unsw.edu.au',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        }
      });
      expect(adminUserDetails(userId2.authUserId)).toStrictEqual({
        user: {
          userId: userId2.authUserId,
          name: 'James Lee',
          email: 'email2@ad.unsw.edu.au',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        }
      });
    });

    test('number of successful login once (registration)', () => {
      expect(adminUserDetails(userId1.authUserId)).toStrictEqual({
        user: {
          userId: userId1.authUserId,
          name: 'Maria Wang',
          email: 'email@ad.unsw.edu.au',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        }
      });
    });

    test('number of successful login twice (registration + additional login)', () => {
      adminAuthLogin('email@ad.unsw.edu.au', 'Random1234');
      expect(adminUserDetails(userId1.authUserId)).toStrictEqual({
        user: {
          userId: userId1.authUserId,
          name: 'Maria Wang',
          email: 'email@ad.unsw.edu.au',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0,
        }
      });
    });

    test('failed login once', () => {
      adminAuthLogin('email@ad.unsw.edu.au', 'Random123');
      expect(adminUserDetails(userId1.authUserId)).toStrictEqual({
        user: {
          userId: userId1.authUserId,
          name: 'Maria Wang',
          email: 'email@ad.unsw.edu.au',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 1,
        }
      });
    });
  });
});

describe('tests for adminAuthRegister', () => {
  test('Check if registration was successful', () => {
    expect(adminAuthRegister('random@gmail.com', 'Random1234', 'Jack', 'Smith')).toStrictEqual({ authUserId: expect.any(Number) });
  });

  test('Check if email is invalid', () => {
    // Email must be valid according to isEmail function from validator.js
    expect(adminAuthRegister('notanemail', 'Random1234', 'Jack', 'Smith')).toStrictEqual(ERROR);
  });

  test('Check if email is already in use', () => {
    adminAuthRegister('random@gmail.com', 'Random1234', 'Jack', 'Smith');
    expect(adminAuthRegister('random@gmail.com', 'Random1234', 'Jane', 'Smith')).toStrictEqual(ERROR);
  });

  test('Check if password is too short', () => {
    // Must be at least 8 characters
    expect(adminAuthRegister('random@gmail.com', 'Short1', 'Jack', 'Smith')).toStrictEqual(ERROR);
  });

  test('Check if password contains at least one number and one letter', () => {
    expect(adminAuthRegister('random@gmail.com', 'aaaaaaaaa', 'Jack', 'Smith')).toStrictEqual(ERROR);
  });

  test('Check if first name and last name is too short', () => {
    // First name short
    expect(adminAuthRegister('random@gmail.com', 'Random1234', 'J', 'Smith')).toStrictEqual(ERROR);
    // Last name short
    expect(adminAuthRegister('random@gmail.com', 'Random1234', 'Jack', 'S')).toStrictEqual(ERROR);
  });

  test('Check if first name and last name is too long', () => {
    // First name long
    expect(adminAuthRegister('random@gmail.com', 'Random1234', 'AAAAAAAAAAAAAAAAAAAAAA', 'Smith')).toStrictEqual(ERROR);
    // Last name long
    expect(adminAuthRegister('random@gmail.com', 'Random1234', 'Jack', 'AAAAAAAAAAAAAAAAAAAAAA')).toStrictEqual(ERROR);
  });

  test('Check if first name and last name contains invalid characters', () => {
    // First name invalid
    expect(adminAuthRegister('random@gmail.com', 'Random1234', 'Jack9=', 'Smith')).toStrictEqual(ERROR);
    // Last name invalid
    expect(adminAuthRegister('random@gmail.com', 'Random1234', 'Jack', 'Smith1+')).toStrictEqual(ERROR);
  });

  test('(Autotest version) Test successful case auth register', () => {
    expect(adminAuthRegister('seann.email@domain.com', 'ThisIsASeanPassword123!', 'FFFFF', 'LLLLL')).toStrictEqual({ authUserId: expect.any(Number) });
  });
});

describe('tests for adminAuthLogin', () => {
  test('Check if it returns the authUserId', () => {
    adminAuthRegister('random@gmail.com', 'Random1234', 'Jack', 'Smith');
    expect(adminAuthLogin('random@gmail.com', 'Random1234')).toStrictEqual({ authUserId: expect.any(Number) });
  });

  test('Check if email exists', () => {
    adminAuthRegister('random@gmail.com', 'Random1234', 'Jack', 'Smith');
    expect(adminAuthLogin('unused@gmail.com', 'Random1234')).toStrictEqual(ERROR);
  });

  test('Check if password is correct', () => {
    adminAuthRegister('random@gmail.com', 'Random1234', 'Jack', 'Smith');
    expect(adminAuthLogin('random@gmail.com', 'WrongPass1234')).toStrictEqual(ERROR);
  });
});
