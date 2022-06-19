
export class Flor{
    id!:String;
    Name!:String;
    Info!:String;
    Img!:String;
    Type!:String;
    constructor(id:any,flor:any){
        this.id=id;
        this.Name =flor["Name"];
        this.Info =flor["Info"];
        this.Img=flor["Img"];
        this.Type=flor["Type"];
    }
}