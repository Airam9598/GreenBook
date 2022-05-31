import { FLowerImage } from "./FlowerImges";

export class User{
    id!:String;
    UserName!:String;
    Img!:FLowerImage;
    constructor(id:any,UserName:any,images:any){
        this.id=id;
        this.UserName =UserName;
        this.Img=images;
        if(images==null){
            this.Img=new FLowerImage("",{Img:"defaut.jpg",Likes:"",User:UserName})
        }
       
    }
}