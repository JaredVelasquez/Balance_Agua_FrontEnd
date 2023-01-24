import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleConsumoComponent } from './detalle-consumo/detalle-consumo.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'BalanceAgua', component: WelcomeComponent},
  { path: 'DetalleConsumo', component: DetalleConsumoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
