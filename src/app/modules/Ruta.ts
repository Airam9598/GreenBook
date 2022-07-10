
import { Timestamp } from "firebase/firestore";
export class Ruta{
    id!:String;
    Name!:String;
    Description!:String;
    Img!:String;
    Waypoint!:String;
    Marks!:Array<Object>;
    Fecha!:Timestamp;
    constructor(id:any,ruta:any){
        this.id=id;
        this.Name =ruta["Name"];
        this.Description =ruta["Description"];
        this.Waypoint=ruta["Waypoints"];
        this.Img=ruta["Img"];
        this.Marks=ruta["Marks"];
        this.Fecha=ruta["Fecha"];
    }
}