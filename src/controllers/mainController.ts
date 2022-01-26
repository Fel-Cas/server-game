import { ConnectedSocket, OnConnect, SocketController, SocketId, OnDisconnect, SocketIO} from "socket-controllers";
import { Server, Socket } from "socket.io";
import socket from "../socket";

@SocketController()
export  class MainController{
    @OnConnect()
    public onConnection(@ConnectedSocket() socket:Socket, @SocketId() io:Server){
        console.log(`Nuevo usuario conectado: ${socket.id}`);
        socket.on('custom_event',(data:any)=>{
            console.log(data);
        })
    }  
}