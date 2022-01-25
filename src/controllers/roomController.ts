import { ConnectedSocket, MessageBody, OnMessage, SocketController,SocketIO } from "socket-controllers";
import { Socket, Server } from "socket.io";

@SocketController()
export class RoomController{
    @OnMessage('joined_room')
    public async joinGame(@SocketIO() io:Server, @ConnectedSocket() socket:Socket, @MessageBody() message:any){
        console.log(`Nuevo usuario uniendose a la sala: `,message);
        let connectedSocket=io.sockets.adapter.rooms.get(message.roomId);
        let socketRooms=Array.from(socket.rooms.values()).filter((r)=> r!==socket.id);
        if(socketRooms.length>0 || connectedSocket && connectedSocket.size===2){
            socket.emit('room_joined_error',{
                error:'Sala llena, por favor escoge otra sala para jugar'
            });
        }else{
            await socket.join(message.roomId);
            socket.emit('room_joined');
            if(io.sockets.adapter.rooms.get(message.roomId).size===2){

                
                socket.emit('start_game',{letters:['S','C','A','R','I','A','T','C','O'],words:['COSTARICA','ACROSTICA','SOCRATICA','TORACICAS']});
                socket.to(message.roomId).emit('start_game',{letters:['S','C','A','R','I','A','T','C','O'],words:['COSTARICA','ACROSTICA','SOCRATICA','TORACICAS']});
            }
        }
    }
}