const { readFile } = require('fs/promises')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {}
  const addQuestion = async question => {}
  const getAnswers = async questionId => {}
  const getAnswer = async (questionId, answerId) => {}
  const addAnswer = async (questionId, answer) => {}

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
