import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {

  ngOnInit(): void {
    this.initForm();
  }
  @Input() inputWords?: string;
  //@Input() showTextarea?: boolean;
  @Output() outputWords = new EventEmitter<string>();
  typedWords: any = "";
  rowTextarea: number = 3;

  private initForm() {
    console.log("initForm() called");
    if (this.inputWords) {
      this.typedWords = this.inputWords;
    } else {
      this.typedWords = "";
    }
    //this.showTextarea = (this.showTextarea)? this.showTextarea: false;
  }

  update() {
    if (this.typedWords.length === 0){
      return;
    }
    console.log("update() called /n");
   // console.log("typedWords: " + this.typedWords);
    this.outputWords.emit(this.typedWords);
  }


  showKb = false;
  showNum = false;
  showAbc = true;
  isCapital = false;
  showSpe = false;
  turn = 'Turn on Keyboard';
  aBc = 'Upper';
  abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  abc2 = [ 'ç', 'ŋ', 'ɔ', 'ʉ', 'ɛ', 'ə',
    '`', '´', '^', ' ̌', '\'', '.', ',', '!', '?', ':', ';', '-'];
  accents = ['`', '´', '^', ' ̌'];
  abcCapital = this.abc.map(c => c.toUpperCase());
  abcCapital2 = this.abc2.map(c => c.toUpperCase());
  speCar =    ['æ', 'ä', 'ö', 'ï', 'ë', 'ü', 'œ', 'ǔ́', 'ɵ', 'ɲ'];
  speCarCap = this.speCar.map(c => c.toUpperCase());
  digits = ['0','1','2','3','4','5','6','7','8','9'];
  mapAbc = new Map([
    ['a ̌', 'ǎ'], ['a^', 'â'], ['a´', 'á'], ['a`', 'à'],
    ['i ̌', 'ǐ'], ['i^', 'î'], ['i´', 'í'], ['i`', 'ì'],
    ['e ̌', 'ě'], ['e^', 'ê'], ['e´', 'é'], ['e`', 'è'],
    ['ɛ ̌', 'ɛ̌'], ['ɛ^', 'ɛ̂'], ['ɛ´', 'ɛ́'], ['ɛ`', 'ɛ̀'],
    ['ə ̌', 'ə̌'], ['ə^', 'ə̂'], ['ə´', 'ə́'], ['ə`', 'ǝ̀'],
    ['u ̌', 'ǔ'], ['u^', 'û'], ['u´', 'ú'], ['u`', 'ù'],
    ['ʉ ̌', 'ʉ̌'], ['ʉ^', 'ʉ̂'], ['ʉ´', 'ʉ́'], ['ʉ`', 'ʉ̀'],
    ['o ̌', 'ǒ'], ['o^', 'ô'], ['o´', 'ó'], ['o`', 'ò'],
    ['ɔ ̌', 'ɔ̌'], ['ɔ^', 'ɔ̂'], ['ɔ´', 'ɔ́'], ['ɔ`', 'ɔ̀'],
    ['c ̌', 'č']
  ]);
  hasAddAllCapitale = this.addCapitale(this.mapAbc);


/*
  clearText() {
    this.typedWords = '';
    this.update();
    this.rowTextarea = 3;
    // this.initResult();
  } */

  showKeyboard() {
    this.showKb = !this.showKb;
    if (this.showKb === true){
      // this.turn = 'Turn off Keyboard';
      this.showAbc = true;
      this.initForm();
    } //else {
      //this.turn = 'Turn on Keyboard';
      //this.update();
      //this.clearText();
    //}
  }

  showNumber() {
    this.showNum = !this.showNum;
  }

  showKeySpeCar() {
    this.showSpe = !this.showSpe;
  }

  showAlphabet() {
    this.showAbc = !this.showAbc;
  }

  showInCapital() {
    this.isCapital = !this.isCapital;
    this.showAbc = true;
    if (this.isCapital === true){
      this.aBc = 'Lower';
      //this.capitalIcon= "arrow_upward";
    } else {
      this.aBc = 'Upper';
      //this.capitalIcon= "arrow_downward";
    }
  }

  addChar(l: string) {
    // this.temp = this.searchWords;
    if (this.accents.indexOf(l) !== -1 && this.typedWords) {
      const len = this.typedWords.length;
      let t;
      /*  if (this.isCapital){
          t = this.searchWords.charAt(len - 1).toLowerCase() + l;
        } else {*/
      t = this.typedWords.charAt(len - 1) + l;
      // }
      if (this.mapAbc.has(t)) {
        this.removeChar(0);
        l = this.mapAbc.get(t)!;
        /* if (this.isCapital){
           l = l.toUpperCase();
         }*/
      }
    }
    this.typedWords = this.typedWords + l;
    this.update();
  }

  removeChar(n: number) {
    // const m = this.searchWords.length - 1;
    // const temp = this.searchWords;
    this.typedWords = this.typedWords.slice(n, -1);
    // console.log('1. ' + temp);
    /*  if (!this.searchWords){
      this.initResult();
      }*/
    this.update();
  }

  normalyseSW() {
    const arrSw: string[] = this.typedWords.split('');
    this.typedWords = '';
    arrSw.forEach(x => {
      this.addChar(x);
    });
    this.update();
  }
  private addCapitale(mapX: Map<string, string>) {
    // const newMap = new Map();
    const len = this.mapAbc.size;
    for (const [key, value] of mapX) {
      this.mapAbc.set(key.toUpperCase(), value.toUpperCase());
    }
    return this.mapAbc.size === 2 * len;
  }

  shift(cha: string) {
    if(cha && this.typedWords.trim().length > 0) {
      this.addChar(cha);
      this.rowTextarea += this.rowTextarea;
    }
  }
}



// ['Æ', 'Ä', 'Ö', 'Ï', 'Ë', 'ü', 'Œ', 'Ǔ́'];
/*  mapAbc = new Map([
    ['a ̌', 'ǎ', 'a^': 'â', 'a´': 'á', 'a`': 'à',
                 'i ̌' : 'ǐ', 'i^': 'î', 'i´': 'í', 'i`': 'ì',
                 'e ̌' : 'ě', 'e^': 'ê', 'e´': 'é', 'e`': 'è',
                 'ɛ ̌' : 'ɛ̌', 'ɛ^': 'ɛ̂', 'ɛ´': 'ɛ́', 'ɛ`': 'ɛ̀',
                 'ə ̌' : 'ə̌', 'ə^': 'ə̂', 'ə´': 'ə́', 'ə`': 'ǝ̀',
                 'u ̌' : 'ǔ', 'u^': 'û', 'u´': 'ú', 'u`': 'ù',
                 'ʉ ̌' : 'ʉ̌', 'ʉ^': 'ʉ̂', 'ʉ´': 'ʉ́', 'ʉ`': 'ʉ̀',
                 'o ̌' : 'ǒ', 'o^': 'ô', 'o´': 'ó́', 'o`': 'ò',
                 'ɔ ̌' : 'ɔ̌', 'ɔ^': 'ɔ̂', 'ɔ´': 'ɔ́', 'ɔ`': 'ɔ̀',
            'c ̌': 'č'};
           ]);*/

/*   ǍÂÁÀ ÈÊĚƐ̌Ɛ̂Ɛ́Ə̌Ə̂Ə́ƏÉƐ  ÙÛǓɄɄ́Ʉ̌ÜÚ  ÍǏÎÌ ÒÔ ƆƆ́Ɔ̂Ɔ̌ ǑÓ  Ɵ Ɔ ŊƝ Č Ç
 '\u030C'  onNewWord() { this.router.navigate(['/words', 'new']);   } */
