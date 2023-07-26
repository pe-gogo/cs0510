```javascript
let data = [
	{
		users: [
			{
				nameFirst: 'Austin',
				nameLast: 'Post',
				authUserId: 123456789,
				email: 'austinpost24@gmail.com',
				password: 'sunflowers123',
				quizList: ['Party', 'Music'],
				numSuccessfulLogins: 3,
				numFailedPasswordsSinceLastLogin: 1,
				quizzes: [
					{
						quizId: 1,
						name: 'My Quiz',
						dataCreated: 01/11/2023,
						timeLastEdited: 1683125871,
						description: 'This is my quiz'
					}
					// more quizzes
				]
			}
			// the next user
		]
	}
];
```

[Optional] short description: 
// Data consists of all users. For every user, we include id, names... and all the quizzes they own. In the quiz section, the quizID, name.. are included.