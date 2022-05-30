import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { RoutesComponent } from './components/routes/routes.component';
import { LoginComponent } from './components/login/login.component';
import { RouterinfoComponent } from './components/routerinfo/routerinfo.component';
import { NewRouteComponent } from './components/new-route/new-route.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Home', component: HomeComponent },
  { path: 'Discover', component: DiscoverComponent },
  { path: 'Routes', component: RoutesComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Route/:id', component: RouterinfoComponent },
  { path: 'Create-route', component: NewRouteComponent },
  { path: 'User', component: UserPageComponent },
  { path: 'User/:id', component: UserPageComponent },
  { path: 'Registro', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
