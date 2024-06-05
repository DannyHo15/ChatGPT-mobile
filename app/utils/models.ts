export enum Sender {
  User = "user",
  Bot = "bot",
}
export type TMessageData = {
  content: string
  imageUrl?: string
  prompt?: string
  role: Sender
}

export type TChat = {
  id: number
  title: string
}
