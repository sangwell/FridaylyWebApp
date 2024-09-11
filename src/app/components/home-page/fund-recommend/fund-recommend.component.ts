import {Component} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  templateUrl:'fund-recommend.template.html',
  styleUrls:['fund-recommend.style.css']
})

export class FundRecommendComponent{

  constructor(
    public dialogRef: MatDialogRef<any>
  ){}

  closeDialog(){
    this.dialogRef.close();
  }

}
