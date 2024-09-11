import {Component} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AddFundModel} from './add-fund.model';
import {ApiService} from "../../../service/api.service";

@Component({
  templateUrl:'add-fund.template.html'
})

export class AddFundComponent{

  addFundModel:AddFundModel=new AddFundModel();

  constructor(
    public dialogRef: MatDialogRef<any>,
    private apiService:ApiService
  ){}

  confirm(){
    this.apiService.AddMyFunds(this.addFundModel).subscribe(
      data=>{
        this.dialogRef.close(true);
      },
      error=>{
        console.log(error);
      }
    );
  }

  closeDialog(){
    this.dialogRef.close(false);
  }
}
