import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DadosIsoService {

  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }



  buscarIsos(): Observable<any> {
    const url = `${this.apiUrl}isos`;

  
    return this.http.get(url);
  }

  baixarIsoPeloId(id:number):Observable<any>{
    const url = `${this.apiUrl}isos/${id}/download`;
    return this.http.get<any>(url);
  }

  /**
   * Salva uma nova ISO no servidor.
   * @param isoFile O arquivo ISO a ser enviado.
   * @param nome O nome associado ao arquivo ISO.
   * @returns Um Observable com a resposta do servidor.
   */
  salvarIso(isoFile: File, nome: string): Observable<any> {

    const url = `${this.apiUrl}isos`;

  
  
    const formData = new FormData();
    formData.append('isoFile', isoFile); // Adiciona o arquivo ao FormData
    formData.append('nome', nome);       // Adiciona o nome ao FormData

    return this.http.post<any>(url, formData);
  }

 


}
