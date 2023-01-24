import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart, ChartTypeRegistry } from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import { EndPointService } from 'src/app/shared/services/end-point.service';
import { ConsumoDetallePlanta, ConsumoPlantaRangoFecha, esquemaDatos, GraficoPie, HistoricoConsumo, TotalesHistorico } from 'src/app/interfaces/Datos.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-detalle-consumo',
  templateUrl: './detalle-consumo.component.html',
  styleUrls: ['./detalle-consumo.component.css']
})
export class DetalleConsumoComponent implements OnInit {
  listOfData: ConsumoDetallePlanta[] = [];
  fechaInicio: any = new Date;
  fechaFin: any = new Date;
  tiempo: string = '';
  habilitarfecha: boolean = true;
  facturado: boolean = false;
//Variables nuevas
  totalConsumo: number = 0;
  totalProduccion: number = 0;
  totalReposicion: number = 0;
  totalConsumoCaliente: number = 0;
  totalDiferencia: number = 0;
  chartConsumo!: Chart<"pie", string[], string>;
  chartProduccion!: Chart<"pie", string[], string>;
  chartHistorico!: Chart<keyof ChartTypeRegistry, number[], string>;
  chartBarraComparativa!: Chart;
  aguaVSproduccion!: Chart;
  dataConsumo: esquemaDatos[] = [];
  consumoTotal: number = 0;
  expand: boolean = false;
  validateForm: FormGroup = this.fb.group({
    tiempo: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    retrieval: ['', [Validators.required]],
  });
  dataExcel: any[] = [];
  historicoConsumo: HistoricoConsumo[] = [];
  totales!: TotalesHistorico;
  constructor(
    private endPoint: EndPointService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.CleanFrom();
    this.mostrar();
    console.log(this.dataConsumo);
  }

  CleanFrom(){
    this.validateForm = this.fb.group({
      tiempo: ['', [Validators.required]],
      fecha: [[this.fechaInicio, this.fechaFin], [Validators.required]],
      retrieval: [1, [Validators.required]],
    })
  }

  submitForm(){
      this.validateForm.value.fecha[0] = moment(this.validateForm.value.fecha[0]).format('YYYY-MM-DD hh:mm');  
      this.validateForm.value.fecha[1] = moment(this.validateForm.value.fecha[1]).format('YYYY-MM-DD hh:mm');  
      
      this.fechaInicio = this.validateForm.value.fecha[0];
      this.fechaFin = this.validateForm.value.fecha[1];
      console.log(this.validateForm.value.fecha);
      
      this.endPoint.Post( {
        fechaInicial: this.validateForm.value.fecha[0],
        fechaFinal: this.validateForm.value.fecha[1],
        retrieval: this.validateForm.value.retrieval,
      } ,'consumo-detalle').subscribe(
        (result: any) => {
          this.listOfData = result;
          console.log(this.listOfData);
          
          this.agregarConsumos(this.listOfData);
          this.historicoConsumo = [... this.historicoConsumo];
          console.log(this.historicoConsumo);
          
        }
      );
      console.log(this.validateForm.value);
  }
  
