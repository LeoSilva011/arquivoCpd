import { Component, Input } from '@angular/core';

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

}
