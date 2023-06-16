import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/customers',
        pathMatch: 'full'
    },
    {
        path: '**/details',
        loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
    },
    { path: 'customers', loadChildren: () => import('./gestion/gestion.module').then(m => m.GestionModule) }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    /*  imports: [RouterModule.forRoot(routes, {
        initialNavigation: 'enabled',
        scrollPositionRestoration: 'enabled'
      })],*/
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule { }