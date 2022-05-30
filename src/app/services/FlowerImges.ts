

export class FLowerImage{
    id!:String;
    User!:String;
    Like!:String;
    Img!:String;
    constructor(id:any,image:any){
        this.id=id;
        this.User =image["User"];
        this.Like =image["Likes"];
        this.Img ="https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/"+image["Img"]+"?alt=media&token=78fff392-933a-4b63-8d90-2ed735d54b91";
    }
}