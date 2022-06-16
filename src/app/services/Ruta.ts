
import { Flor } from "./Flor";
export class Ruta{
    id!:String;
    Name!:String;
    Description!:String;
    Flora!:Array<Flor>;
    img!:String;
    Waypoint!:String;
    constructor(id:any,ruta:any){
        this.id=id;
        this.Name =ruta["Name"];
        this.Description =ruta["Description"];
        this.Flora=ruta["Flora"];
        this.Waypoint=ruta["Waypoints"];
       /* if(ruta["Flora"]!=null){
            Promise.resolve(db.ObtenerFlora(ruta["Flora"])).then(items=>{
                this.flora=items;
              });
        }*/
       /* Promise.resolve(db.ObtenerImagen()).then(items=>{
            console.log(items);
          });
        //gs://greenbook-f6fe4.appspot.com/ruta["img"]
        this.img =ruta["img"];*/
    }
}