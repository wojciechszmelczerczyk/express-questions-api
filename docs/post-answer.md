# Create answer

## Description

Save new product in database.

<b>URL:</b> `/questions/:questionId/answers`

<b>Method:</b> `POST`

## Data constraints

```json
{
  "author": "[string]",
  "summary": "[string]"
}
```

## Data example

```json
{
  "author": "New author",
  "summary": "New question"
}
```

## Success Response

Code: `200 OK`

Condition: If provided data is correct.

### Context example

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
    },
    {
      "author": "New author",
      "id": "32fe9795-d330-4dbc-8eab-062f06d9f5f8",
      "summary": "New question"
    }
  ],
  "author": "John Stockton",
  "id": "50f9e662-fa0e-4ec7-b53b-7845e8f821c3",
  "summary": "What is the shape of the Earth?"
}
```

## Error Response

Code: `400 BAD REQUEST`

Condition: If provided author and title are invalid.

```json
{
  "err": "Author and title of question have to be string value",
  "fail": true
}
```

Code: `400 BAD REQUEST`

Condition: If same user answer question more than once.

```json
{
  "err": "User cannot answer the same question more than once",
  "fail": true
}
```
