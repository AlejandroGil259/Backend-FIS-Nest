import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuarios.entity";
import { Notificacion } from "../../notificaciones/entities/notificacion.entity";


@Entity( 'usuarios_notificaciones' )
export class UsuariosNotificaciones {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne( () => Usuario, ( usuario ) => usuario.recibirNotificaciones )
    usuarioReceptor: Usuario;

    @ManyToOne( () => Usuario, ( usuario ) => usuario.enviarNotificaciones )
    usuarioDocumento: Usuario;

    @ManyToOne(
        () => Notificacion,
        ( notificacion ) => notificacion.usuariosNotificaciones,
    )
    notificaciones_id: string;
}