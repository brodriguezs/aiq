import { Document } from './types';

export const document: Document = {
  "_id": 1,
  "name": "Johnny Content Creator",
  "posts": [
    {
      "_id": 2,
      "value": "one",
      "mentions": []
    },
    {
      "_id": 3,
      "value": "two",
      "mentions": [
        {
          "_id": 5,
          "text": "apple",
        },
        {
          "_id": 6,
          "text": "orange"
        }
      ]
    },
    {
      "_id": 4,
      "value": "three",
      "mentions": []
    }
  ]
}
