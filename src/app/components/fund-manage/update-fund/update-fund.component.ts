import {Component,OnInit,Inject} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {UpdateFundModel} from './update-fund.model';
import {ApiService} from "../../../service/api.service";

@Component({
  templateUrl:'update-fund.template.html'
})

export class UpdateFundComponent implements OnInit{

  updateFundModel:UpdateFundModel=new UpdateFundModel();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    private apiService:ApiService
  ){}

  ngOnInit(){
      this.updateFundModel = JSON.parse(JSON.stringify(this.data));
  }

  confirm(){
    this.apiService.UpdateMyFunds(this.updateFundModel).subscribe(
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
