import { ConnectedSocket, MessageBody, OnDisconnect, OnMessage, SocketController,SocketIO } from "socket-controllers";
import { Socket, Server } from "socket.io";

@SocketController()
export class RoomController{
    rooms:any={}
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
            this.rooms[socket.id]=message.roomId;
            if(io.sockets.adapter.rooms.get(message.roomId).size===2){

                let letters = [{letters: ['S','C','A','R','I','A','T','C','O'], words: ['COSTARICA','ACROSTICA','SOCRATICA','TORACICAS']}, {letters: ['S','O','R','A','C'], words: ['OSCAR','ARCOS','CAROS','ROCAS','ROSCA','SACRO']}, {letters: ['L','A','R','C','A'], words: ['CARLA','CALAR','CLARA','LACAR','LACRA']}, {letters: ['S','E','N','E','T','R','O'], words: ['ERNESTO','ENTEROS','ESTRENO','ETERNOS']}, {letters: ['A','N','R','E','D','O','F','N'], words: ['FERNANDO','FRENANDO','OFRENDA']}];
                let random = letters[Math.floor(Math.random() * letters.length)]
                socket.emit('start_game',{letters:random.letters,words:random.words});
                socket.to(message.roomId).emit('start_game',{letters:random.letters,words:random.words});
            }
        }
    }
    @OnDisconnect()
    public onDisconnect(@ConnectedSocket() socket:Socket,@SocketIO() io:Server){
        console.log(`Me desconecté: ${socket.id}, ${this.rooms[socket.id]}`);
        io.to(this.rooms[socket.id]).emit('player_discconect','Su oponente perdió la desconexión');
    }
}