import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DialogData } from '../models/dialog-data.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    //data.closeDialog = false;
  }
  //@Output() outputConfirm = new EventEmitter<string>();

  onNoClick(): void {
    //this.outputConfirm.emit('0');
    this.dialogRef.close();
  }

  onYesClick() {
    //this.outputConfirm.emit('1');
    this.dialogRef.close();
  }


}
