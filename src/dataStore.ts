// YOU SHOULD MODIFY THIS OBJECT BELOW
let data = {
  users: [
    {
      authUserId: 1,
      nameFirst: 'Austin',
      nameLast: 'Post',
      email: 'austinpost24@gmail.com',
      password: 'Sunflowers123',
      numSuccessfulLogins: 3,
      numFailedPasswordsSinceLastLogin: 1,
      quizzes: [
        {
          quizId: 10,
          name: 'GuesstheCelebrity'
        }
      ]
    },
    {
      authUserId: 2,
      nameFirst: 'Jess',
      nameLast: 'Smith',
      email: 'JessSmith144@gmail.com',
      password: 'SuperNova441',
      numSuccessfulLogins: 2,
      numFailedPasswordsSinceLastLogin: 0,
      quizzes: [
        {
          quizId: 12,
          name: 'GuesstheFood'
        }
      ]
    },
  ],
  quizzes: [
    {
      id: 1,
      name: 'quiz1',
      authUserId: 1,
      description: ' ',
      timeCreated: 1687491028358,
      timeLastEdited: 1687491028358,
    },
    {
      id: 2,
      name: 'quiz2',
      authUserId: 1,
      description: ' ',
      timeCreated: 1687491383268,
      timeLastEdited: 1687491383268,
    },
  ],
};

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData) {
  data = newData;
}

export { getData, setData };
