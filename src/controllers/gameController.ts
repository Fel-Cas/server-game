import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { Socket, Server } from "socket.io";

@SocketController()
export class GameController{
    private getSocketGameRoom(socket:Socket):string{
        let socketRooms=Array.from(socket.rooms.values()).filter(r=> r!==socket.id);
        let gameRoom=socketRooms && socketRooms[0];
        return gameRoom;
    }
    @OnMessage('correct_word')
    public async correctWord(@SocketIO() io:Server, @ConnectedSocket() socket:Socket, @MessageBody() message:any){
        let gameRoom=this.getSocketGameRoom(socket);
        socket.to(gameRoom).emit('on_correct_word',message);
    }
}