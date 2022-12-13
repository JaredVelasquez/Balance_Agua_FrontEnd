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
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';

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
    NzButtonModule,
    NzTableModule,
    NzDropDownModule,
    NzBadgeModule,
    NzDividerModule
    
  ],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
