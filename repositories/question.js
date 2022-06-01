const { readFile, writeFile } = require('fs/promises')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    // uuid regex for validation purposes
    const uuidReg = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    )

    try {
      if (typeof questionId === 'string' && !parseInt(questionId)) {
        if (questionId.match(uuidReg)) {
          const fileContent = await readFile(fileName, { encoding: 'utf-8' })
          const questions = JSON.parse(fileContent)

          return questions.filter(question => question.id === questionId)
        } else {
          throw new Error("id doesn't match uuidv4 pattern")
        }
      } else {
        throw new Error('id has to be a string value')
      }
    } catch (err) {
      if (err.message.includes('string value'))
        return { id_is_not_string_value: err.message }
      return { id_doesnt_match_regex: err.message }
    }
  }

  const addQuestion = async question => {
    try {
      if (
        typeof question['author'] === 'string' &&
        !parseInt(question['author'])
      ) {
        if (
          typeof question === 'string' &&
          !parseInt(question) &&
          question.includes('?')
        ) {
          const fileContent = await readFile(fileName, { encoding: 'utf-8' })
          const questions = JSON.parse(fileContent)

          // add new question
          questions.push(question)

          // assign modified stringified question array to variable
          let arr = JSON.stringify(questions)

          // write new array to file
          await writeFile(fileName, arr, { encoding: 'utf-8' })

          return questions
        } else {
          throw new Error(
            'Inappropriate question provided. Value has to be string with question mark'
          )
        }
      } else {
        throw new Error(
          'Inappropriate author name provided. Name has to be string'
        )
      }
    } catch (err) {
      if (err.message.includes('question'))
        return { invalid_question: err.message }
      return { invalid_author_name: err.message }
    }
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
        return answer
      }
    }
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
