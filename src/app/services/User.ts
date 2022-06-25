
export class User{
    id!:String;
    UserName!:String;
    Img!:any;
    Likes!:Object;
    Admin!:boolean
    constructor(id:any,UserName:any,images:any,likes:any,admin:boolean){
        this.id=id;
        this.UserName =UserName;
        this.Img=images;
        this.Likes=likes;
        this.Admin=admin;
        if(images.length==0){
            this.Img=[{Img:"https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Img-Rutas%2Fdefaut.jpg?alt=media&token=06513a36-f8f5-4e57-ba38-f4c546af89b5",Likes:0,User:UserName}];
        }
       
    }
}