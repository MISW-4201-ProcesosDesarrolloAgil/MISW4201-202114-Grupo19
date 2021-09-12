import { Component, OnInit } from '@angular/core';
import { Cancion } from '../cancion';
import { CancionService } from '../cancion.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  scroll: boolean;
  fixedStyle: object = {"position": "fixed"};
  display: object = {"display": "none"};
  sub: Subscription;
  artists: string[];
  labels: string[];
  filteredSongs: Cancion[] = [];
  filterValues: { [filter: string]: string } = {
    artist: "",
    genre: "",
    label: ""
  };
  openForm: boolean = false;

  private _labelFilter: string;
  get labelFilter(): string {
    return this._labelFilter;
  }
  set labelFilter(value: string) {
    this._labelFilter = value;
    this.filterValues.label = value
    this.filteredSongs = this.performFilters();
  }

  performFilters(): Cancion[] {
    let canciones: Cancion[] = []

    if (this.filterValues.label === "") {
      return canciones = this.canciones;
    }

    if (this.filterValues.label !== "") {
      this.performLabelFilter().forEach(x=> canciones.push(x));
    }

    return [...new Set(canciones)].sort((a, b) => (a.titulo < b.titulo ? -1 : 1));
  }

  performLabelFilter(): Cancion[] {
    return this.canciones.filter((cancion: Cancion) =>
      cancion.titulo.includes(this.filterValues.label));
  }

  ngOnInit() {
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.getCanciones();

      this.sub = this.cancionService.getCanciones().subscribe(canciones => {
      this.canciones = canciones.sort( (a, b) => (a.titulo < b.titulo ? -1 : 1));
      this.filteredSongs = this.canciones;
      this.artists = [...new Set(this.canciones.map(a => a.interprete).map(n=> n[0]))].sort();
      });
    }
  }

  getCanciones():void{
    this.cancionService.getCanciones()
    .subscribe(canciones => {
      this.canciones = canciones
      this.mostrarCanciones = canciones
      this.onSelect(this.mostrarCanciones[0], 0)
    })
  }

  onSelect(cancion: Cancion, indice: number){
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

  buscarCancion(busqueda: string){
    let cancionesBusqueda: Array<Cancion> = []
    this.canciones.map( cancion => {
      if(cancion.titulo.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())){
        cancionesBusqueda.push(cancion)
      }
    })
    this.mostrarCanciones = cancionesBusqueda
  }

  eliminarCancion(){
    this.cancionService.eliminarCancion(this.cancionSeleccionada.id)
    .subscribe(cancion => {
      this.ngOnInit()
      this.showSuccess()
    },
    error=> {
      this.showError("Ha ocurrido un error. " + error.message)
    })
  }

  irCrearCancion(){
    this.routerPath.navigate([`/canciones/create/${this.userId}/${this.token}`])
  }

  showError(error: string){
    this.toastr.error(error, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`La canción fue eliminada`, "Eliminada exitosamente");
  }

}
