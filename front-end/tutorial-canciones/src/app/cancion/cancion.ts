export class Cancion {
    id: number;
    titulo: string;
    minutos: number;
    segundos: number;
    interprete: string;
    favorita: number;
    albumes: Array<any>

    constructor(
        id: number,
        titulo: string,
        minutos: number,
        segundos: number,
        interprete: string,
        favorita: number,
        albumes: Array<any>
    ){
        this.id = id,
        this.titulo = titulo,
        this.minutos = minutos,
        this.segundos = segundos,
        this.interprete = interprete,
        this.favorita = favorita,
        this.albumes = albumes
    }
}
