import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from "@app/shared/navbar/navbar.component";
import { NgbDropdown, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";
import { ConfirmationService } from "primeng/api";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ProgressBarModule } from "primeng/progressbar";
import { DropdownModule } from "primeng/dropdown";
import { DividerModule } from "primeng/divider";
import { TabViewModule } from "primeng/tabview";
import { SidebarModule } from "primeng/sidebar";
import { PanelMenuModule } from "primeng/panelmenu";
import { PasswordModule } from "primeng/password";
import { CheckboxModule } from "primeng/checkbox";

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SidebarModule,
    PanelMenuModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressBarModule,
    DropdownModule,
    DividerModule,
    TabViewModule,
    PasswordModule,
    CheckboxModule
  ],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
  providers: [MessageService, ConfirmationService, NgbDropdown]
})
export class NavbarModule {}
