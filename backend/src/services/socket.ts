import {Server} from 'socket.io'

class SocketService{
    private _io:Server;

    constructor(){
        console.log("Init Socket server");
        this._io=new Server();
    }

    get io(){
        return this._io;
    }

    public initListeners(){
        console.log('Init Socket Listeners...')
        const io=this.io;
        io.on("connect",(socket)=>{
            console.log('New Socket Connected',socket.id);


            socket.on('event:message',async({message}:{message:string})=>{
                console.log("new Message Recieved")
            })
        })
    }
}

export default SocketService;