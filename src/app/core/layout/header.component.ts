import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-layout-header",
  templateUrl: "./header.component.html",
  imports: [RouterLinkActive, RouterLink],
})
export class HeaderComponent {}
