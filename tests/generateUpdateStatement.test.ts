import { generateUpdateStatement } from '../src/generateUpdateStatement';
import { document } from '../src/document';
import { Document } from '../src/types';

describe('Update to specific fields', () => {
  it('Update value field of post with _id of 2', () => {
    const input: Document = { "posts": [{"_id": 2, "value": "too" }] }
    const output = { "$update": {"posts.0.value": "too"} }
    expect(generateUpdateStatement(input)).toEqual(output);
  })

  it('Update text field in mention with _id of 5, for post with _id of 2', () => {
    const input: Document = { "posts": [{"_id": 3, "mentions": [{ "_id": 5, "text":"pear"}] }] }
    const output = { "$update": {"posts.1.mentions.0.text": "pear"} }
    expect(generateUpdateStatement(input)).toEqual(output);
  })
});

describe('Appending to existing arrays', () => {
  // Documents being added do not have an _id yet; the _id 
  // get's assigned by the DBMS at the time of item insertion
  it('Add new post', () => {
    const input: Document = { "posts": [{"value": "four" }] }
    const output = { "$add": {"posts": [{"value":"four"}]} }
    expect(generateUpdateStatement(input)).toEqual(output);
  })

  it('Add mention to post with _id of 3', () => {
    const input: Document = { "posts": [{"_id": 3, "mentions": [{ "text":"banana"}] }] }
    const output = { "$add": {"posts.1.mentions": {"text": "banana"}} }
    expect(generateUpdateStatement(input)).toEqual(output);
  })
});

describe('Removing existing items', () => {
  it('Remove post with _id of 2', () => {
    const input: Document = { "posts": [{"_id": 2, "delete": true }] }
    const output = { "$remove": {"posts.0": true} }
    expect(generateUpdateStatement(input)).toEqual(output);
  })

  it('Remove mention with _id of 6, for post with _id of 3', () => {
    const input: Document = { "posts": [{"_id": 3, "mentions": [{ "_id": 6, "delete":true}] }] }
    const output = { "$remove": {"posts.1.mentions.1": true} }
    expect(generateUpdateStatement(input)).toEqual(output);
  })
});

describe('Update Add and Remove in single statement', () => {
  it('update, add and remove', () => {
    const input = { 
      "posts": [
        {"_id": 2, "value": "too" },
        {"value": "four"},
        {"_id": 4, "_delete": true}
      ] 
    }
    const output = { 
      "$update": {"posts.0.value": "too"},
      "$add": {"posts": [{"value": "four"}] },
      "$remove": {"posts.1": true}
    }
    expect(generateUpdateStatement(input)).toEqual(output);
  })

});

