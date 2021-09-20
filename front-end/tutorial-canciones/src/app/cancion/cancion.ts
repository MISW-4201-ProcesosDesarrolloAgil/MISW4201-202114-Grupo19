export class Cancion {
    id: number;
    titulo: string;
    minutos: number;
    segundos: number;
    interprete: string;
    favorita: number;
    genero: Genero;
    albumes: Array<any>

    constructor(
        id: number,
        titulo: string,
        minutos: number,
        segundos: number,
        interprete: string,
        favorita: number,
        genero: Genero,
        albumes: Array<any>
    ){
        this.id = id,
        this.titulo = titulo,
        this.minutos = minutos,
        this.segundos = segundos,
        this.interprete = interprete,
        this.favorita = favorita,
        this.genero = genero,
        this.albumes = albumes
    }
}


export class Genero{
  llave: string;
  valor: number

  constructor(
      llave: string,
      valor:number
  ){
      this.llave = llave,
      this.valor = valor
  }
}
