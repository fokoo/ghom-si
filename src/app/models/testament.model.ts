import { Book } from "./book.model";

export interface Testament {
  Books: Book[];
  Text:  string;
  ID?:   number;
}
