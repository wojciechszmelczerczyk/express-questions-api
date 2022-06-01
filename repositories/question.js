const { readFile, writeFile } = require('fs/promises')

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

    // add new question
    questions.push(question)

    // assign modified stringified question array to variable
    let arr = JSON.stringify(questions)

    // write new array to file
    await writeFile(fileName, arr, { encoding: 'utf-8' })

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
  const addAnswer = async (questionId, answer) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })

    // all questions
    const questions = JSON.parse(fileContent)

    // question with specific id
    const [question] = questions.filter(question => question.id === questionId)

    // iterate on question fields and find answers property
    for (prop in question) {
      if (prop === 'answers') {
        // push answer to answers array property
        question[prop].push(answer)

        // save in json file new array
        await writeFile(fileName, JSON.stringify(questions), {
          encoding: 'utf-8'
        })
      }
    }

    // return new added answer
    return answer
  }

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
