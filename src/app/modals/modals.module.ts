import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardEditorComponent } from './card-editor/card-editor.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [CardEditorComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ModalsModule { }
