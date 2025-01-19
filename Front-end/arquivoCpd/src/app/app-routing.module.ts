import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AddNovoArquivoComponent } from './components/add-novo-arquivo/add-novo-arquivo.component';
import { PrerenderFallback, RenderMode } from '@angular/ssr';



const routes: Routes = [


  {
    path:'', component:HomeComponent
  },
  {
    path:'novoArquivo/:addArquivo/:id', component:AddNovoArquivoComponent,data:{
      renderMode: 'prerender',
    //   getPrerenderParams:() =>{
    //   return[
    //     {addArquivo: false, id: 0}
    //   ]
    // }
    }
    
   
   
   
  }

 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
