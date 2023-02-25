
export class Verse {
  ID?:  number;
  Text?: string;
  constructor (id?: number, text?: string) {
    this.ID = id? id : 0;
    this.Text = text? text : '';
  }
}
