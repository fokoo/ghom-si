
export class VerseTitle {
  ID?:  number;
  Text?: string;
  Title? : string;
  constructor (id: number, text?: string, title?: string) {
    this.ID = id;
    this.Text = text? text: " ";
    this.Title = title? title : " ";
  }
}