  agregarConsumos(listOfData: ConsumoDetallePlanta[]){
    this.historicoConsumo.length = 0;
    let consumor1: number = 0, consumor2: number = 0, consumor3: number = 0, consumor4: number = 0, consumor5: number = 0, consumor6: number = 0;
    let prod1: number = 0, prod2: number = 0, prod3: number = 0, prod4: number = 0, prod5: number = 0, prod6: number = 0;

    let maxWith: number = 0;
    for (let i = 0; i < listOfData.length; i++) {
      if(listOfData[i].historicoLocacion.length > maxWith){
        maxWith = listOfData[i].historicoLocacion.length;
      }
    }
    for (let i = 0; i < maxWith; i++) {
      this.historicoConsumo.push({
        date: new Date(Date.now()),
        r1: 0,
        r2: 0,
        r3: 0,
        r4: 0,
        r5: 0,
        r6: 0,
        r1Prod: 0,
        r2Prod: 0,
        r3Prod: 0,
        r4Prod: 0,
        r5Prod: 0,
        r6Prod:0,
      });
    }
    console.log("maxw: " + maxWith);
    
    for (let i = 0; i < listOfData.length; i++) {
      for (let j = 0; j < listOfData[i].historicoLocacion.length; j++) {
        if(i == 0){
          console.log(listOfData[i].historicoLocacion[j].diferencia);
          
          this.historicoConsumo[j].date = listOfData[i].historicoLocacion[j].date;
          this.historicoConsumo[j].r2 = listOfData[i].historicoLocacion[j].diferencia;
          this.historicoConsumo[j].r1 = this.historicoConsumo[j].r1;
          this.historicoConsumo[j].r3 = this.historicoConsumo[j].r3;
          this.historicoConsumo[j].r4 = this.historicoConsumo[j].r4;
          this.historicoConsumo[j].r5 = this.historicoConsumo[j].r5;
          this.historicoConsumo[j].r6 = this.historicoConsumo[j].r6;
          consumor1 += listOfData[i].historicoLocacion[j].diferencia;
        }
        if(i == 1){
          this.historicoConsumo[j].r2 = this.historicoConsumo[j].r2;
          this.historicoConsumo[j].r1 = listOfData[i].historicoLocacion[j].diferencia;
          this.historicoConsumo[j].r3 = this.historicoConsumo[j].r3;
          this.historicoConsumo[j].r4 = this.historicoConsumo[j].r4;
          this.historicoConsumo[j].r5 = this.historicoConsumo[j].r5;
          this.historicoConsumo[j].r6 = this.historicoConsumo[j].r6;
          consumor2 += listOfData[i].historicoLocacion[j].diferencia;
        }
        if(i == 2){
          this.historicoConsumo[j].r2 = this.historicoConsumo[j].r2;
          this.historicoConsumo[j].r1 = this.historicoConsumo[j].r1;
          this.historicoConsumo[j].r3 = listOfData[i].historicoLocacion[j].diferencia;
          this.historicoConsumo[j].r4 = this.historicoConsumo[j].r4;
          this.historicoConsumo[j].r5 = this.historicoConsumo[j].r5;
          this.historicoConsumo[j].r6 = this.historicoConsumo[j].r6;
          consumor3 += listOfData[i].historicoLocacion[j].diferencia;
        }
        if(i == 3){
          this.historicoConsumo[j].r2 = this.historicoConsumo[j].r2;
          this.historicoConsumo[j].r1 = this.historicoConsumo[j].r1;
          this.historicoConsumo[j].r3 = this.historicoConsumo[j].r3;
          this.historicoConsumo[j].r4 = listOfData[i].historicoLocacion[j].diferencia;
          this.historicoConsumo[j].r5 = this.historicoConsumo[j].r5;
          this.historicoConsumo[j].r6 = this.historicoConsumo[j].r6;
          consumor4 += listOfData[i].historicoLocacion[j].diferencia;
        }
        if(i == 4){
          this.historicoConsumo[j].r2 = this.historicoConsumo[j].r2;
          this.historicoConsumo[j].r1 = this.historicoConsumo[j].r1;
          this.historicoConsumo[j].r3 = this.historicoConsumo[j].r3;
          this.historicoConsumo[j].r4 = this.historicoConsumo[j].r4;
          this.historicoConsumo[j].r5 = listOfData[i].historicoLocacion[j].diferencia;
          this.historicoConsumo[j].r6 = this.historicoConsumo[j].r6;
          consumor5 += listOfData[i].historicoLocacion[j].diferencia;
        }
        if(i == 5){
          this.historicoConsumo[j].r2 = this.historicoConsumo[j].r2;
          this.historicoConsumo[j].r1 = this.historicoConsumo[j].r1;
          this.historicoConsumo[j].r3 = this.historicoConsumo[j].r3;
          this.historicoConsumo[j].r4 = this.historicoConsumo[j].r4;
          this.historicoConsumo[j].r5 = this.historicoConsumo[j].r5;
          this.historicoConsumo[j].r6 = listOfData[i].historicoLocacion[j].diferencia;
          consumor6 += listOfData[i].historicoLocacion[j].diferencia;
        }
      }
      for (let j = 0; j < listOfData[i].historicoProduccionLocacion.length; j++) {
        if(i == 0){
          console.log(listOfData[i].historicoProduccionLocacion[j].diferencia);
          
          this.historicoConsumo[j].date = listOfData[i].historicoProduccionLocacion[j].date;
          this.historicoConsumo[j].r2Prod = listOfData[i].historicoProduccionLocacion[j].diferencia;
          this.historicoConsumo[j].r1Prod = this.historicoConsumo[j].r1Prod;
          this.historicoConsumo[j].r3Prod = this.historicoConsumo[j].r3Prod;
          this.historicoConsumo[j].r4Prod = this.historicoConsumo[j].r4Prod;
          this.historicoConsumo[j].r5Prod = this.historicoConsumo[j].r5Prod;
          this.historicoConsumo[j].r6Prod = this.historicoConsumo[j].r6Prod;
          prod1 += listOfData[i].historicoProduccionLocacion[j].diferencia;
        }
        if(i == 1){
          this.historicoConsumo[j].r2Prod = this.historicoConsumo[j].r2Prod;
          this.historicoConsumo[j].r1Prod = listOfData[i].historicoProduccionLocacion[j].diferencia;
          this.historicoConsumo[j].r3Prod = this.historicoConsumo[j].r3Prod;
          this.historicoConsumo[j].r4Prod = this.historicoConsumo[j].r4Prod;
          this.historicoConsumo[j].r5Prod = this.historicoConsumo[j].r5Prod;
          this.historicoConsumo[j].r6Prod = this.historicoConsumo[j].r6Prod;
          prod2 += listOfData[i].historicoProduccionLocacion[j].diferencia;
        }
        if(i == 2){
          this.historicoConsumo[j].r2Prod = this.historicoConsumo[j].r2Prod;
          this.historicoConsumo[j].r1Prod = this.historicoConsumo[j].r1Prod;
          this.historicoConsumo[j].r3Prod = listOfData[i].historicoProduccionLocacion[j].diferencia;
          this.historicoConsumo[j].r4Prod = this.historicoConsumo[j].r4Prod;
          this.historicoConsumo[j].r5Prod = this.historicoConsumo[j].r5Prod;
          this.historicoConsumo[j].r6Prod = this.historicoConsumo[j].r6Prod;
          prod3 += listOfData[i].historicoProduccionLocacion[j].diferencia;
        }
        if(i == 3){
          this.historicoConsumo[j].r2Prod = this.historicoConsumo[j].r2Prod;
          this.historicoConsumo[j].r1Prod = this.historicoConsumo[j].r1Prod;
          this.historicoConsumo[j].r3Prod = this.historicoConsumo[j].r3Prod;
          this.historicoConsumo[j].r4Prod = listOfData[i].historicoProduccionLocacion[j].diferencia;
          this.historicoConsumo[j].r5Prod = this.historicoConsumo[j].r5Prod;
          this.historicoConsumo[j].r6Prod = this.historicoConsumo[j].r6Prod;
          prod4 += listOfData[i].historicoProduccionLocacion[j].diferencia;
        }
        if(i == 4){
          this.historicoConsumo[j].r2Prod = this.historicoConsumo[j].r2Prod;
          this.historicoConsumo[j].r1Prod = this.historicoConsumo[j].r1Prod;
          this.historicoConsumo[j].r3Prod = this.historicoConsumo[j].r3Prod;
          this.historicoConsumo[j].r4Prod = this.historicoConsumo[j].r4Prod;
          this.historicoConsumo[j].r5Prod = listOfData[i].historicoProduccionLocacion[j].diferencia;
          this.historicoConsumo[j].r6Prod = this.historicoConsumo[j].r6Prod;
          prod5 += listOfData[i].historicoProduccionLocacion[j].diferencia;
        }
        if(i == 5){
          this.historicoConsumo[j].r2Prod = this.historicoConsumo[j].r2Prod;
          this.historicoConsumo[j].r1Prod = this.historicoConsumo[j].r1Prod;
          this.historicoConsumo[j].r3Prod = this.historicoConsumo[j].r3Prod;
          this.historicoConsumo[j].r4Prod = this.historicoConsumo[j].r4Prod;
          this.historicoConsumo[j].r5Prod = this.historicoConsumo[j].r5Prod;
          this.historicoConsumo[j].r6Prod = listOfData[i].historicoProduccionLocacion[j].diferencia;
          prod6 += listOfData[i].historicoProduccionLocacion[j].diferencia;
        }
      }
    }
    this.totales ={
      r1Consumo: consumor1,
      r1Prod: prod1,
      r2Consumo: consumor2,
      r2Prod: prod2,
      r3Consumo: consumor3,
      r3Prod: prod3,
      r4Consumo: consumor4,
      r4Prod: prod4,
      r5Consumo: consumor5,
      r5Prod: prod5,
      r6Consumo: consumor6,
      r6Prod: prod6,
    }

  }

