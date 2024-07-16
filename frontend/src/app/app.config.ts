import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { HttpClientModule } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideAnimationsAsync(), importProvidersFrom(HttpClientModule)]
};
