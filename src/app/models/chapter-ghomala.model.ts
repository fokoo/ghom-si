import { Verse } from "./verse.model";


export class ChapterGhomala {
  DB_UID?: string;
  Verses: Verse[] = [];
  ChapterID!:number;
  BookID!: number;
  //BookName?: string;
  Text? : string;
  Title?: string;
  Audio?: string;
}
