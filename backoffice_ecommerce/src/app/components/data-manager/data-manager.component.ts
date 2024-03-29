import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/helpers/routes';
import { actions } from 'src/app/helpers/actions';
import { formatToCamelcase } from 'src/app/helpers/util';
import { EntityService } from 'src/app/services/entity.service';
import { getEntityProperties } from 'src/app/helpers/helpers';
import { WebNotificationService } from 'src/app/services/web-notification.service';
import { NotificationModel } from 'src/app/models/notification-model';




@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
  styleUrls: ['./data-manager.component.css']
})
export class DataManagerComponent implements OnInit {

entity: any;
  entityId: any;
  pageName: any;
  action: any;
  entityNamesAll: any;
  data:any;
  result:any;
  routes: Array<any> = routes
  actions: Array<String> = actions

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entityService: EntityService,
    private notificationService:WebNotificationService

    ){}


  ngOnInit(): void {
  
    window.scrollTo(0,0)
    const urls = this.route.snapshot.url
    if(urls.length < 3){
      this.router.navigate(["/error"])
    }
    this.entity = urls[0]?.path
    this.entityId = urls[1].path
    this.action = urls[2].path
    
    const isEntityExist = routes.filter((route: any)=> route.path === "/"+this.entity)
    if(!isEntityExist || !isEntityExist[0]){
      this.router.navigate(["/error"])
    }

    if(!this.actions.includes(this.action)){
      this.router.navigate(["/error"])
    }    

    const routeObject:any=this.routes.filter(route =>route.path === "/"+this.entity)
    if(routeObject[0]){
      this.pageName= formatToCamelcase(this.action)+" "+ routeObject[0]?.single
    }
    this.entityNamesAll = getEntityProperties(this.entity)
    this.getDataById();
  }

  getDataById(){
    this.entityService.getDataById(this.entity,this.entityId).subscribe({
      next:(value:any)=>{
        console.log(value)
        this.result=value
        this.data=value.result
      },
      error:(error:any)=>{
        console.log(error)
      }
    })
  }

  getValue(name:any){
    return this.data[name]
  }

  handleFormChange(data:any){
    let formData:any={};
    const entity:any=this.entity

    if(data?.files && !data?.files?.length){
      const files=data.files
      delete data.files
      formData=new FormData()
      formData.append([entity],JSON.stringify(data))
        files.filter((fileItem:any)=>fileItem.action !== "DELETE").forEach((fileItem:any)=>{
          formData.append("file",fileItem.file)
      })

        const deleteFiles=files.filter((fileItem:any)=> ["DELETE","UPDATE"].includes(fileItem.action))
        .map((fileItem:any)=>fileItem.oldImage)

        formData.append("deleteFiles",JSON.stringify(deleteFiles))
    }else{
      formData[entity]=data
    }

    if(formData){
      console.log(formData)
      this.entityService.updateData(this.entity,this.entityId,formData).subscribe({

        next:(value:any)=>{
          console.log(value);
          const notif=new NotificationModel()
          notif.message="Update success"
          notif.status="success"
          this.notificationService.emitNotification(notif)
        },
        error:(error:any)=>{
        const notif=new NotificationModel()
          notif.message="Update error"
          notif.status="danger"
          this.notificationService.emitNotification(notif)
      }
      })
    }
  }

}