  ConstruirGraficoPieConsumo(data: HistoricoConsumo[]) {
    // const DATA_COUNT = 7;
    // const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};
    
    // Chart.register(ChartDataLabels);
    // this.chartHistorico  = new Chart('graficoHistorico', {
    //   type: 'line',
    //   data: {
    //     labels: data.map(item => (item.date).toISOString()),
    //     datasets: [
    //       {
    //         label: 'Dataset 2',
    //         data: data.map(item => (item.)),
    //         backgroundColor: 'rgba(0, 99, 132, 0.6)',
    //         borderColor: 'rgba(0, 99, 132, 1)',
    //         stack: 'line'
          
    //       }
    //     ]
    //   },
    //   options:  {
    //   }
    // });
  
  
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
      console.log(this.validateForm);
      
      switch (this.validateForm.value.tiempo) {
        case 1: {
          console.log(moment().add(-1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'), moment().startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment().add(-1, 'day').startOf('day').format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment().startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 2: {
          console.log(moment(moment().startOf('week')).format('YYYY-MM-DD HH:mm'), moment().startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('week')).format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment().startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 3: {
          console.log(moment().startOf('year').format('YYYY-MM-DD HH:mm'), moment().startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment().startOf('year').format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment().startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 4: {
          console.log(moment(moment().startOf('week').subtract(1, 'week')).format('YYYY-MM-DD HH:mm'));
          console.log(moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('week').subtract(1, 'week')).format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 5: {
          console.log(moment(moment().startOf('week').subtract(2, 'week')).format('YYYY-MM-DD HH:mm'));
          console.log(moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('week').subtract(2, 'week')).format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment(moment().endOf('week').subtract(1, 'week')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 6: {
          console.log(moment().startOf('month').format('YYYY-MM-DD HH:mm'), moment().startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment().startOf('month').format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment().startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 7: {
          console.log(moment(moment().startOf('month').subtract(1, 'month')).format('YYYY-MM-DD HH:mm'));
          console.log(moment(moment().endOf('month').subtract(1, 'month')).add(2, 'day').startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('month').subtract(1, 'month')).format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment(moment().endOf('month').subtract(1, 'month')).add(2, 'day').startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 8: {
          console.log(moment(moment().startOf('year').subtract(1, 'year')).format('YYYY-MM-DD HH:mm'));
          console.log(moment(moment().endOf('year').subtract(1, 'year')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm'));
          this.validateForm.value.fecha[0] = moment(moment().startOf('year').subtract(1, 'year')).format('YYYY-MM-DD HH:mm');
          this.validateForm.value.fecha[1] = moment(moment().endOf('year').subtract(1, 'year')).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm');
          this.submitForm();
          break;
        }
        case 9: {
          console.log("entre");
          
          this.submitForm();
          
          break;
        }
        default: {
          this.validateForm.value.fecha[0] =  "2022-08-31 11:00:00";
          this.validateForm.value.fecha[1] =  "2022-08-31 11:30:00";
          this.submitForm();
          break;
        }

      }
      this.fechaInicio = this.validateForm.value.fecha[0];
      this.fechaFin = this.validateForm.value.fecha[1];
    
    this.facturado = true;
    


}
  changeFecha(event: any) {

    console.log(event)
    this.habilitarfecha = (event == 9) ? false : true;
  }

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

  async pdf() {
    console.log('imprimir');
    const div: any = document.getElementById('content');
    var doc = new jsPDF('p', 'mm', 'a4', true);
    const options = {
      background: 'white',
      scale: 3
    };
      if(div){
        html2canvas(div, options).then((canvas) => {
          var imgWidth = 210;
          var pageHeight = 290;
          var imgHeight = canvas.height * imgWidth / canvas.width;
          var heightLeft = imgHeight;
    
    
          var position = 5;
          var pageData = canvas.toDataURL('image/jpeg', 1.0);
          var imgData = encodeURIComponent(pageData);
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          doc.setLineWidth(5);
          doc.setDrawColor(255, 255, 255);
          doc.rect(0, 0, 210, 295);
          heightLeft -= pageHeight;
    
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            doc.setLineWidth(5);
            doc.setDrawColor(255, 255, 255);
            doc.rect(0, 0, 210, 295);
            heightLeft -= pageHeight;
          }
          return doc;
        }).then(async (doc) => {
          doc.save(`DetalleConsumo.pdf`);
        }
        )
      }

    }

}
