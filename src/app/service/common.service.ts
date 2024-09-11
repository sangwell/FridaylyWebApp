import { Injectable } from '@angular/core';

@Injectable()
export class CommonService{

  constructor(){}

  parserDomToChartData(data){
    let parser = new DOMParser();
    let dom=parser.parseFromString(data._body, "text/xml");
    let tdElementArray=dom.getElementsByTagName('td');
    let tdLength=tdElementArray.length;
    let dataArray=[];
    let dateList=[];
    let rateList=[];
    let valueList=[];
    for(let i=tdLength-1;i>=0;i--){
      if(i%7 === 0){
        dateList.push(tdElementArray[i].innerHTML);
      }
      if(i%7 === 1){
        valueList.push(Number(tdElementArray[i].innerHTML.replace('%','')));
      }
      if(i%7 === 3){
        rateList.push(Number(tdElementArray[i].innerHTML.replace('%','')));
      }
    }
    for(let i=0;i<dateList.length;i++){
      let singleObj:any={};
      singleObj.date=dateList[i];
      singleObj.value=valueList[i];
      singleObj.rate=rateList[i];
      dataArray.push(singleObj);
    }
    return dataArray;
  }
}
