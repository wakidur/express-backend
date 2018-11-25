import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserComponent } from "./user/user.component";
import { SingUpComponent } from "./user/sing-up/sing-up.component";

const routes: Routes = [
  {
    path: "signup",
    component: UserComponent,
    children: [{ path: "", component: SingUpComponent }]
  },
  {
    path: "",
    redirectTo: "/signup",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
