import { document as userPostsDocument } from './document';
import { Document, Post, Mention } from './types';

class Operations {
  constructor() {}

  static addPosts = (post:Post ) => {
    const output = {
      "$add": {
        [`posts`]: [post]
      }
    }
    return output
  }

  static removePosts = (postIndex:number ) => {
    const output = {
      "$remove": {
        [`posts.${postIndex}`]: true 
      }
    }
    return output
  }

  static updatePosts = (index:number, post:Post ) => {
    const output = {
      "$update": {
        [`posts.${index}.value`]: post.value 
      }
    }
    return output
  }

  static addMentions = (postIndex:number, mention:any ) => {
    const output = {
      "$add": {
        [`posts.${postIndex}.mentions`]: mention 
      }
    }
    return output
  }

  static removeMentions = (postIndex:number, mentionIndex: number ) => {
    const output = {
      "$remove": {
        [`posts.${postIndex}.mentions.${mentionIndex}`]: true 
      }
    }
    return output
  }

  static updateMentions = (postIndex:number, mentionIndex: number, current:any ) => {
    const output = {
      "$update": {
        [`posts.${postIndex}.mentions.${mentionIndex}.text`]: current.text 
      }
    }
    return output
  }
}

export const generateUpdateStatement = (
  documentUpdate: Document,
) => {
  const storedPosts: Post[] = userPostsDocument.posts;
  const toUpdatePosts: Post[] = documentUpdate.posts;

  const result = toUpdatePosts.reduce((acum, newPost) => {
    if(!newPost._id) return {...acum,...Operations.addPosts(newPost)}

    const postIndex = storedPosts.findIndex((post, index, posts) => post._id === newPost._id )

    if(newPost.delete) return {...acum, ...Operations.removePosts(postIndex)}
    
    if(newPost._id && newPost.value) {
      return {
        ...acum,
        ...Operations.updatePosts(postIndex, newPost),
      }
    } 
    else if(newPost._id && newPost.mentions) {
      const storedMentions: Mention[] = postIndex ? storedPosts[postIndex].mentions : undefined

      const mentionsOperations = newPost.mentions.map((newMention: Mention) => {
        if(!newMention._id) return {...Operations.addMentions(postIndex, newMention)}
        
        const mentionIndex = storedMentions.findIndex((storedMention, index) => storedMention._id === newMention._id)

        if(newMention.delete) return {...Operations.removeMentions(postIndex, mentionIndex)}

        return {...Operations.updateMentions(postIndex, mentionIndex, newMention)} 
      })[0]
      
      return {
        ...acum,
        ...mentionsOperations,
      }
    }  
    
    return acum
  },{})

  return result
};
