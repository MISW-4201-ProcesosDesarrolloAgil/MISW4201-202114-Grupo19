import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { Album, Cancion } from '../album';
import { AlbumService } from '../album.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  constructor(
    private albumService: AlbumService,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router
  ) { }

  userId: number
  token: string
  albumes: Array<Album>
  mostrarAlbumes: Array<Album>
  albumFiltradoArtista: Array<Album>
  albumFiltradoTitulo: Array<Album>
  albumSeleccionado: Album
  indiceSeleccionado: number

  scroll: boolean;
  fixedStyle: object = {"position": "fixed"};
  display: object = {"display": "none"};
  sub: Subscription;
  albums: Album[];
  artists: string[];
  labels: string[];
  genres: string[];
  filteredAlbums: Album[] = [];
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
    this.filteredAlbums = this.performFilters();
  }

  performFilters(): Album[] {
    let albums: Album[] = []

    if (this.filterValues.label === "" || this.filterValues.genre ) {
      return albums = this.albums;
    }

    if (this.filterValues.label !== "") {
      this.performLabelFilter().forEach(x=> albums.push(x));
    }
    if (this.filterValues.genre !== "") {
      this.performGenreFilter().forEach(x=> albums.push(x));
    }

    return [...new Set(albums)].sort((a, b) => (a.titulo < b.titulo ? -1 : 1));
  }


  performLabelFilter(): Album[] {
    return this.albums.filter((album: Album) =>
      album.titulo.includes(this.filterValues.label));
  }

  performGenreFilter(): Album[] {
    return this.albums.filter((album: Album) =>
      album.titulo.includes(this.filterValues.genre));
  }

  showForm() {
    this.openForm = true;
  }

  hideForm() {
    this.openForm = false;
  }

  ngOnInit() {
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.getAlbumes();

      this.sub = this.albumService.getAlbumes(this.userId, this.token).subscribe(albums => {
      this.albums = albums.sort( (a, b) => (a.titulo < b.titulo ? -1 : 1));
      this.filteredAlbums = this.albums;
      this.artists = [...new Set(this.albums.map(a => a.interpretes).map(n=> n[0]))].sort();

      });



    }
  }

  getAlbumes():void{
    this.albumService.getAlbumes(this.userId, this.token)
    .subscribe(albumes => {
      this.albumes = albumes
      this.mostrarAlbumes = albumes
      if(albumes.length>0){
        this.onSelect(this.mostrarAlbumes[0], 0)
      }
    },
    error => {
      console.log(error)
      if(error.statusText === "UNAUTHORIZED"){
        this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if(error.statusText === "UNPROCESSABLE ENTITY"){
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else{
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })

  }



  onSelect(a: Album, index: number){
    this.indiceSeleccionado = index
    this.albumSeleccionado = a
    this.albumService.getCancionesAlbum(a.id, this.token)
    .subscribe(canciones => {
      this.albumSeleccionado.canciones = canciones
      this.albumSeleccionado.interpretes = this.getInterpretes(canciones)
    },
    error =>{
      this.showError("Ha ocurrido un error, " + error.message)
    })
  }

  getInterpretes(canciones: Array<Cancion>): Array<string>{
    var interpretes: Array<string> = []
    canciones.map( c => {
      if(!interpretes.includes(c.interprete)){
        interpretes.push(c.interprete)
      }
    })
    return interpretes
  }

  buscarAlbum(busqueda: string){
    let albumesBusqueda: Array<Album> = []

    this.filteredAlbums.map( albu => {
      if( albu.titulo.toLocaleLowerCase().includes(busqueda.toLowerCase())){
        albumesBusqueda.push(albu)
      }
      if ( busqueda === "")
      this.ngOnInit();

    })


    this.filteredAlbums = albumesBusqueda
  }

  irCrearAlbum(){
    this.routerPath.navigate([`/albumes/create/${this.userId}/${this.token}`])
  }

  eliminarAlbum(){
    this.albumService.eliminarAlbum(this.userId, this.token, this.albumSeleccionado.id)
    .subscribe(album => {
      this.ngOnInit();
      this.showSuccess();
    },
    error=> {
      if(error.statusText === "UNAUTHORIZED"){
        this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if(error.statusText === "UNPROCESSABLE ENTITY"){
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else{
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })
    this.ngOnInit()
  }

  showError(error: string){
    this.toastr.error(error, "Error de autenticación")
  }

  showWarning(warning: string){
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`El album fue eliminado`, "Eliminado exitosamente");
  }
}
