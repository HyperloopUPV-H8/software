//Implementa un filtro para que si un mensaje es igual
//  a uno anterior, no se muestre.

//Existen dos tipos de mensajes:
//Boundaries: envían un nombre de variable, un valor límite y el valor actual. 
// Si el valor actual es diferente del último enviado, debe mostrarse siempre.

//ErrorHandler & InfoWarning: estos mensajes son básicamente un string. 
// Se deben filtrar si el mensaje es igual al último o si es igual dentro de un marco temporal 
// (cómo implementar este filtro queda a tu criterio).

//debo:
//1ro: identificar el tipo de mensaje, si es BOUNDARY o ERRORHANDLER
//si es el 1ro => comparar el valor actual de este tipo con el ultimo valor de este tipo => diferente = se muestra SIEMPRE
//si es el 2do => comparar el string con el ultimo recibido: igual y dentro de un t<10s = no se muestra, else = mostrarlo

import { Message, Protection } from "../../../../models/Message";

export function filterMessages (messages: Message[]): Message[]{
        const filtered: Message[] = []; //array de msg filtrados
        const lastMessageName = new Map <string, Message>();
        for (const msg of messages){
            const last = lastMessageName.get(msg.name); //obtengo el ultimo msg 
            //2do caso
            //comprobamos si el msg actual NO es boundaries => vemos si el msg es de alguno de estos tipos que contienen texto (ProtectionMessage)
            if (msg.kind == "warning" || msg.kind == "fault" || msg.kind == "ok"){
                if (!last || last.payload !== msg.payload){ //evalua si el payload (contenido) es igual al ultimo recibido
                    filtered.push(msg); //se añade al array
                    lastMessageName.set(msg.name, msg); //actualiza last con el nuevo valor
                }
            }else{
                //1er caso => es boundary
                if (!last || JSON.stringify((last.payload as unknown as Protection)) !== JSON.stringify((msg.payload as unknown as Protection).data)){ //como payload es del tipo boundary hay que tratarlo con Protection, antes le pongo 'unknown' xq si no lanza error sl hacer la conversion antes
                    filtered.push(msg); //se añade al array
                    lastMessageName.set(msg.name, msg); //actualiza con el ultimomensaje
                }
            }
        }
    return filtered;
}