import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DadosLinkService {
  private apiUrl = 'http://10.139.0.15:3000/';

  constructor(private http: HttpClient) { }



  buscarLinks(): Observable<any> {
    const url = `${this.apiUrl}links`;

  
    return this.http.get(url);
  }



  cadastrarNovoLink(dados: any): Observable<string> {
    const url = `${this.apiUrl}links`;
  
    // Configuração dos headers (se necessário)
    const headers = { 'Content-Type': 'application/json' };
  
    // Enviar a requisição POST com o corpo no formato JSON e esperar a resposta como texto
    return this.http.post(url, dados, { headers, responseType: 'text' });
  }

  deletePrograma(idLink: number, senha:string | null): Observable<any> {
    const url = `${this.apiUrl}links/${idLink}`;
    // Configuração dos headers (se necessário)
    const headers = { 'Content-Type': 'application/json' };

    const body = {senha}
  
    return this.http.delete(url,  { headers,body, responseType: 'text' });
  }



}
