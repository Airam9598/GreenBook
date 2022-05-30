import { DBconectService } from "./dbconect.service";
import { FLowerImage } from "./FlowerImges";

export class Flor{
    id!:String;
    Name!:String;
    Description!:String;
    img!:String;
    Img!:Array<FLowerImage>;
    constructor(id:any,flor:any,images:any){
        this.id=id;
        this.Name =flor["Name"];
        this.Description =flor["Description"];
        this.img ="https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/"+flor["img"]+"?alt=media&token=78fff392-933a-4b63-8d90-2ed735d54b91";
        this.Img=images;
    }
}