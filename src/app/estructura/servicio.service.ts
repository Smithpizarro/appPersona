import { Injectable } from '@angular/core';
import {HttpRequest,HttpHeaders,HttpResponse, HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError,map,tap} from 'rxjs/operators';

import {RUTA_SERVICIOS} from './conf/config'

import { PersonaCollection } from '../model/personaCollection';
import { Persona } from '../model/persona';


const httpOptions ={
  headers: new HttpHeaders(
                { 
                  'Content-Type': 'application/json' 
                }
              ) 
  };

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  public servicioUrl = RUTA_SERVICIOS;
 
  public errorMessage : String;


  constructor(private http: HttpClient) { }


  
  private handleError<T>(operation='operation' , result?:T){
    return (error:any): Observable<T>=>{
      console.error(error);
      
      return of(result as T);
    }
  }

  public getPaginaPersonas(pagina:number):Observable<PersonaCollection>{
    console.log("url=",this.servicioUrl+"/persona/listarPersona/"+pagina);
    return this.http.get<PersonaCollection>(this.servicioUrl+"/persona/listarPersona/"+pagina,httpOptions).pipe(
      tap((lista:PersonaCollection)=>
       console.log(lista)),
      catchError(this.handleError<PersonaCollection>('getPersonas'))
    );
  }

  public crearPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.servicioUrl+"/persona/createPersona",
    JSON.stringify(persona), httpOptions).pipe(
    tap((persona: Persona) =>
    console.log(persona.personaId)),
    catchError(this.handleError<Persona>('create'))
    ); }


    public deletePersona(id: number):Observable<String> {
      return this.http.delete<String>(this.servicioUrl+"/persona/deletePersona/"+id,httpOptions).pipe( 
      tap((msj:String) => console.log(msj)),
      catchError(this.handleError<String>('delete'))
      ) }
}
