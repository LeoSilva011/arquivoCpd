import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DadosArquivoService } from '../../service/dados.arquivo.service';
import { DadosIsoService } from '../../service/dados.iso.service';

@Component({
  selector: 'app-add-novo-arquivo',
  standalone: false,
  
  templateUrl: './add-novo-arquivo.component.html',
  styleUrl: './add-novo-arquivo.component.css'
})
export class AddNovoArquivoComponent {

  constructor(private router: Router, private route: ActivatedRoute, private dadosArquivoService:DadosArquivoService,  private dadosIsoService:DadosIsoService){}

  addIso:boolean = false


  urlArquivo!:File
  urlImg!:File
  nome:string =""
  idCategoriaArquivo:string =""


  ngOnInit(){
    this.route.params.subscribe(params =>{
      this.addIso = params["addIso"] === "true";
      this.idCategoriaArquivo = params["id"];

      console.log(this.addIso)
      console.log(this.idCategoriaArquivo)
    })
  }

  onArquivoSelected(event: any): void {
    this.urlArquivo = event.target.files[0];
  }

  onImgSelected(event: any): void {
    this.urlImg = event.target.files[0];
  }

  salvarPrograma(): void {
    if (this.nome && this.idCategoriaArquivo && this.urlArquivo && this.urlImg) {
      this.dadosArquivoService
        .salvarPrograma(this.nome, this.idCategoriaArquivo, this.urlArquivo, this.urlImg)
        .subscribe(
          (response) => {
            console.log('Programa salvo com sucesso:', response);
            alert("Arquivo salvo")
            this.router.navigate(['']);
          },
          (error) => {
            console.error('Erro ao salvar o programa:', error);
          }
        );
    } else {
      console.error('Todos os campos são obrigatórios.');
    }
  }
  selectedFile!: File;
  nomeIso!: string;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  salvarIso(): void {
    if (this.selectedFile && this.nome) {
      this.dadosIsoService.salvarIso(this.selectedFile, this.nome).subscribe(
        (response) => {
          console.log('ISO salva com sucesso:', response);
          alert("Iso salvo")
          this.router.navigate(['']);
          
        },
        (error) => {
          console.error('Erro ao salvar a ISO:', error);
        }
      );
    } else {
      console.error('Arquivo e nome são obrigatórios.');
    }
  }

}
