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
})
