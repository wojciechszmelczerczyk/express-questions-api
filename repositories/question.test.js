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

  test('should return question by specific id', async () => {
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

  test('should add new question', async () => {
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

  test('get answers of specific question', async () => {
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

    // new answer object
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
    const [question] = questions.filter(question => question.id === questionId)

    // find answer with provided id
    const [answer] = question['answers'].filter(
      answer => answer.id === answerId
    )

    // expect answer author field match first answer author field
    expect(answer['author']).toBe(firstAnswer.author)
  })
})
