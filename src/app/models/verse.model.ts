
export class Verse {
  ID?:  number;
  Text?: string;
  Title? : string;
  constructor (id: number, text: string, title?: string) {
    this.ID = id;
    this.Text = text? text: " ";
    if (!text || text == null) {
      this.Text = undefined;
      this.Title = title? title : undefined;
    }
  }
}
