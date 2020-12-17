import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MsgPageRoutingModule } from './msg-routing.module';

import { MsgPage } from './msg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MsgPageRoutingModule
  ],
  declarations: [MsgPage]
})
export class MsgPageModule {}
