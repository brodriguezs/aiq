export interface Document {
  _id?: number,
  name?: string,
  posts: Post[],
}

export interface Post {
  _id?: number,
  value?: string,
  mentions?: Mention[],
  delete?: true,
}

export interface Mention {
  _id?: number,
  text?: string,
  delete?: true,
}
