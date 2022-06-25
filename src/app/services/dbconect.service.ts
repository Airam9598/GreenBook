
import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection,getDoc, getDocs, addDoc,setDoc,doc, deleteDoc, query } from "firebase/firestore";
import { getStorage, ref, listAll , uploadString} from "firebase/storage";
import { Ruta } from './Ruta';
import { Flor } from './Flor';
import { CookieService } from "ngx-cookie-service";
import{User}  from './User';
import { HttpClient  } from '@angular/common/http';

const firebaseConfig = {
  apiKey: "AIzaSyCCrrUzGAXswtU-0X-sHbk2UFcIkR3hZQM",
  authDomain: "greenbook-f6fe4.firebaseapp.com",
  projectId: "greenbook-f6fe4",
  storageBucket: "greenbook-f6fe4.appspot.com",
  messagingSenderId: "260743889843",
  appId: "1:260743889843:web:bf016ccce3035f77a581c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const querySnapshot = getDocs(collection(db, "Tareas"));
@Injectable({
  providedIn: 'root'
})
export class DBconectService {
  user:Array<String>=[];
  cookies:CookieService;
  http:any;
  constructor(cookies:CookieService,http:HttpClient) { 
    this.cookies=cookies;
    this.http=http;
  }

  /*AgregarTarea(ruta:Ruta):string{
    try {
      const docRef = addDoc(collection(db, "Tareas") , {
        Titulo: ruta.Titulo,
        Descripcion: ruta.Descripcion,
        Estado: ruta.Estado
      });
      return "agregado correctamente";
    } catch (e) {
      return "Error adding document";
    }
  }*/
/*async ModificarTarea(ruta:Ruta){
  await setDoc(doc(db, "Tareas", ruta.id.toString()), {
    Titulo: ruta.Titulo.toString(),
    Descripcion: ruta.Descripcion.toString(),
    Estado: ruta.Estado.toString(),
  });
}*/

// Get a non-default Storage bucket
async ObtenerImagen(){
  const storage= getStorage(app, "gs://greenbook-f6fe4.appspot.com");
  const listRef = ref(storage, '');

  // Find all the prefixes and items.
  listAll(listRef)
    .then((res) => {
      res.items.forEach((itemRef) => {

      });
    });
    return "hola";
}

async getFlowerid(id:any){
  const querySnapshot = await getDocs(collection(db, "Rutas"));
  let idf="";
  querySnapshot.forEach(async (doc) => {
    if(doc.id==id){
      idf=doc.data()["Flora"];
    }
  });
  return idf;
}

async getFlowerkey(id:any,name:any){
  const querySnapshot = await getDocs(collection(db, "Flora"));
  let idf="";
  await querySnapshot.forEach((doc) => {
    if(doc.id==id){
      for (let index of Object.keys(doc.data())){
        if(doc.data()[index].Name==name){
          idf=index;
        }
      }
      /*data.forEach((item,key)=>{
        if(item.Name==name){
          idf=key;
        }
      })*/
    }
  });
  return idf;
}
async Addflower2(id:string,flower:any){
  const querySnapshot = await getDocs(collection(db, "Flora"));
    await querySnapshot.forEach(async (doc2) => {
      if(doc2.id==id){
        let numflow=Object.keys(doc2.data()).length;
        let data:any="Flora"+numflow;
        let object:any= {};
        let flores:any={}
        for(let flor of flower.Img){
          flores[Object.keys(flores).length]=flor.id;
        }
        object[data]={Name:flower.Name,Description:flower.Description,Img:flores};
        await setDoc(doc(db, "Flora", doc2.id.toString()),object, { merge: true });
      }
    });
}

async Addimagen(id:string,flower:any,pos:any){
  const querySnapshot = await getDocs(collection(db, "Flora"));
    await querySnapshot.forEach(async (doc2) => {
      if(doc2.id==id){
        let object:any= doc2.data();
        let flores=object[pos].Img;
        for(let flor of flower){
          flores[Object.keys(flores).length]=flor.id;
        }
        object[pos].Img=flores;
        await setDoc(doc(db, "Flora", doc2.id.toString()),object, { merge: true });
      }
    });
}
/*AgregarFlor(flor:Flor){
  let names:any ={};
  let i=0;
  for(let name of flor.Img){
    names[i]=name.id;
    i++;
  }
    try {
      const docRef = addDoc(collection(db, "Flora") , {
      Flora0 : {
          Name: flor.Name,
          Description: flor.Description,
          Img:names
        }
      });
      return docRef;
   } catch (e) {
    return null;
  }
}*/



///RUTAS
async ObtenerRutas(data:any=null){
  const querySnapshot = await getDocs(collection(db, "Rutas"));
  let rutas:Array<Ruta> = [];
  await querySnapshot.forEach(async (doc2)=> {
    //let data=doc2.data();    
   /*if(data["Marks"].length >0){
      /*for(let [index,marker] of data["Marks"].entries()){
       // data["Marks"][index]["Flor"][0]["Flor"]=  new Flor((await getDoc(doc(db, 'Flora', marker["Flor"][0].Flor))).id,(await getDoc(doc(db, 'Flora', marker["Flor"][0].Flor))).data());
      }
    }*/
    if(doc2.id.toLocaleLowerCase()!="DEFAULT".toLocaleLowerCase() && data!=null){
      rutas.push(new Ruta(doc2.id,doc2.data()));
    }else if(doc2.id.toLocaleLowerCase()=="DEFAULT".toLocaleLowerCase() && data==null){

    }else{
      rutas.push(new Ruta(doc2.id,doc2.data()));
    }
    
  });

  return rutas;
}

  async ObtenerRuta(id:string){
    let data:any=(await getDoc(doc(db, 'Rutas', id))).data();
    let idlocal=(await getDoc(doc(db, 'Rutas', id))).id
    if(data["Marks"].length>0){
      for(let [index,marker] of data["Marks"].entries()){
        for(let index2 of Object.keys(marker["Flor"])){
            await Promise.resolve(this.ObtenerFlora(marker["Flor"][index2].Flor)).then(items=>{
              data["Marks"][index]["Flor"][index2]["Flor"]=items;
            });
        }
      }
    }
    return new Ruta(idlocal,data);
  }

  async GetRouteData(id:any){
    return await (await getDoc(doc(db, 'Rutas', id))).data();
  }

  async DeleteRuta(idrut:any){
    await deleteDoc(doc(db, "Rutas", idrut));
  }
  async AgregarRuta(ruta:Ruta){
    try {
      let marks:any=[];
      await this.http.get(ruta.Waypoint).subscribe((res:any)=>{
        let latlngs:any = [];
        res.features.forEach((element:any)=>{
          latlngs.push([element.geometry.coordinates[1],element.geometry.coordinates[0]])
        });
        Promise.resolve(this.ObtenerRutas("data")).then(async item=>{
          item.forEach(async ruta=>{
            let marca:any;
            for(marca of ruta.Marks){
              latlngs.forEach(async (geoloc:any)=>{
                if(marca["Lat"]>(geoloc[0]-0.001) && marca["Lat"]<(geoloc[0]+0.001) && marca["Lng"]>(geoloc[1]-0.001) && marca["Lng"]<(geoloc[1]+0.001)){
                if(!marks.includes(marca)){
                  marks.push(marca);
                }
                }
              });
            }
          });
        });
        setTimeout(()=>{
          try {
            const docRef = addDoc(collection(db, "Rutas") , {
              Name: ruta.Name,
              Description: ruta.Description,
              Img:ruta.Img,
              Waypoints:ruta.Waypoint,
              Marks:marks
            });
            return "correct";
          } catch (e) {
            return "Error al añadir";
          }
        },2000)
      })
    } catch (error) {

      setTimeout(()=>{
        this.AgregarRuta(ruta);
      },3000)
      
    }
       /* if(url!=""){
          await this.http.get(url).subscribe((res:any)=>{
            let latlngs:any = [];
            res.features.forEach((element:any)=>{
              latlngs.push([element.geometry.coordinates[1],element.geometry.coordinates[0]])
            });
            latlngs.forEach(async (geoloc:any)=>{
              if(geoloc[0]>(geo["lat"]-0.001) && geoloc[0]<(geo["lat"]+0.001) && geoloc[1]>(geo["lng"]-0.001) && geoloc[1]<(geo["lng"]+0.001)){
                find=true;
                let obj:any={};
                obj["Marks"]=await (await getDoc(doc(db, 'Rutas', ruta.id.toString()))).data();
                obj["Marks"]=obj["Marks"]["Marks"];
                obj["Marks"].push({Flor:[{Flor:idflor,Img:"https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Img-Users%2F"+username+rand+".jpg?alt=media&token=d5561492-ac95-4090-904b-6d5cdfd6d67c",Likes:0,User:username}],Lat:geo["lat"],Lng:geo["lng"]});
                await setDoc(doc(db, "Rutas", ruta.id.toString()), obj, { merge: true }); 
              }
            });
          });
        }
         // console.log(ruta);
        
      });
      if(!find){
        let obj:any={};
        obj["Marks"]=await (await getDoc(doc(db, 'Rutas', "DEFAULT"))).data();
        obj["Marks"]=obj["Marks"]["Marks"];
        obj["Marks"].push({Flor:[{Flor:idflor,Img:"https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Img-Users%2F"+username+rand+".jpg?alt=media&token=d5561492-ac95-4090-904b-6d5cdfd6d67c",Likes:0,User:username}],Lat:geo["lat"],Lng:geo["lng"]});
        await setDoc(doc(db, "Rutas", "DEFAULT"), obj, { merge: true }); 
      }
    });*/
  }

  async ModificarRuta(Name:string,Description:string,file2:any,file:any,id:any){
    let data:any={};
    if(Name!="") data["Name"]=Name;
    if(Description!="") data["Description"]=Description;
    
    if(file2.length>0) data["Img"]="https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Img-Rutas%2F"+file2[0].name+"?alt=media&token=e064b6ad-3835-4dae-a1be-339936df46d3";
    if(file != null) if(file.length>0) data["Waypoints"]="https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Rutas%2F"+file[0].name+"?alt=media&token=669f5652-73d9-4588-a7e6-2191fc7dbb6d";
    await setDoc(doc(db, "Rutas", id), data, { merge: true }); 
    return true;
  }

  //FLORA
  async ObtenerFlora(id:string){
    return new Flor((await getDoc(doc(db, 'Flora', id))).id,(await getDoc(doc(db, 'Flora', id))).data());
  }

  async AgregarFlora(flor:Flor){
    try {
      const docRef = addDoc(collection(db, "Flora") , {
        Name: flor.Name,
        Info: flor.Info,
        Img:flor.Img,
        Type:flor.Type
      });
      return "Agregado correctamente";
    } catch (e) {
      return "Error al añadir";
    }
  }

  async DeleteFlor(idflow:any){

    const querySnapshot = await getDocs(collection(db, "Rutas"));
    await querySnapshot.forEach(async (doc2) => {
      let data=doc2.data();    
      if(data["Marks"].length >0){
        for(let [index,marker] of data["Marks"].entries()){
          for(let index2 of Object.keys(marker["Flor"])){
            if(marker["Flor"][index2].Flor == idflow){
              data["Marks"][index]["Flor"][index2]["Flor"]="";
              setDoc(doc(db, "Flora", doc2.id), data, { merge: true });
            }
          }
        }
      }
    });
    deleteDoc(doc(db, "Flora", idflow));
  }

  async getFlowers(){
    const querySnapshot = await getDocs(collection(db, "Flora"));
    let flowers:Array<Flor>=[];
    await querySnapshot.forEach(async (doc) => {
      flowers.push(new Flor(doc.id,doc.data()));
    });
    return flowers;
  }

  async GetFlowerData(id:any){
    return await (await getDoc(doc(db, 'Flora', id))).data();
  }

  async ModificarFlora(Name:string,Info:string,Tipo:string,file:any,id:any){
    let data:any={};
    if(Name!="") data["Name"]=Name;
    if(Info!="") data["Info"]=Info;
    if(Tipo!="") data["Type"]=Tipo;
    if(file.length>0) data["Img"]="https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Img-Flor%2F"+file[0].name+"?alt=media&token=f03b7cf8-df71-44f2-83f5-c71c95c53a8d";
    await setDoc(doc(db, "Flora", id), data, { merge: true }); 
    return true;
  }

  //FILES

  async Subirrchivo(files:any,files2:any){
    const storage = await getStorage();
    var reader  = new FileReader();
       reader.onload = async (e:any) =>{
        const storageRef = ref(storage,"Rutas/"+files[0].name);
        await uploadString(storageRef, e.target.result, 'data_url').then(snapshot => {
          var reader2  = new FileReader();
          reader2.onload = async (e:any) =>{
            const storageRef = ref(storage,"Img-Rutas/"+files2[0].name);
            await uploadString(storageRef, e.target.result, 'data_url').then(snapshot => {
            });
          }
          reader2.readAsDataURL(files2[0]);
        });
      }
    await reader.readAsDataURL(files[0]);
  }

  async subirImgFlora(files:any){
    const storage = getStorage();
    var reader  = new FileReader();
      reader.onload = async (e:any) =>{
        const storageRef = ref(storage,"Img-Flor/"+files[0].name);
        await uploadString(storageRef, e.target.result, 'data_url').then((snapshot) => {
        });
      }
    await reader.readAsDataURL(files[0]);
  }

  //FOTO

  async photoUpload(idflor:any,geo:any,image:any,username:any,rand:any){
    const storage = getStorage();
        const storageRef = ref(storage,"Img-Users/"+username+rand+".jpg");
        await uploadString(storageRef, image, 'data_url').then((snapshot) => {

          Promise.resolve(this.ObtenerRutas("data")).then(async item=>{
            let find=false;
            item.forEach(async ruta=>{
              const url =ruta.Waypoint;
              if(url!=""){
                await this.http.get(url).subscribe((res:any)=>{
                  let latlngs:any = [];
                  res.features.forEach((element:any)=>{
                    latlngs.push([element.geometry.coordinates[1],element.geometry.coordinates[0]])
                  });
                  latlngs.forEach(async (geoloc:any)=>{
                    if(geoloc[0]>(geo["lat"]-0.001) && geoloc[0]<(geo["lat"]+0.001) && geoloc[1]>(geo["lng"]-0.001) && geoloc[1]<(geo["lng"]+0.001)){
                      find=true;
                      let obj:any={};
                      obj["Marks"]=await (await getDoc(doc(db, 'Rutas', ruta.id.toString()))).data();
                      obj["Marks"]=obj["Marks"]["Marks"];
                      obj["Marks"].push({Flor:[{Flor:idflor,Img:"https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Img-Users%2F"+username+rand+".jpg?alt=media&token=d5561492-ac95-4090-904b-6d5cdfd6d67c",Likes:0,User:username}],Lat:geo["lat"],Lng:geo["lng"]});
                      await setDoc(doc(db, "Rutas", ruta.id.toString()), obj, { merge: true }); 
                    }
                  });
                });
              }
               // console.log(ruta);
              
            });
            if(!find){
              let obj:any={};
              obj["Marks"]=await (await getDoc(doc(db, 'Rutas', "DEFAULT"))).data();
              obj["Marks"]=obj["Marks"]["Marks"];
              obj["Marks"].push({Flor:[{Flor:idflor,Img:"https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Img-Users%2F"+username+rand+".jpg?alt=media&token=d5561492-ac95-4090-904b-6d5cdfd6d67c",Likes:0,User:username}],Lat:geo["lat"],Lng:geo["lng"]});
              await setDoc(doc(db, "Rutas", "DEFAULT"), obj, { merge: true }); 
            }
          })
        
        
        });
  }

  //USUARIOS
  async CheckUsuarios(email:string,pass:string){

    const querySnapshot = await getDocs(collection(db, "Usuarios"));
    let find="";
    let user="";
    querySnapshot.forEach((doc) => {
      if(doc.data()["Email"].trim().toLowerCase()==email.trim().toLowerCase()){
        if(doc.data()["Password"]==pass){
          find="true";
          user=doc.id;
        }else{
          find="Contraseña Incorrecta";
        }
      }
    });
    if (find=="") find="Usuario no encontrado";
    if(find=="true"){
      let token=this.generateToken(32);
          this.setToken(token);
          await setDoc(doc(db, "Usuarios", user.toString()), {
            Token: token
          }, { merge: true });
    }
    return find;
  }

  async GetUser(token:string){
    const querySnapshot = await getDocs(collection(db, "Usuarios"));
    let find!:any;
    if(token != ""){
      querySnapshot.forEach((doc) => {
        if(doc.data()["Token"]==token){
          find=doc.data();
        }
      });
    }
    return find;
  }

  generateToken(n:any) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token = '';
    for(var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
  }

  setToken(token: string) {
    this.deleteToken();
    this.cookies.set("token", token);
  }
  getToken() {
    return this.cookies.get("token");
  }
  deleteToken(){
    this.cookies.delete("token");
  }

  async closesesion(){
      const querySnapshot = await getDocs(collection(db, "Usuarios"));
      let find!:any;
      if(this.getToken()!=""){
        querySnapshot.forEach((doc) => {
          if(doc.data()["Token"]==this.getToken()){
            find=true;
            this.user.push(doc.id);
          }
        });
      }
      
      if(find){
        let token=this.generateToken(32)
            this.setToken(token);
            await setDoc(doc(db, "Usuarios", this.user[0].toString()), {
              Token: ""
            }, { merge: true });
      }
      this.deleteToken();
  }

  async getUserImages(user:any){
    let Arrimg:any=[];
    const querySnapshot = await getDocs(collection(db, "Rutas"));
       await querySnapshot.forEach((doc2) => {
          if(doc2.data()["Marks"].length >0){
            doc2.data()["Marks"].forEach((item:any)=>{
              item.Flor.forEach((item2:any)=>{
                if(item2.User==user){
                  let exists=false
                  Arrimg.forEach((element:any)=>{
                    if(element.Img==item2.Img && element.Flor==item2.Flor && element.User==item2.User) exists=true;
                  })
                  if(!exists){
                    item2["Ruta"]=doc2.id;
                    item2["NameRuta"]=doc2.data()["Name"];
                    Arrimg.push(item2);
                  }
                  
                }
              });
            })
          }
        });
        return Arrimg;
  }

  async RegistrarUsuario(email:string,pass:string,user:string){

    try {
      const querySnapshot = await getDocs(collection(db, "Usuarios"));
      let find="";
      await querySnapshot.forEach((doc) => {
        if(doc.data()["Email"].trim().toLowerCase()==email.trim().toLowerCase()){
            find="El correo ya existe";
        }else if(doc.data()["UserName"].trim().toLowerCase()==("@"+user.trim()).toLowerCase()){
          find="El usuario ya existe";
        }
      });
      if (find==""){
        const docRef = addDoc(collection(db, "Usuarios") , {
            UserName: "@"+user,
            Email: email,
            Password:pass,
            Admin:false,
            Token:'',
            Likes:{}
        });
        return "true";
      }else{
        return find;
      }
    } catch (e) {
      return "Error al registrar";
    }
  }

  async ModificarUsuario(email:string,pass:string,user:string,admin:any,id:any){
    let data:any={};
    if(user!="") data["UserName"]=user;
    if(email!="") data["Email"]=email;
    if(pass!="") data["Password"]=pass;
    if(admin!="") data["Admin"]=admin;
    await setDoc(doc(db, "Usuarios", id), data, { merge: true }); 
    return true;
  }

  async getUsers(){
    const querySnapshot = await getDocs(collection(db, "Usuarios"));
    let users:Array<User>=[];
    await querySnapshot.forEach(async (doc) => {
      await Promise.resolve(this.getUserImages(doc.data()["UserName"])).then(items=>{
        users.push(new User(doc.id,doc.data()["UserName"],items,doc.data()["Likes"],doc.data()["Admin"]));
      })
    });
    return users;
  }

  async Changepass(iduser:string,pass:any){
    try {
      const querySnapshot = await getDocs(collection(db, "Usuarios"));
      await querySnapshot.forEach(async (doc2) => {
        if(doc2.data()["Email"]==iduser){
          await setDoc(doc(db, "Usuarios",doc2.id), {
            Password: pass
          }, { merge: true });
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async DeleteUser(id:any){
    await deleteDoc(doc(db, "Usuarios", id));
  }

  async GetUserData(id:any){
    return await (await getDoc(doc(db, 'Usuarios', id))).data();
  }
  
 /* async getImages(id:any,data:any){
   let imagenes:Array<FLowerImage>=[];
    const q = query(collection(db, "Imagenes"));
    const allimages = await getDocs(q);
    allimages.docs.forEach(element=>{
     Object.values(data["Img"]).forEach(image=>{
        if(element.id==image){
          imagenes.push(new FLowerImage(element.id,element.data()));
        }
      });
      //imagenes.push(new FLowerImage(element.id,element.data()));
    });
    return new Flor(id,data,imagenes);

  }*/



  async LikeImage(iduser:string,idimage:string,number:number){
    const querySnapshot = await getDocs(collection(db, "Usuarios"));
    await querySnapshot.forEach(async (doc2) => {
      if(doc2.data()["Email"]==iduser){
        let numlike=doc2.data()["Likes"];
        if(numlike[Object.keys(numlike).length-1]==""){
          numlike[Object.keys(numlike).length-1]=idimage;
        }else{
          numlike[Object.keys(numlike).length]=idimage;
        }
        await setDoc(doc(db, "Imagenes", idimage), {
          Likes: number
        }, { merge: true });
        await setDoc(doc(db, "Usuarios", doc2.id), {
          Likes: numlike
        }, { merge: true });
      }
    });
  }


  async UnLikeImage(iduser:string,idimage:string,key:string,number:number){
    const querySnapshot = await getDocs(collection(db, "Usuarios"));
    await querySnapshot.forEach(async (doc2) => {
      if(doc2.data()["Email"]==iduser){
        let numlike=doc2.data()["Likes"];
        numlike[key]="";
        await setDoc(doc(db, "Usuarios", doc2.id), {
          Likes: numlike
        }, { merge: true });

        await setDoc(doc(db, "Imagenes", idimage), {
          Likes: number
        }, { merge: true });
      }
    });
  }



  async Deleteimage(id:any,idflow:any,name:any){
    await deleteDoc(doc(db, "Imagenes", id));
    getDoc(doc(db, 'Flora', idflow)).then((item:any)=>{
      let data=item.data();
      Object.keys(data).forEach((key2:any)=>{
        if(data[key2]["Name"]==name){
          //data[key]="";
          let data2=data[key2]["Img"];
          Object.keys(data2).forEach((key:any)=>{
            if(data2[key]==id){
              data2[key]="";
            }
          });
          let result:any={};
          result[key2]={Img:data2};
          setDoc(doc(db, "Flora", idflow), result, { merge: true });
        }
      });
    })
    
  }

}
