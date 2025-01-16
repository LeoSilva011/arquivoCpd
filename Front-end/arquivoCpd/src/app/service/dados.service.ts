import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DadosService {
  private url = "dataFake/dataLinks"

  constructor(private http: HttpClient) { }


  getDadosLinks():Observable<any>{
    return this.http.get<any[]>(this.url);
  }

}
