import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { MovieComponent } from './pages/movie/movie.component';
import { ContactComponent } from './components/contact/contact.component';
import { CategoryComponent } from './pages/category/category.component';

export const routes: Routes = [
    {path : '' , redirectTo:'home' , pathMatch:'full'},
    {path:'home' , component:HomeComponent},
    {path:'movie/:title' , component:MovieComponent},
    {path:'request' , component:ContactComponent},
    { path: 'category/:category', component: CategoryComponent },
    {path:'**' , component:NotfoundComponent}
];
