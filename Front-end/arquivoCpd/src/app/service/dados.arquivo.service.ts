import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DadosArquivoService {

  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }



  buscarArquivos(): Observable<any> {
    const url = `${this.apiUrl}categorias`;

  
    return this.http.get(url);
  }


  /**
   * Salva um programa associado a uma categoria.
   * @param nome Nome do programa.
   * @param idCategoriaArquivo ID da categoria.
   * @param urlArquivo Arquivo do programa.
   * @param urlImg Imagem associada ao programa.
   * @returns Um Observable com a resposta do servidor.
   */
  salvarPrograma(
    nome: string,
    idCategoriaArquivo: string,
    urlArquivo: File,
    urlImg: File
  ): Observable<any> {


    const url = `${this.apiUrl}categorias/adicionar-programa`;


    const formData = new FormData();
    formData.append('nome', nome);                     // Adiciona o nome
    formData.append('idCategoriaArquivo', idCategoriaArquivo); // Adiciona o ID da categoria
    formData.append('urlArquivo', urlArquivo);         // Adiciona o arquivo
    formData.append('urlImg', urlImg);                 // Adiciona a imagem

    return this.http.post<any>(url, formData);
  }

}
