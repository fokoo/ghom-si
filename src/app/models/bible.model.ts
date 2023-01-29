import { Book } from "./book.model";
import { Testament } from "./testament.model";

export interface Bible {
  Abbreviation: string;
  Language:     string;
  Testaments?:   Testament[];
  Books?:  Book[];
  Text:  string;  // is the bible-name
}
