import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { CSVRecord } from './CSVModel'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  
  public datatableTitle = 'datatables';
  public dtOptions: DataTables.Settings = {};
  public userData:any;
  
  public title = 'Angular7-readCSV';  
  public current_user:any;

  constructor(public appService: AppService, public router: Router,public _route: ActivatedRoute,public toastr: ToastrService) { }

  ngOnInit(

  ): void {
    if(Cookie.get("userId")){
      let user_id = this._route.snapshot.paramMap.get('user_id');

      this.appService.getCurrentRecord(user_id).subscribe(
      (data:any)=>{
        this.current_user = data
      },
      (error:any)=>{
        console.log(error.errorMessage);
      })
    }else{
      this.router.navigate(["/login"])
    }

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
    this.getAll()
   
  }
  getAll(){
    this.appService.getAllRecords().subscribe(
      (data:any)=>{
        this.userData = data
      },
      (error:any)=>{
        console.log("An error occoured")
      }
    )
    
  }

 ///pubload csv into database 
  public records: any[] = [];  
  @ViewChild('csvReader') csvReader: any;  
  
  uploadListener($event: any): void {  
  
    let text = [];  
    let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
  
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  

        if(this.records.length > 0){
          this.importFile(this.records)
        }
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      alert("Please import valid .csv file.");  
      this.fileReset();  
    }  
  }  
  
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
  
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
      if (curruntRecord.length == headerLength) {  
        let csvRecord: CSVRecord = new CSVRecord();  
        csvRecord.first_name = curruntRecord[0].trim();  
        csvRecord.last_name = curruntRecord[1].trim();  
        csvRecord.user_email = curruntRecord[2].trim();  
        csvRecord.user_age = curruntRecord[3].trim();  
        csvArr.push(csvRecord);  
      }  
    }  
    return csvArr;  
  }  
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(',');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  
  
  fileReset() {  
    this.csvReader.nativeElement.value = "";  
    this.records = [];  
  }  

  importFile(records:any):any{
    this.appService.uploadCSV(records).subscribe(
      (data:any)=>{
        console.log("RECORDS"+data)
        this.toastr.success("Records Saved.")
        this.getAll()
      },
      (error:any)=>{
        console.log("Error Occoured.");
      }
    )
  }
  //upload csv ends here


}
