import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import { EndPointService } from 'src/app/shared/services/end-point.service';
import { esquemaDatos, GraficoPie } from 'src/app/interfaces/Datos.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver'
<<<<<<< HEAD
=======

interface ParentItemData {
  key: number;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number | string;
  creator: string;
  createdAt: string;
  expand: boolean;
}

interface ChildrenItemData {
  key: number;
  name: string;
  date: string;
  upgradeNum: string;
}
>>>>>>> 9470e48781b8200351d88f2dec269d0df90e04a0

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {


  fechaInicio: any = new Date;
  fechaFin: any = new Date;
  tiempo: string = '';
  habilitarfecha: boolean = true;
  facturado: boolean = false;

<<<<<<< HEAD

//Variables nuevas
=======
  

//Variables nuevas
  listOfParentData: ParentItemData[] = [];
  listOfChildrenData: ChildrenItemData[] = [];
>>>>>>> 9470e48781b8200351d88f2dec269d0df90e04a0
  totalConsumo: number = 0;
  totalProduccion: number = 0;
  totalReposicion: number = 0;
  totalConsumoCaliente: number = 0;
  totalDiferencia: number = 0;
<<<<<<< HEAD
  chartConsumo!: Chart;
  chartProduccion!: Chart;
=======
  chartConsumo!: any;
  chartProduccion!: any;
>>>>>>> 9470e48781b8200351d88f2dec269d0df90e04a0
  chartBarraComparativa!: Chart;
  aguaVSproduccion!: Chart;
  dataConsumo: esquemaDatos[] = [];
  consumoTotal: number = 0;
  expand: boolean = false;
  validateForm: FormGroup = this.fb.group({
    tiempo: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
  });
  dataExcel: any[] = [];
  constructor(
    private endPoint: EndPointService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.CleanFrom();
    this.mostrar();
    console.log(this.dataConsumo);
    for (let i = 0; i < 3; ++i) {
      this.listOfParentData.push({
        key: i,
        name: 'Screem',
        platform: 'iOS',
        version: '10.3.4.5654',
        upgradeNum: 500,
        creator: 'Jack',
        createdAt: '2014-12-24 23:12:00',
        expand: false
      });
    }
    for (let i = 0; i < 3; ++i) {
      this.listOfChildrenData.push({
        key: i,
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56'
      });
    }
  }

  CleanFrom(){
    this.validateForm = this.fb.group({
      tiempo: ['', [Validators.required]],
<<<<<<< HEAD
      fecha: [[], [Validators.required]],
=======
      fecha: [[this.fechaInicio, this.fechaFin], [Validators.required]],
>>>>>>> 9470e48781b8200351d88f2dec269d0df90e04a0
    })
  }

  submitForm(){
      this.validateForm.value.fecha[0] = moment(this.validateForm.value.fecha[0]).format('YYYY-MM-DD HH:mm');  
      this.validateForm.value.fecha[1] = moment(this.validateForm.value.fecha[1]).format('YYYY-MM-DD HH:mm');  
      
      this.fechaInicio = this.validateForm.value.fecha[0];
      this.fechaFin = this.validateForm.value.fecha[1];
      this.endPoint.Post( {
        fechaInicial: this.validateForm.value.fecha[0],
        fechaFinal: this.validateForm.value.fecha[1]
      } ,'consumos').subscribe(
        (result: any) => {
          this.dataConsumo = result;
          console.log(result);
          this.sumaConsumos(this.dataConsumo);
          this.ConstruirGraficoPieConsumo(this.dataConsumo, 'canvasConsumo', "Consumo de agua", 1);
        }
      );
      console.log(this.validateForm.value);
  }
  
  sumaConsumos(data: esquemaDatos[]){
    this.totalConsumo = 0;
    this.totalProduccion = 0;
    this.totalReposicion = 0;
    this.totalConsumoCaliente = 0;
    this.validateForm.value.fecha = [];

    for(let i = 0; i < data.length; i++){
      this.totalConsumo += data[i].consumototal;
      this.totalProduccion += data[i].producciontotal;
      this.totalReposicion += data[i].reposiciontotal;
      this.totalConsumoCaliente += data[i].consumocalientetotal;
    }
  }

  async mostrar() {
<<<<<<< HEAD
    console.log("fecha convertida");
    
    console.log(new Date((1669847829)* 1000).toLocaleDateString());
    console.log(Math.abs(-2));
=======
>>>>>>> 9470e48781b8200351d88f2dec269d0df90e04a0
    
      switch (this.validateForm.value.tiempo) {
        case 1: {
          this.chartConsumo.destroy();
          this.chartProduccion.destroy();
          this.chartBarraComparativa.destroy();
          this.aguaVSproduccion.destroy();
          console.log(moment().add(-1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'), moment().startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment().add(-1, 'day').startOf('day').format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment().startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 2: {
          this.chartConsumo.destroy();
          this.chartProduccion.destroy();
          this.chartBarraComparativa.destroy();
          this.aguaVSproduccion.destroy();
          console.log(moment(moment().startOf('week')).format('YYYY-MM-DD HH:mm'), moment().startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('week')).format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment().startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 3: {
          this.chartConsumo.destroy();
          this.chartProduccion.destroy();
          this.chartBarraComparativa.destroy();
          this.aguaVSproduccion.destroy();
          console.log(moment().startOf('year').format('YYYY-MM-DD HH:mm'), moment().startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment().startOf('year').format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment().startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 4: {
          this.chartConsumo.destroy();
          this.chartProduccion.destroy();
          this.chartBarraComparativa.destroy();
          this.aguaVSproduccion.destroy();
          console.log(moment(moment().startOf('week').subtract(1, 'week')).format('YYYY-MM-DD HH:mm'));
          console.log(moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('week').subtract(1, 'week')).format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 5: {
          this.chartConsumo.destroy();
          this.chartProduccion.destroy();
          this.chartBarraComparativa.destroy();
          this.aguaVSproduccion.destroy();
          console.log(moment(moment().startOf('week').subtract(2, 'week')).format('YYYY-MM-DD HH:mm'));
          console.log(moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('week').subtract(2, 'week')).format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 6: {
          this.chartConsumo.destroy();
          this.chartProduccion.destroy();
          this.chartBarraComparativa.destroy();
          this.aguaVSproduccion.destroy();
          console.log(moment().startOf('month').format('YYYY-MM-DD HH:mm'), moment().startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment().startOf('month').format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment().startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 7: {
          this.chartConsumo.destroy();
          this.chartProduccion.destroy();
          this.chartBarraComparativa.destroy();
          this.aguaVSproduccion.destroy();
          console.log(moment(moment().startOf('month').subtract(1, 'month')).format('YYYY-MM-DD HH:mm'));
          console.log(moment(moment().endOf('month').subtract(1, 'month')).add(2, 'day').startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('month').subtract(1, 'month')).format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment(moment().endOf('month').subtract(1, 'month')).add(2, 'day').startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 8: {
          this.chartConsumo.destroy();
          this.chartProduccion.destroy();
          this.chartBarraComparativa.destroy();
          this.aguaVSproduccion.destroy();
          console.log(moment(moment().startOf('year').subtract(1, 'year')).format('YYYY-MM-DD HH:mm'));
          console.log(moment(moment().endOf('year').subtract(1, 'year')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('year').subtract(1, 'year')).format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment(moment().endOf('year').subtract(1, 'year')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 9: {
          this.chartConsumo.destroy();
          this.chartProduccion.destroy();
          this.chartBarraComparativa.destroy();
          this.aguaVSproduccion.destroy();
          this.submitForm();
          
          break;
        }
        default: {
          this.validateForm.value.fecha[0] =  "2022-08-31 7:45:00";
          this.validateForm.value.fecha[1] =  "2022-08-31 11:30:00";
          this.submitForm();
          break;
        }

      }
<<<<<<< HEAD

    console.log(this.validateForm.value);
=======
      this.fechaInicio = this.validateForm.value.fecha[0];
      this.fechaFin = this.validateForm.value.fecha[1];
>>>>>>> 9470e48781b8200351d88f2dec269d0df90e04a0
    
    this.facturado = true;
    


}

  changeFecha(event: any) {
    console.log('Entro Factura.')
    this.habilitarfecha = (event == 9) ? false : true;
  }


  // graficoLineal() {
  //   this.chartConsumo = new Chart('canvas', {
  //     type: 'line',
  //     data: {
  //       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  //       datasets: [
  //         {
  //           label: '# of Votes',
  //           data: [12, 19, 3, 5, 2, 3],
  //           borderWidth: 3,
  //           fill: false,
  //           backgroundColor: 'rgba(93, 175, 89, 0.1)',
  //           borderColor: '#3e95cd'

  //         },
  //       ],
  //     },
  //   });
  // }

  ConstruirGraficoPieConsumo(data: esquemaDatos[], nombreGrafico: string, titulo: string, opcion: number) {
    this.chartConsumo = new Chart('canvasConsumo', {
      type: 'doughnut',
      data: {
        labels: data.map(item => item.locacion.descripcion),
        datasets: [{
          label: '',
          data: data.map(item => (item.consumototal)),
          backgroundColor: [
            'rgba(255, 99, 132)',
            'rgba(255, 159, 64)',
            'rgba(255, 205, 86)',
            'rgba(75, 192, 192)',
            'rgba(54, 162, 235)',
            'rgba(153, 102, 255)',
            'rgba(201, 203, 207)'
          ]
        }]
      },
    });
    this.chartProduccion = new Chart('canvasProduccion', {
      type: 'doughnut',
      data: {
        labels: data.map(item => item.locacion.descripcion),
        datasets: [{
          label: '',
          data: data.map(item => item[`producciontotal`]),
          backgroundColor: [
            'rgba(255, 99, 132)',
            'rgba(255, 159, 64)',
            'rgba(255, 205, 86)',
            'rgba(75, 192, 192)',
            'rgba(54, 162, 235)',
            'rgba(153, 102, 255)',
            'rgba(201, 203, 207)'
          ]
        }]
      },
    });
    var Produccion = {
      label: 'Produccion (m3)',
      data: data.map(item => item.producciontotal),
      backgroundColor: 'rgba(99, 132, 0, 0.6)',
      borderColor: 'rgba(99, 132, 0, 1)',
      
    };
     
    var aguaFria = {
      label: 'Consumo (m3)',
      data:  data.map(item => item.consumototal) ,
      backgroundColor: 'rgba(0, 99, 132, 0.6)',
      borderColor: 'rgba(0, 99, 132, 1)',
    };

    var aguaCaliente = {
      label: 'Consumo Agua Caliente (m3)',
      data:  data.map(item => item.consumocalientetotal),
      backgroundColor: 'rgba(255, 79, 0, 0.6)',
      borderColor: 'rgba(255, 79, 0, 1)',
      yAxisID: "y-axis-gravity"
    };
     
    var aguaCalienteFria = {
      label: 'Consumo Agua (fría)(m3)',
      data:  data.map(item => (item.consumocalientetotal + item.consumototal)),
      backgroundColor: 'rgba(0, 99, 132, 0.6)',
      borderColor: 'rgba(0, 99, 132, 1)',
      yAxisID: "y-axis-gravity"
    };
    this.chartBarraComparativa = new Chart('densityChart', {
      type: 'bar',
      data: {
        labels: data.map(item => item.locacion.descripcion),
        datasets: [Produccion, aguaFria, aguaCaliente],
      },
    });
     
    this.aguaVSproduccion = new Chart('aguaVSproduccion', {
      type: 'bar',
      data: {
        labels: data.map(item => item.locacion.descripcion),
        datasets: [Produccion, aguaFria]
      },
      options:{
      }
    });
  }
  
  // graficoCombinadoBarraLineal() {
  //   this.chartConsumo = new Chart('canvas', {
  //     type: 'bar',
  //     data: {
  //       datasets: [{
  //           type: 'bar',
  //           label: 'Bar Dataset',
  //           data: [10, 20, 30, 40],
  //           borderWidth: 3,
  //           backgroundColor: '#d06058',
  //           borderColor: '#d06058',
  //           order: 2
  //       }, {
  //           type: 'line',
  //           label: 'Line Dataset',
  //           data: [5, 15, 35, 33],
  //           borderWidth: 3,
  //           fill: false,
  //           backgroundColor: 'rgba(93, 175, 89, 0.1)',
  //           borderColor: '#3e95cd',
  //           order: 1
  //       }],
  //       labels: ['January', 'February', 'March', 'April']
  //     },
  //   });
  // }


  construirExcel(dataConsumo: esquemaDatos[]){
    for (let i = 0; i < dataConsumo.length; i++) {
      this.dataExcel.push(
        {
        'Planta': dataConsumo[i].locacion.descripcion,
        'Consumo (Agua fría)': dataConsumo[i].consumototal,
        'Producción': dataConsumo[i].producciontotal,
        'Producción - Consumo total': dataConsumo[i].producciontotal - dataConsumo[i].consumototal
      });
    }
  }

  excel(): void {
    console.log('excel');
    this.construirExcel(this.dataConsumo);
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataExcel);

      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, `Reporte ${moment(Date.now()).format('YYYY-MM-DD')}`);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    console.log('excel 2');
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + EXCEL_EXTENSION);
  }

  pdf(): void {
    console.log('imprimir');
    const div: any = document.getElementById('content');

    const options = {
      background: 'white',
      scale: 3
    };

    // const divs: any[] = [div, anexo];
    const doc = new jsPDF('p', 'mm', 'a4', true);

    html2canvas(div, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      (doc as any).addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      return doc;
    }).then((doc) => {
      doc.save(`Balance de Agua.pdf`);
      
    });

  }

}



