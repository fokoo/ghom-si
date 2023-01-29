import { Chapter } from "./chapter.model";


export interface Book {
  Chapters: Chapter[];
  Text:     string;  // is the book-name (local in french)
  ID?:      number;
  NameGhomala?: string;
  NameEnglish?: string;
  testament?: string;
}
