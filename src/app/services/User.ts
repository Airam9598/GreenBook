import { FLowerImage } from "./FlowerImges";

export class User{
    id!:String;
    UserName!:String;
    Img!:FLowerImage;
    Likes!:Object;
    Admin!:boolean
    constructor(id:any,UserName:any,images:any,likes:any,admin:boolean){
        this.id=id;
        this.UserName =UserName;
        this.Img=images;
        this.Likes=likes;
        this.Admin=admin;
        if(images==null){
            this.Img=new FLowerImage("",{Img:"defaut.jpg",Likes:"",User:UserName})
        }
       
    }
}