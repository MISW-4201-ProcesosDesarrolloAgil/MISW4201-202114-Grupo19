import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cancion } from '../cancion';
import { ToastrService } from 'ngx-toastr';
import { CancionService } from '../cancion.service';
import { CancionFavorita } from '../cancionFavorita';

@Component({
  selector: 'app-cancion-detail',
  templateUrl: './cancion-detail.component.html',
  styleUrls: ['./cancion-detail.component.css']
})
export class CancionDetailComponent implements OnInit {

  @Input() cancion: Cancion;
  @Input() cancionFavorita: CancionFavorita;
  @Output() deleteCancion = new EventEmitter();
  @Output() selectFavorita = new EventEmitter();
  @Output() unSelectFavorita = new EventEmitter();

  userId: number;
  token: string;
  cancionId: number;
  newCancionFavorita: CancionFavorita;

  constructor(
    private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService,
    private cancionService: CancionService
  ) { }

  ngOnInit() {
    this.userId = parseInt(this.router.snapshot.params.userId)
    this.token = this.router.snapshot.params.userToken

  }

  eliminarCancion(){
    this.deleteCancion.emit(this.cancion.id)
  }

  seleccionarFavorita(){

    if(this.cancion.favorita ==1){
      this.cancion.favorita =0
    }

    else if(this.cancion.favorita !==1) {
      this.cancion.favorita =1

    }

    this.cancionService.seleccionarFavorita(this.cancion, this.cancion.id)
    .subscribe(cancion => {
      this.showSuccess(cancion)
      this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`])
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

  }

  createCancionFavorita(){
    this.newCancionFavorita.id_cancion = this.cancion.id
    this.newCancionFavorita.id_usuario = this.userId
    this.cancionService.crearCancionFavorita(this.newCancionFavorita)
    .subscribe(cancionFavorita => {
      this.showSuccessFavorita(cancionFavorita)

      this.routerPath.navigate([`/cancionesFavoritas/${this.userId}/${this.token}`])
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
  }



  showError(error: string){
    this.toastr.error(error, "Error")
  }

  showWarning(warning: string){
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess(cancion: Cancion) {
    if(this.cancion.favorita ==1 ){
      this.toastr.success(`La canción ${cancion.titulo} es ahora favorita`, "Selección Exitosa")
    }

    else {
      this.toastr.success(`La canción ${cancion.titulo} ya no es favorita`, "Selección Exitosa")
    }

  }


  showSuccessFavorita(cancionFavorita: CancionFavorita) {
    if(this.cancion.favorita ==1 ){
      this.toastr.success(`La canción ${cancionFavorita.id} fue creada`, "Selección Exitosa")
    }

    else {
      this.toastr.success(`La canción ${cancionFavorita.id} fue retirada`, "Selección Exitosa")
    }

  }

  goToEdit(){
    this.routerPath.navigate([`/canciones/edit/${this.cancion.id}/${this.userId}/${this.token}`])
  }

}
