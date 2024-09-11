import {Component,OnInit,Inject} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ApiService} from "../../../service/api.service";

@Component({
  templateUrl:'delete-fund.template.html'
})

export class DeleteFundComponent{

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    private apiService:ApiService
  ){}

  confirm(){
    let model={Id:this.data.Id};
    this.apiService.DeleteMyFunds(model).subscribe(
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
