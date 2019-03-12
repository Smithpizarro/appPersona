import { Component, OnInit,Input, Output, EventEmitter  } from '@angular/core';
import { ServicioService } from './servicio.service';
import { PersonaCollection } from '../model/personaCollection';
import { Paginacion } from '../model/paginacion';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Persona } from '../model/persona';


@Component({
  selector: 'nueva-persona',
  templateUrl: './nueva-persona.html',
})
export class NuevaPersona {
 
  public persona: Persona = new Persona;
  public errorMessage: String;
  @Output() listapersonaOut = new EventEmitter<PersonaCollection>();
  public personacollection : PersonaCollection= new PersonaCollection();
  constructor(public activeModal: NgbActiveModal, public modal: NgbActiveModal, private service: ServicioService) {
    console.log("llega abonado?");
  }
 
  public agregarPersona(name: string ,height : number ,mass : number ,hairColor : string ,planet: string,gender: string){
   this.persona.name = name;
   this.persona.height = height;
   this.persona.mass = mass;
   this.persona.hairColor = hairColor;
   this.persona.planet = planet;
   this.persona.gender = gender;
   
   this.service.crearPersona(this.persona).subscribe( persona=>{
         this.service.getPaginaPersonas(1).subscribe(
          personacollection=>{
            this.personacollection=personacollection;
          },
         );
         this.listapersonaOut.emit(this.personacollection);
    },
    error=>{this.errorMessage=<any>error;} );
      
    this.activeModal.close(this.personacollection);
  }
}


@Component({
  selector: 'app-estructura',
  templateUrl: './estructura.component.html',
  styleUrls: ['./estructura.component.css'],
  providers: [ServicioService]   
})
export class EstructuraComponent implements OnInit {

  public personacollection : PersonaCollection= new PersonaCollection();
  
  public pages = 1;
  private errorMessage: String;

  constructor(private service: ServicioService, private modalService: NgbModal ) {

    this.personacollection.paginacion = new Paginacion;
   }

  ngOnInit() {
    this.getPersona(this.pages);
  }
  
  loadPage(page: number) {
    
    if (page !== this.pages) {
      this.pages = page;
     
    }
  // console.log("pagina -> "+this.pages+ " categoria "+idCategoria );
   this.getPersona(this.pages);
  }

  public getPersona(pagina:number){
    this.service.getPaginaPersonas(pagina).subscribe(
      personacollection=>{
    console.log(personacollection);
    this.personacollection=personacollection;

    },
    error=>{this.errorMessage=<any>error;}
    );
    }

   public added(){

    const modalRef = this.modalService.open(NuevaPersona, { centered: true });
      modalRef.result.then((result) => {
     console.log("llego? " +result);
     this.personacollection = result;
     this.getPersona(1);
    }).catch((error) => {
      console.log(error);
    });
   } 


   public delete(idPersona:number){

    this.service.deletePersona(idPersona).subscribe(
      transaccion=>{
      console.log(transaccion);
      this.getPersona(1);
      },
      error=>{this.errorMessage=<any>error;
      }
      );
    }
}
