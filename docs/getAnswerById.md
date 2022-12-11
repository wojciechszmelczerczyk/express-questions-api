# Get answer by id

## Description

Get answer by id.

<b>URL:</b> `/questions/:questionId/answers/:answerId`

<b>Method:</b> `GET`

<b>URL parameters:</b> `questionId=[integer]`, `answerId=[integer]` where `questionId` and `answerId` are mongoose object id syntax.

## Success Response

Code: `200 OK`

### Context example

Return specific answer.

```json
{
  "author": "Brian McKenzie",
  "id": "ce7bddfb-0544-4b14-92d8-188b03c41ee4",
  "summary": "The Earth is flat."
}
```

## Error Response

Code: `400 BAD REQUEST`

Condition: If question with provided id doesn't exist.

```json
{
  "err": "question with such id doesn't exist",
  "fail": true
}
```

Code: `400 BAD REQUEST`

Condition: If answer with provided id doesn't exist.

```json
{
  "err": "answer with such id doesn't exist",
  "fail": true
}
```

Code: `400 BAD REQUEST`

Condition: If provided id's are invalid.

```json
{
  "err": "Provided id's doesn't match uuidv4 pattern",
  "fail": true
}
```
