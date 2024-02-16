import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FilereaderComponent } from './filereader/filereader.component';
import { GraphviewComponent } from './graphview/graphview.component';
import { TracerComponent } from './tracer/tracer.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCardModule } from 'ng-zorro-antd/card';
@NgModule({
  declarations: [
    DashboardComponent,
    FilereaderComponent,
    GraphviewComponent,
    TracerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    NzTabsModule,
    NzSelectModule,
    NzButtonModule,
    NzUploadModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
  ],
  exports: [],
})
export class DashboardModule {}
