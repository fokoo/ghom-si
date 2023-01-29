import { Verse } from "./verse.model";


export interface Chapter {
  Verses: Verse[];
  ID?:    number;
  BookName?: string;
}
