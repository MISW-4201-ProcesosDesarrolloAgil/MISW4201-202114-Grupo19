import { Component, OnInit } from '@angular/core';
import { Cancion, Genero } from '../cancion';
import { CancionService } from '../cancion.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ThrowStmt } from '@angular/compiler';
import { GENEROS_CANCION } from '../cancion.constants';

@Component({
  selector: 'app-cancion-list',
  templateUrl: './cancion-list.component.html',
  styleUrls: ['./cancion-list.component.css']
})
export class CancionListComponent implements OnInit {

  constructor(
    private cancionService: CancionService,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  userId: number
  token: string
  canciones: Array<Cancion>
  mostrarCanciones: Array<Cancion>
  cancionSeleccionada: Cancion
  indiceSeleccionado: number = 0

  cancionesFiltered: Array<Cancion>
  generoSeleccionado: string = 'TODAS'
  cancionSeleccionda: string
  tipoFiltroCancion: string
  textoIngresadoBuscador: string

  filteredCanciones: Cancion[] = []
  busqueda: string = ''
  filteredSongs: Cancion[] = []
  generos: Array<Genero> = [
    {
      llave: "TODAS", valor: 0
    },
    ...GENEROS_CANCION
  ];

  onChangeGenre(event: any) {
    this.generoSeleccionado = event.target.value
    this.tipoFiltroCancion = "xGenero"
    this.buscarCancion(this.generoSeleccionado ? this.generoSeleccionado : "TODAS")

  }

  onChangeSong(event: any) {
    this.cancionSeleccionada = event.target.value
    this.tipoFiltroCancion = "xTitulo"
    this.buscarCancion(this.cancionSeleccionada)
  }

  onKey(event: any) {
    this.textoIngresadoBuscador = event.target.value
    console.log("ingresando a filtro por texto")
    console.log(this.textoIngresadoBuscador)
    console.log(this.generoSeleccionado)
    let cancionBusqueda: any
    if (this.textoIngresadoBuscador !== '' && this.generoSeleccionado !== 'TODAS') {
      cancionBusqueda = this.canciones.filter(cancion => cancion.titulo.toLocaleLowerCase().includes(this.textoIngresadoBuscador.toLocaleLowerCase()) && (cancion.genero === this.generoSeleccionado));
      this.cancionesFiltered = cancionBusqueda
    }
    else if (this.textoIngresadoBuscador !== '' && this.generoSeleccionado === 'TODAS') {
      cancionBusqueda = this.canciones.filter(cancion => cancion.titulo.toLocaleLowerCase().includes(this.textoIngresadoBuscador.toLocaleLowerCase()));
      this.cancionesFiltered = cancionBusqueda
    }
    else {
      this.cancionesFiltered = this.canciones
    }
  }

  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.getCanciones();
    }
  }

  getCanciones(): void {
    this.cancionService.getCanciones()
      .subscribe(canciones => {
        this.canciones = canciones
        this.canciones = this.canciones.sort((a, b) => (a.titulo < b.titulo ? -1 : 1))
        this.cancionesFiltered = canciones
      })
  }

  onSelect(cancion: Cancion, indice: number) {
    this.indiceSeleccionado = indice
    this.cancionSeleccionada = cancion
    this.cancionService.getAlbumesCancion(cancion.id)
      .subscribe(albumes => {
        this.cancionSeleccionada.albumes = albumes
      },
        error => {
          this.showError(`Ha ocurrido un error: ${error.message}`)
        })

  }

  buscarCancion(busqueda: any) {
    let cancionesBusqueda: Array<Cancion> = []

    if (this.generoSeleccionado !== "" && this.tipoFiltroCancion === "xGenero") {
      console.log("comenzando busqueda por genero")
      this.canciones.map(cancion => {
        if (cancion.genero == this.generoSeleccionado) {
          cancionesBusqueda.push(cancion)
        }
        else if (this.generoSeleccionado == 'TODAS') {
          cancionesBusqueda = this.canciones
        }
      })
      this.cancionesFiltered = cancionesBusqueda
    }
    else if (this.cancionSeleccionada && this.tipoFiltroCancion === "xTitulo") {
      console.log("comenzando busqueda por cancion")
      let _cancionBuscada: any = this.cancionSeleccionada
      cancionesBusqueda = this.canciones.filter(cancion => cancion.titulo === _cancionBuscada)
      this.cancionesFiltered = cancionesBusqueda
    }
    console.log(this.cancionesFiltered)
  }

  eliminarCancion() {
    this.cancionService.eliminarCancion(this.cancionSeleccionada.id)
      .subscribe(cancion => {
        this.ngOnInit()
        this.showSuccess()
      },
        error => {
          this.showError("Ha ocurrido un error. " + error.message)
        })
  }

  irCrearCancion() {
    this.routerPath.navigate([`/canciones/create/${this.userId}/${this.token}`])
  }

  showError(error: string) {
    this.toastr.error(error, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`La canción fue eliminada`, "Eliminada exitosamente");
  }

}

