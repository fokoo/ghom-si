
export class Verse {
  ID?:  number;
  Text?: string;
  Title? : string | undefined;
  constructor (id: number, text?: string, title?: string) {
    this.ID = id;
    this.Text = text? text: " ";
    this.Title = title? title : " ";
  }
}
