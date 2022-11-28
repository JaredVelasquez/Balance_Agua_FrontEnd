import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsProviderModule } from './../../icons-provider.module';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [WelcomeRoutingModule, 
    NzInputModule, 
    NzSelectModule,
    NzDatePickerModule, 
    NzGridModule, 
    CommonModule, 
    FormsModule, 
    NzFormModule,
    ReactiveFormsModule,
    IconsProviderModule,
    NzIconModule,
    NzButtonModule
    
  ],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
