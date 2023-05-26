import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleDateComponent } from './single-date/single-date.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SingleDateComponent],
  exports: [SingleDateComponent],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class ComponentsModule {}
