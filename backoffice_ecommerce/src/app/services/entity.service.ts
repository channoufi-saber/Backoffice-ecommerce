import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private http:HttpClient) { }

  getDatas(entityName:String){
    return this.http.get(environment.apiUrl+entityName)
  }

  getDataById(entityName:String,id:String){
    return this.http.get(environment.apiUrl+entityName+"/"+id)
  }

  getDatasByPage(entityName:String,pageNumber:Number,pageLimit:Number){
    return this.http.get(environment.apiUrl+entityName+"/by/page?pageNumber="+pageNumber+"&pageLimit="+pageLimit)
  }

   searchDataByPage(entityName:String,query:String,pageNumber:Number,pageLimit:Number){
    return this.http.get(environment.apiUrl+entityName+"/search?"+query+"&pageNumber="+pageNumber+"&pageLimit="+pageLimit)
  }

  updateData(entityName:String,entityId:String,data:any){
    return this.http.put(environment.apiUrl+entityName+"/"+entityId,data)
  }
}
