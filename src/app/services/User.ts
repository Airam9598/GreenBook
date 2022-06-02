import { FLowerImage } from "./FlowerImges";

export class User{
    id!:String;
    UserName!:String;
    Img!:FLowerImage;
    Likes!:Object;
    constructor(id:any,UserName:any,images:any,likes:any){
        this.id=id;
        this.UserName =UserName;
        this.Img=images;
        this.Likes=likes;
        if(images==null){
            this.Img=new FLowerImage("",{Img:"defaut.jpg",Likes:"",User:UserName})
        }
       
    }
}