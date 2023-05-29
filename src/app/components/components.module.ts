import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleDateComponent } from './single-date/single-date.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MultipleDatesComponent } from './multiple-dates/multiple-dates.component';

@NgModule({
  declarations: [SingleDateComponent, MultipleDatesComponent],
  exports: [SingleDateComponent, MultipleDatesComponent],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class ComponentsModule {}
