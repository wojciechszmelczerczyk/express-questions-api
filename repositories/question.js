const { readFile, writeFile } = require('fs/promises')

// uuid regex for validation purposes
const uuidReg = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
)

const makeQuestionRepository = fileName => {
  // read json database and parse to object
  const getDatabase = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    return JSON.parse(fileContent)
  }

  const getQuestions = async () => {
    const questions = await getDatabase()

    return questions
  }

  const getQuestionById = async questionId => {
    try {
      if (questionId.match(uuidReg)) {
        const questions = await getDatabase()

        // check if question with provided id exist
        const isValid = questions.some(question => question.id === questionId)

        // if so return question
        if (isValid) {
          return questions.filter(question => question.id === questionId)
          // otherwise throw error message
        } else {
          throw new Error("question with this id doesn't exist")
        }
      } else {
        throw new Error("id doesn't match uuidv4 pattern")
      }
    } catch (err) {
      if (err.message.includes("doesn't exist"))
        return { question_doesnt_exist: err.message }
      return { id_doesnt_match_regex: err.message }
    }
  }

  const addQuestion = async question => {
    // check if same question exist already
    const questions = await readFile(fileName, { encoding: 'utf-8' })
    const parsedQuestions = JSON.parse(questions)
    const [duplicateQuestion] = parsedQuestions.filter(
      pQuestion => pQuestion['summary'] === question['summary']
    )

    try {
      if (!duplicateQuestion) {
        if (
          typeof question['author'] === 'string' &&
          !parseInt(question['author'])
        ) {
          if (
            typeof question['summary'] === 'string' &&
            question['summary'].includes('?') &&
            !parseInt(question['summary'])
          ) {
            const questions = await getDatabase()

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
      } else if (duplicateQuestion) {
        throw new Error('This question already exist')
      }
    } catch (err) {
      if (err.message.includes('Inappropriate question'))
        return { invalid_question: err.message }
      else if (err.message.includes('Inappropriate author'))
        return { invalid_author_name: err.message }
      return { question_already_exist: err.message }
    }
  }

  const getAnswers = async questionId => {
    try {
      if (questionId.match(uuidReg)) {
        const questions = await getDatabase()

        const isValid = questions.some(question => question.id === questionId)

        if (isValid) {
          const [question] = questions.filter(
            question => question.id === questionId
          )

          for (prop in question) {
            if (prop === 'answers') {
              return question[prop]
            }
          }
        } else {
          throw new Error("question with such id doesn't exist")
        }
      } else {
        throw new Error("id doesn't match uuidv4 pattern")
      }
    } catch (err) {
      if (err.message.includes('uuidv4'))
        return { id_doesnt_match_regex: err.message }
      return { question_doesnt_exist: err.message }
    }
  }

  const getAnswer = async (questionId, answerId) => {
    try {
      if (questionId.match(uuidReg)) {
        if (answerId.match(uuidReg)) {
          const questions = await getDatabase()

          const isValid = questions.some(question => question.id === questionId)

          if (isValid) {
            // get question by id
            const [question] = questions.filter(
              question => question.id === questionId
            )

            let answer

            // question object
            for (prop in question) {
              // answers property
              if (prop === 'answers') {
                // iterate on answers array
                question[prop].forEach(ans => {
                  // iterate on answer object properties
                  for (ansProp in ans) {
                    if (ansProp === 'id') {
                      if (ans[ansProp] === answerId) answer = ans
                    }
                  }
                })
                if (answer) return answer
                else throw new Error("answer with such id doesn't exist")
              }
            }
          } else {
            throw new Error("question with such id doesn't exist")
          }
        } else {
          throw new Error(
            'Provided answer id is invalid. Id has to match uuidv4 pattern'
          )
        }
      } else {
        throw new Error(
          'Provided question id is invalid. Id has to match uuidv4 pattern'
        )
      }
    } catch (err) {
      if (err.message.includes('Provided question'))
        return {
          invalid_question_id_datatype: err.message
        }
      else if (err.message.includes('Provided answer'))
        return { invalid_answer_id_datatype: err.message }
      else if (err.message.includes("question with such id doesn't exist"))
        return { question_doesnt_exist: err.message }
      return { answer_doesnt_exist: err.message }
    }
  }
  const addAnswer = async (questionId, answer) => {
    try {
      if (questionId.match(uuidReg)) {
        if (
          typeof answer['author'] === 'string' &&
          !parseInt(answer['author'])
        ) {
          if (
            typeof answer['summary'] === 'string' &&
            !parseInt(answer['summary'])
          ) {
            // all questions
            const questions = await getDatabase()

            const isValid = questions.some(
              question => question.id === questionId
            )

            if (isValid) {
              // question with specific id
              const [question] = questions.filter(
                question => question.id === questionId
              )

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

              // return question object with new answer
              return question
            } else {
              throw new Error("Question with provided id doesn't exist.")
            }
          } else {
            throw new Error(
              "Incorrect answer's title provided. Title has to be string type."
            )
          }
        } else {
          throw new Error(
            "Incorrect answer's author provided. Author has to be string type."
          )
        }
      } else {
        throw new Error(
          'Incorrect id provided. Id has to be string type and match uuid regex pattern.'
        )
      }
    } catch (err) {
      if (err.message.includes('title'))
        return { incorrect_answer_title: err.message }
      else if (err.message.includes('author'))
        return { incorrect_answer_author: err.message }
      else if (err.message.includes('Incorrect id provided'))
        return {
          incorrect_id_provided: err.message
        }
      return { question_doesnt_exist: err.message }
    }
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
