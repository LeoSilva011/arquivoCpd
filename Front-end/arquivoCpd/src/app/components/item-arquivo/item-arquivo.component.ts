import { Component, Input } from '@angular/core';
import { DadosArquivoService } from '../../service/dados.arquivo.service';

@Component({
  selector: 'app-item-arquivo',
  standalone: false,
  
  templateUrl: './item-arquivo.component.html',
  styleUrl: './item-arquivo.component.css'
})
export class ItemArquivoComponent {

  @Input()
  idArquivo:number =0
  @Input()
  nome:string=""
  @Input()
  urlArquivo:string=""
  @Input()
  urlImg:string=""

  @Input()
  idCategoria:number=0
  @Input()
  idPrograma:number=0

  constructor(private dadosArquivoService:DadosArquivoService){}


  async deletarPeloId(): Promise<void>{
    const userInput = prompt("Digite a senha:");
  
    this.dadosArquivoService.deletarPeloId(this.idCategoria, this.idPrograma, userInput).subscribe(
      (response) => {
        // Agora, remova o link do array local
       
        console.log('Programa excluído com sucesso:', response);
        window.location.reload();
      },
      (error) => {
        console.error('Erro ao excluir programa:', error);
        alert(error.error)
      }
    );
  }



}
