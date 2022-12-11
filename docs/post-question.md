# Create question

## Description

Save new product in database.

<b>URL:</b> `/questions`

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
  "author": "Albert Einstein",
  "summary": "How many stars are in milky way?"
}
```

## Success Response

Code: `200 OK`

Condition: If provided data is correct.

### Context example

```json
{
  "answers": [],
  "author": "Albert Einstein",
  "id": "91f95d22-a24f-44a9-a750-444673ef537a",
  "summary": "How many stars are in milky way?"
}
```

## Error Response
