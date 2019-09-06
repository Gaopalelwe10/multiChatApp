import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { HomePage } from './home/home.page';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), },
  { path: 'home', component: HomePage ,canActivate:[AuthGuard ] ,children:[
    { path: '', loadChildren: './pages/chats/chats.module#ChatsPageModule' },
    { path: 'chats', loadChildren: './pages/chats/chats.module#ChatsPageModule' },
    { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
    { path: 'groupchat', loadChildren: './pages/groupchat/groupchat.module#GroupchatPageModule' },
  ]},
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'users', loadChildren: './pages/users/users.module#UsersPageModule' ,canActivate:[AuthGuard ]},
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'message', loadChildren: './pages/message/message.module#MessagePageModule',canActivate:[AuthGuard ] },
  // { path: 'popover', loadChildren: './pages/popover/popover.module#PopoverPageModule' },
  
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
