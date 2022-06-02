import { TEMPORARY_NAME } from '@angular/compiler/src/render3/view/util';
import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, addDoc,setDoc,doc, deleteDoc, query } from "firebase/firestore";
import { getStorage, ref, listAll , uploadString} from "firebase/storage";
import { Ruta } from './Ruta';
import { Flor } from './Flor';
import { FLowerImage } from './FlowerImges';
import { CookieService } from "ngx-cookie-service";
import{User}  from './User';

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
  subiendo:boolean=false;
  user:Array<String>=[];
cookies:CookieService;
  constructor(cookies:CookieService) { 
    this.cookies=cookies;
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

async AgregarRuta(ruta:Ruta,flor:Flor,files:any,random:any,user:any){
  let arra:Array<FLowerImage>=[];
  for(let file of files){
    await this.AgregarImagen(new FLowerImage("",{User:user,Likes:0,Img:random+file.name}),random+file.name)?.then(item=>{
      arra.push(new FLowerImage(item.id,{User:user,Likes:0,Img:random+file.name}))
    }) 
  }
  flor.Img=arra;
  await this.AgregarFlor(flor)?.then(item=>{
    try {
      const docRef = addDoc(collection(db, "Rutas") , {
        Name: ruta.Name,
        Description: ruta.Description,
        Flora: item.id
      });
      return "agregado correctamente";
    } catch (e) {
      return "Error adding document";
    }
  });
}

AgregarFlor(flor:Flor){
  let names:any ={};
  let i=0;
  for(let name of flor.Img){
    names[i]=name.id;
    i++;
  }
    try {
      const docRef = addDoc(collection(db, "Flora") , {
      Flora1 : {
          Name: flor.Name,
          Description: flor.Description,
          Img:names
        }
      });
      return docRef;
   } catch (e) {
    return null;
  }
}

AgregarImagen(flower:FLowerImage,name:string){
  try {
    const docRef = addDoc(collection(db, "Imagenes") , {
        User: flower.User,
        Likes: flower.Like,
        Img:name
    });
    return docRef;
  } catch (e) {
    return null;
  }
}

Subirrchivo(files:any,random:any){
  const storage = getStorage();
  let valores=0;
  this.subiendo=true;
  for(let file of files){
    var reader  = new FileReader();
    reader.onload = (e:any) =>{
      const storageRef = ref(storage,random+file.name);
      uploadString(storageRef, e.target.result, 'data_url').then((snapshot) => {
        valores++;
        if(valores>= files.length-1){
          this.subiendo=false;
        }
      });
    }
    reader.readAsDataURL(file);
  }
}


async ObtenerRutas(){
  const querySnapshot = await getDocs(collection(db, "Rutas"));
  let rutas:Array<Ruta> = [];
  querySnapshot.forEach(async (doc) => {

    if(doc.data()["Flora"]!=null){
      let data;
      await Promise.resolve(this.ObtenerFlora(doc.data()["Flora"])).then(items=>{
          data=doc.data();
          data["Flora"]=items;
          rutas.push(new Ruta(doc.id,data));
        });
    }
  });
  return rutas;
}

  async ObtenerRuta(id:string){
    const querySnapshot = await getDocs(collection(db, "Rutas"));
    let ruta:Ruta=new Ruta("","");
    let data!:any;
    let idlocal!:String;
    querySnapshot.forEach((doc) => {
      if(doc.id==id){
        data=doc.data();
        idlocal=doc.id;
      }
    });
    if(data["Flora"]!=null){
      await Promise.resolve(this.ObtenerFlora(data["Flora"])).then(items=>{
          data["Flora"]=items;
          ruta=new Ruta(idlocal,data);
        });
    }
    return ruta;
  }

  async ObtenerFlora(id:string){
    const querySnapshot = await getDocs(collection(db, "Flora"));
    let flores:Array<Flor>=[];
    let idflor:string="";

    querySnapshot.forEach((doc) => {
      if(doc.id==id){
        idflor=doc.id;
        Object.values(doc.data()).forEach(element=>{
          Promise.resolve(this.getImages(doc.id,element)).then(items=>{
            flores.push(items);
          });
        });
      }
    });
    /*const q = query(collection(db, "Flora/"+idflor+"/Flora1"));
    const allflowers = await getDocs(q);
    allflowers.docs.forEach(element=>{
      Promise.resolve(this.getImages(element.id,element.data(),"Flora/"+idflor+"/Flora1")).then(items=>{
        flores.push(items);
      });
    });*/
    return flores;
  }

  
  async getImages(id:any,data:any){
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

  }


  //USUARIOS

  async CheckUsuarios(email:string,pass:string){

    const querySnapshot = await getDocs(collection(db, "Usuarios"));
    let find="";
    querySnapshot.forEach((doc) => {
      if(doc.data()["Email"].trim().toLowerCase()==email.trim().toLowerCase()){
        if(doc.data()["Password"]==pass){
          find="true";
          this.user.push(doc.id);
        }else{
          find="Contraseña Incorrecta";
        }
      }
    });
    if (find=="") find="Usuario no encontrado";
    if(find=="true"){
      let token=this.generateToken(32)
          this.setToken(token);
          await setDoc(doc(db, "Usuarios", this.user[0].toString()), {
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
    const querySnapshot = await getDocs(collection(db, "Imagenes"));
      let images:Array<FLowerImage>=[];
        querySnapshot.forEach((doc) => {
          if(doc.data()["User"]==user){
            images.push(new FLowerImage(doc.id,doc.data()));
          }
        });
        return images;
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

  async getUsers(){
    const querySnapshot = await getDocs(collection(db, "Usuarios"));
    let users:Array<User>=[];
    await querySnapshot.forEach(async (doc) => {
      await Promise.resolve(this.getUserImages(doc.data()["UserName"])).then(items=>{
        users.push(new User(doc.id,doc.data()["UserName"],items[0],doc.data()["Likes"]));
      })
    });
    return users;
  }

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





}
