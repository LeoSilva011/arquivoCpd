import { Component } from '@angular/core';
import { dataFakeArquivo } from '../../dataFake/dataArquivo';
import { dataLinks } from '../../dataFake/dataLinks';
import { dataIsos } from '../../dataFake/dataIsos';
import { DadosLinkService } from '../../service/dados.link-service.service';
import { DadosIsoService } from '../../service/dados.iso.service';
import { DadosArquivoService } from '../../service/dados.arquivo.service';
import { log } from 'console';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

    nomeLink: string=""
    link: string=""

  

    links: any[] = [];
    arquivos: any[] = [];
    isos: any[] = [];

    addNovoLink:boolean = false;




    constructor(private router: Router, private dadosLinkService:DadosLinkService, private dadosIsoService:DadosIsoService, private dadosArquivosService:DadosArquivoService){}

    navigateToNovaIso(addIso:boolean) {
      const addIsoValue = addIso;
      
      this.router.navigate(['/novaIso', addIsoValue]);
    }

    navigateToNovoArquivo(addIso:boolean, idCategoriaArquivo: number) {
      const addIsoValue = addIso;
      const idValue = idCategoriaArquivo;
      this.router.navigate(['/novoArquivo', addIsoValue, idValue]);
    }



    statusAddNovoLink(){
      this.addNovoLink = !this.addNovoLink
    }

    ngOnInit(): void {
     this.buscarLinksApi()
     this.buscarIsosApi()
     this.buscarArquivosApi()
     
   }

    adicionarLink():void{
      const novoLink = {
        
        nome: this.nomeLink,
        link: this.link
      };
     


      this.dadosLinkService.cadastrarNovoLink(novoLink).subscribe({
        next: (response) => {
          console.log('Upload realizado com sucesso:', response);
          this.links.push(novoLink) 

          this.nomeLink = ""
          this.link =""
          this.addNovoLink = false


          alert("link adicionado")
        },
        error: (error) => {
          console.error('Erro ao realizar upload:', error);
          
        }
      });

    
    }


    async buscarLinksApi(): Promise<void>{
      this.dadosLinkService.buscarLinks().subscribe(
        (dados) => {

          this.links = dados; // Preenche o array com os dados retornados da API
        },
        (erro) => {
          console.error('Erro ao buscar categorias:', erro); // Tratamento de erros
        }
      );
    }


    async buscarIsosApi(): Promise<void>{
      this.dadosIsoService.buscarIsos().subscribe(
        (dados) => {

          this.isos = dados; // Preenche o array com os dados retornados da API
        },
        (erro) => {
          console.error('Erro ao buscar categorias:', erro); // Tratamento de erros
        }
      );
    }

    async baixarIsoPeloID(id:number): Promise<void>{
      this.dadosIsoService.baixarIsoPeloId(id).subscribe(
        (dados) => {

          console.log("baixando iso")
        },
        (erro) => {
          console.error('Erro ao buscar categorias:', erro); // Tratamento de erros
        }
      );
    }
    

    async buscarArquivosApi(): Promise<void>{
      this.dadosArquivosService.buscarArquivos().subscribe(
        (dados) => {
                
          this.arquivos = dados; // Preenche o array com os dados retornados da API
        },
        (erro) => {
          console.error('Erro ao buscar categorias:', erro); // Tratamento de erros
        }
      );
    }

    async apagarLink(idLink:number): Promise<void>{
      this.dadosLinkService.deletePrograma(idLink).subscribe(
        (response) => {
          // Agora, remova o link do array local
        this.links = this.links.filter(link => link.idLink !== idLink); // Remover o link do array local
        
          console.log('Programa excluído com sucesso:', response);
        },
        (error) => {
          console.error('Erro ao excluir programa:', error);
        }
      );
    }
    




}
