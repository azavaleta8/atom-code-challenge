import { Routes } from "@angular/router";
import { LoginComponent } from "./modules/login/login.component";
import { ExamplePageComponent } from "./modules/example-page/example-page.component";

export const routes: Routes = [
    
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    },
    {
        path: "home",
        loadComponent: () => import("./modules/example-page/example-page.component").then((m) => m.ExamplePageComponent)

    },
    {
        path: "login",
        loadComponent: () => import("./modules/login/login.component").then((m) => m.LoginComponent)
    },
];
