import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import { EndPointService } from 'src/app/shared/services/end-point.service';
import { esquemaDatos, GraficoPie } from 'src/app/interfaces/Datos.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {


  fechaInicio: any = new Date;
  fechaFin: any = new Date;
  fechas: any = null;
  tiempo: string = '';
  habilitarfecha: boolean = true;
  facturado: boolean = false;

  plantas: GraficoPie[] = [];

  totalConsumo: number = 0;
  totalProduccion: number = 0;
  totalReposicion: number = 0;
  totalConsumoCaliente: number = 0;
  totalDiferencia: number = 0;
  chartConsumo: any = [];
  chartProduccion: any = [];
  chartBarraComparativa: any;
//Variables nuevas
  dataConsumo: esquemaDatos[] = [];
  consumoTotal: number = 0;
  validateForm: FormGroup = this.fb.group({
    tiempo: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
  });
  constructor(
    private endPoint: EndPointService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.CleanFrom();
    this.getDatosConsumo();
    console.log(this.dataConsumo);
    let totalCon = 0, totalProd, totalDif;
  }

  CleanFrom(){
    this.validateForm = this.fb.group({
      tiempo: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
    })
  }

  submitForm(){
    if(this.validateForm.valid){
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
  }

  getDatosConsumo(){
    this.fechaInicio = "2022-08-31 7:45:00 AM";
    this.fechaFin = "2022-08-31 11:30:00 AM";
    this.endPoint.Post( {
      fechaInicial:"2022-08-31 7:45:00 AM",
      fechaFinal:  "2022-08-31 11:30:00 AM"
    } ,'consumos').subscribe(
      (result: any) => {
        this.dataConsumo = result;
        console.log(result);
        this.sumaConsumos(this.dataConsumo);
        this.ConstruirGraficoPieConsumo(this.dataConsumo, 'canvasConsumo', "Consumo de agua", 1);
      }
    );
  }
  
  sumaConsumos(data: esquemaDatos[]){
    this.totalConsumo = 0;
    this.totalProduccion = 0;
    this.totalReposicion = 0;
    this.totalConsumoCaliente = 0;

    for(let i = 0; i < data.length; i++){
      this.totalConsumo += data[i].consumototal;
      this.totalProduccion += data[i].producciontotal;
      this.totalReposicion += data[i].reposiciontotal;
      this.totalConsumoCaliente += data[i].consumocalientetotal;
    }
  }

  async mostrar() {
    if(this.validateForm.valid){
      switch (this.validateForm.value.tiempo) {
        case 1: {
          console.log(moment().add(-1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'), moment().startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment().add(-1, 'day').startOf('day').format('YYYY-MM-DD');
          this.validateForm.value.fecha[1] = moment().startOf('day').format('YYYY-MM-DD')
          break;
        }
        case 2: {
          console.log(moment(moment().startOf('week')).format('YYYY-MM-DD HH:mm'), moment().startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('week')).format('YYYY-MM-DD');
          this.validateForm.value.fecha[1] = moment().startOf('day').format('YYYY-MM-DD');
          break;
        }
        case 3: {
          console.log(moment().startOf('year').format('YYYY-MM-DD HH:mm'), moment().startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment().startOf('year').format('YYYY-MM-DD');
          this.validateForm.value.fecha[1] = moment().startOf('day').format('YYYY-MM-DD');
          break;
        }
        case 4: {
          console.log(moment(moment().startOf('week').subtract(1, 'week')).format('YYYY-MM-DD HH:mm'));
          console.log(moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('week').subtract(1, 'week')).format('YYYY-MM-DD');
          this.validateForm.value.fecha[1] = moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').startOf('day').format('YYYY-MM-DD');
          break;
        }
        case 5: {
          console.log(moment(moment().startOf('week').subtract(2, 'week')).format('YYYY-MM-DD HH:mm'));
          console.log(moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('week').subtract(2, 'week')).format('YYYY-MM-DD');
          this.validateForm.value.fecha[1] = moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').startOf('day').format('YYYY-MM-DD');
          break;
        }
        case 6: {
          console.log(moment().startOf('month').format('YYYY-MM-DD HH:mm'), moment().startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment().startOf('month').format('YYYY-MM-DD');
          this.validateForm.value.fecha[1] = moment().startOf('day').format('YYYY-MM-DD');
          break;
        }
        case 7: {
          console.log(moment(moment().startOf('month').subtract(1, 'month')).format('YYYY-MM-DD HH:mm'));
          console.log(moment(moment().endOf('month').subtract(1, 'month')).add(2, 'day').startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('month').subtract(1, 'month')).format('YYYY-MM-DD');
          this.validateForm.value.fecha[1] = moment(moment().endOf('month').subtract(1, 'month')).add(2, 'day').startOf('day').format('YYYY-MM-DD');
          break;
        }
        case 8: {
          console.log(moment(moment().startOf('year').subtract(1, 'year')).format('YYYY-MM-DD HH:mm'));
          console.log(moment(moment().endOf('year').subtract(1, 'year')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('year').subtract(1, 'year')).format('YYYY-MM-DD');
          this.validateForm.value.fecha[1] = moment(moment().endOf('year').subtract(1, 'year')).add(1, 'day').startOf('day').format('YYYY-MM-DD');
          break;
        }
        case 9: {
          
          break;
        }
        default: {
          this.validateForm.value.fecha[0] =  "2022-08-31 7:45:00 AM";
          this.validateForm.value.fecha[1] =  "2022-08-31 11:30:00 AM";
          break;
        }

      }
        this.submitForm();

    }

    console.log(this.validateForm.value);
    
    //this.submitForm();  
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
          data: data.map(item => (item[`consumototal`] )),
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
      yAxisID: "y-axis-density"
    };
     
    var aguaFria = {
      label: 'Agua fría (m3)',
      data:  data.map(item => item.consumototal) ,
      backgroundColor: 'rgba(0, 99, 132, 0.6)',
      borderColor: 'rgba(0, 99, 132, 1)',
      yAxisID: "y-axis-gravity"
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
     
    new Chart('aguaVSproduccion', {
      type: 'bar',
      data: {
        labels: data.map(item => item.locacion.descripcion),
        datasets: [Produccion, aguaFria]
      },
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

  imprimir(): void {
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



