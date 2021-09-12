export class CancionFavorita {
  id: number;
  id_cancion: number;
  id_usuario: number;

  constructor(
      id: number,
      id_cancion: number,
      id_usuario: number

  ){
      this.id = id,
      this.id_cancion = id_cancion,
      this.id_usuario = id_usuario
  }
}
