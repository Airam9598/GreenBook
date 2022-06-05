import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { RoutesComponent } from './components/routes/routes.component';
import { LoginComponent } from './components/login/login.component';
import { RouterinfoComponent } from './components/routerinfo/routerinfo.component';
import { NewRouteComponent } from './components/new-route/new-route.component';
import{FormsModule, ReactiveFormsModule} from "@angular/forms";
import { UserPageComponent } from './components/user-page/user-page.component';
import { CookieService } from 'ngx-cookie-service';
import { RegisterComponent } from './components/register/register.component';
import { NewFlowerComponent } from './components/new-flower/new-flower.component';
import { NewImageflowerComponent } from './components/new-imageflower/new-imageflower.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgxPaginationModule } from "ngx-pagination";
import { UsersListComponent } from './users-list/users-list.component';
import { UserseditComponent } from './usersedit/usersedit.component'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DiscoverComponent,
    RoutesComponent,
    LoginComponent,
    RouterinfoComponent,
    NewRouteComponent,
    UserPageComponent,
    RegisterComponent,
    NewFlowerComponent,
    NewImageflowerComponent,
    FooterComponent,
    UsersListComponent,
    UserseditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
