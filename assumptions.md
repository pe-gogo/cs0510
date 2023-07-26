1. All the emails will be case insenstively unique, i.e. if there is a
registered email called austinpost24@gmail.com than there will not be other
emails named "AustinPost24@gmail.com" or "austinPOST24@gmail.com" stored.
2. That the overall system will handle concurrent request
correctly, i.e. if two users wish to register with the same email at the same
time.
3. adminAuthRegister: That is.Email from validator is working correctly.
4. There are no space constraints for the data store, i.e. running out of memory
from too many users.
5. adminQuizCreate: That creating a quiz counts as editing it, thus
timeLastEdited is set to time of creation.
6. adminQuizCreate: That the quiz names are not case sensistive i.e. two quizzes
can have the name 'dog' and 'Dog'.