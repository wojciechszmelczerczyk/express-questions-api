const { readFile } = require('fs/promises')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions.filter(question => question.id === questionId)
  }

  const addQuestion = async question => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    questions.push(question)
    return questions
  }

  const getAnswers = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    const [question] = questions.filter(question => question.id === questionId)

    for (prop in question) {
      if (prop === 'answers') {
        return question[prop]
      }
    }
  }

  const getAnswer = async (questionId, answerId) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    // get question by id
    const [question] = questions.filter(question => question.id === questionId)

    let answer

    // // question object
    for (prop in question) {
      // answers property
      if (prop === 'answers') {
        // iterate on answers array
        question[prop].filter(ans => {
          // iterate on answer object properties
          for (ansProp in ans) {
            if (ansProp === 'id' && ans[ansProp] === answerId) {
              answer = ans
            }
          }
        })
      }
    }
    return answer
  }
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
