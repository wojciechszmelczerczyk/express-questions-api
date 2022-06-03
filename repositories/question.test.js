const { writeFile, readFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  describe('GET /questions', () => {
    test('should return a list of 0 questions', async () => {
      expect(await questionRepo.getQuestions()).toHaveLength(0)
    })

    test('should return a list of 2 questions', async () => {
      const testQuestions = [
        {
          id: faker.datatype.uuid(),
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      expect(await questionRepo.getQuestions()).toHaveLength(2)
    })
  })

  describe('GET /questions/:id', () => {
    test('when id datatype is correct return question by specific id', async () => {
      // user id
      let id = faker.datatype.uuid()

      const testQuestions = [
        {
          id,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
      expect(await questionRepo.getQuestionById(id)).toHaveLength(1)
    })

    test('when id is correct but no question is provided', async () => {
      // user id
      let id = faker.datatype.uuid()

      const testQuestions = []

      expect(await questionRepo.getQuestionById(id)).toHaveLength(0)
    })

    test("when id datatype is string which doesn't match uuidv4 regex return error message", async () => {
      // incorrect user id sample
      let id = '123'

      const testQuestions = [
        {
          id,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      const errRes = await questionRepo.getQuestionById(id)

      expect(errRes['id_doesnt_match_regex']).toBe(
        "id doesn't match uuidv4 pattern"
      )
    })
    // verify if fields are correct
    test('when id is not string return error message', async () => {
      // incorrect user id sample
      let id = 123

      const testQuestions = [
        {
          id,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      const errRes = await questionRepo.getQuestionById(id)

      expect(errRes['id_is_not_string_value']).toBe(
        'id has to be a string value'
      )
    })
  })

  describe('POST /questions', () => {
    test('when question datatype is correct add new question', async () => {
      // questions list
      const testQuestions = [
        {
          id: faker.datatype.uuid(),
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      // questions list length
      let questionsListLength = testQuestions.length

      // new question
      const newQuestion = {
        id: faker.datatype.uuid(),
        summary: 'How fast sound travel?',
        author: 'Norman Kowalsky',
        answers: []
      }

      // write base 2 questions to file
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      // add new question
      await questionRepo.addQuestion(newQuestion)

      // read question list from file with new question added and parse to object
      let listWithNewQuestion = JSON.parse(
        await readFile(TEST_QUESTIONS_FILE_PATH, {
          encoding: 'utf-8'
        })
      )

      // expect new list length to be greater by 1 (new question added)
      expect(listWithNewQuestion.length).toBe(questionsListLength + 1)
    })

    test('when question datatype is incorrect return error message', async () => {
      // questions list
      const testQuestions = [
        {
          id: faker.datatype.uuid(),
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      // new question
      const newQuestion = {
        id: faker.datatype.uuid(),
        summary: 5,
        author: 'Norman Kowalsky',
        answers: []
      }

      // write base 2 questions to file
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      // return error message
      const res_err = await questionRepo.addQuestion(newQuestion)

      // expect error message, new question has not been added due to summary field incorrect datatype
      expect(res_err['invalid_question']).toBe(
        'Inappropriate question provided. Value has to be string with question mark'
      )
    })
    test('when author name datatype is incorrect return error message', async () => {
      // questions list
      const testQuestions = [
        {
          id: faker.datatype.uuid(),
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      // new question
      const newQuestion = {
        id: faker.datatype.uuid(),
        summary: 'How high kangaroo jump?',
        author: 123,
        answers: []
      }

      // write base 2 questions to file
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      // return error message
      const resErr = await questionRepo.addQuestion(newQuestion)

      // expect error message, new question has not been added due to summary field incorrect datatype
      expect(resErr['invalid_author_name']).toBe(
        'Inappropriate author name provided. Name has to be string'
      )
    })
    test('when question with provided title already exists return error message', async () => {
      // questions list
      const testQuestions = [
        {
          id: faker.datatype.uuid(),
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      // new question
      const duplicateQuestion = {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Wojciech Nowak',
        answers: []
      }

      // write base 2 questions to file
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      // return error message
      const resErr = await questionRepo.addQuestion(duplicateQuestion)

      // expect error message, new question has not been added due to summary field incorrect datatype
      expect(resErr['question_already_exists']).toBe(
        'This question already exists'
      )
    })
  })

  describe('GET /questions/:questionId/answers', () => {
    test('when id datatype is correct and match uuid regex return answers of specific question', async () => {
      // user id
      let id = faker.datatype.uuid()

      // sample questions
      const testQuestions = [
        {
          id,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      // write questions to file
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      // new answer object
      const newAnswer = {
        id: faker.datatype.uuid(),
        summary: 'test',
        author: 'Andrew Dude'
      }

      // add new answer
      await questionRepo.addAnswer(id, newAnswer)

      // read modified questions list with brand new added answer and parse to object
      const questions = JSON.parse(
        await readFile(TEST_QUESTIONS_FILE_PATH, { encoding: 'utf-8' })
      )

      // find question with provided id
      const [question] = questions.filter(question => question.id === id)

      // check if answers list is equal to 1 (new added answer),
      expect(question['answers'].length).toBe(1)

      // check if author match provided data
      expect(question['answers'][0]['author']).toBe(newAnswer.author)
    })
  })
  describe('GET /questions/:questionId/answers/:answerId', () => {
    test('should return specific answer', async () => {
      // user id
      let questionId = faker.datatype.uuid()
      let answerId = faker.datatype.uuid()

      // sample questions
      const testQuestions = [
        {
          id: questionId,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      // write questions to file
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      // new answer objects
      const firstAnswer = {
        id: answerId,
        summary: 'test',
        author: 'Andrew Dude'
      }

      const secondAnswer = {
        id: faker.datatype.uuid(),
        summary: 'test2',
        author: 'Michael Bay'
      }

      // add new answers
      await questionRepo.addAnswer(questionId, firstAnswer)
      await questionRepo.addAnswer(questionId, secondAnswer)

      // read modified questions list with brand new added answer and parse to object
      const questions = JSON.parse(
        await readFile(TEST_QUESTIONS_FILE_PATH, { encoding: 'utf-8' })
      )

      // find question with provided id
      const [question] = questions.filter(
        question => question.id === questionId
      )

      // find answer with provided id
      const [answer] = question['answers'].filter(
        answer => answer.id === answerId
      )

      // expect answer author field match first answer author field
      expect(answer['author']).toBe(firstAnswer.author)
    })
  })

  describe('POST /questions/:questionId/answers', () => {
    test('should add new answer', async () => {
      // question id
      let questionId = faker.datatype.uuid()

      // sample questions
      const testQuestions = [
        {
          id: questionId,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      // new answer object
      const newAnswer = {
        id: faker.datatype.uuid(),
        summary: 'test',
        author: 'Andrew Dude'
      }

      // write questions to file
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      // read file with base questions
      const questions = JSON.parse(
        await readFile(TEST_QUESTIONS_FILE_PATH, { encoding: 'utf-8' })
      )

      // get question by provided id
      const [question] = questions.filter(
        question => question.id === questionId
      )

      // save answers list length (0)
      const answersListLength = question['answers'].length

      // add new answer
      await questionRepo.addAnswer(questionId, newAnswer)

      // read modified list
      const modifiedQuestions = JSON.parse(
        await readFile(TEST_QUESTIONS_FILE_PATH, { encoding: 'utf-8' })
      )

      // get question by id
      const [question2] = modifiedQuestions.filter(
        question => question.id === questionId
      )

      // now answers list of question is equal to 1 (new question added)
      const modifiedAnswersListLength = question2['answers'].length

      // after answer addition expect new answers list
      // to be greater than one before addition
      expect(modifiedAnswersListLength).toBeGreaterThan(answersListLength)
    })
  })
})
