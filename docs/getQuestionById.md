# Get question by id

## Description

Get question by id.

<b>URL:</b> `/questions/:questionId`

<b>Method:</b> `GET`

<b>URL parameter:</b> `questionId=[integer]` where `questionId` is mongoose object id syntax.

## Success Response

Code: `200 OK`

### Context example

Return specific question.

```json
{
  "answers": [
    {
      "author": "Brian McKenzie",
      "id": "ce7bddfb-0544-4b14-92d8-188b03c41ee4",
      "summary": "The Earth is flat."
    },
    {
      "author": "Dr Strange",
      "id": "d498c0a3-5be2-4354-a3bc-78673aca0f31",
      "summary": "It is egg-shaped."
    }
  ],
  "author": "John Stockton",
  "id": "50f9e662-fa0e-4ec7-b53b-7845e8f821c3",
  "summary": "What is the shape of the Earth?"
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

Condition: If provided id is invalid.

```json
{
  "err": "id doesn't match uuidv4 pattern",
  "fail": true
}
```
