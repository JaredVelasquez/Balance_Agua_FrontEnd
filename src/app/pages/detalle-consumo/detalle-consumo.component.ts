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
import { formatDate } from '@angular/common';

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
  chartProduccion!: Chart<"line", string[], string>;
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
  labelsGragicos: Array<string> = [];
  r1consumo: Array<number> = [];
  r2consumo: Array<number> = [];
  r3consumo: Array<number> = [];
  r4consumo: Array<number> = [];
  r5consumo: Array<number> = [];
  r6consumo: Array<number> = [];
  r1prod: Array<number> = [];
  r2prod: Array<number> = [];
  r3prod: Array<number> = [];
  r4prod: Array<number> = [];
  r5prod: Array<number> = [];
  r6prod: Array<number> = [];


  constructor(
    private endPoint: EndPointService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.CleanFrom();
    this.mostrar();
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
      
      this.endPoint.Post( {
        fechaInicial: this.validateForm.value.fecha[0],
        fechaFinal: this.validateForm.value.fecha[1],
        retrieval: this.validateForm.value.retrieval,
      } ,'consumo-detalle').subscribe(
        (result: any) => {
          this.listOfData = result;
          this.agregarConsumos(this.listOfData);
          this.historicoConsumo = [... this.historicoConsumo];
          console.log(this.listOfData);
          this.ConstruirGraficos(this.listOfData, this.historicoConsumo,this.r1consumo,
            this.r2consumo,
            this.r3consumo,
            this.r4consumo,
            this.r5consumo,
            this.r6consumo,
            this.r1prod,
            this.r2prod,
            this.r3prod,
            this.r4prod,
            this.r5prod,
            this.r6prod);
          
        }
      );
      this.chartProduccion.update();
      console.log(this.validateForm.value);
  }
  
  ConstruirGraficos(data: ConsumoDetallePlanta[], historicoConsumo: HistoricoConsumo[],
    r1consumo: Array<number>,
    r2consumo: Array<number>,
    r3consumo: Array<number>,
    r4consumo: Array<number>,
    r5consumo: Array<number>,
    r6consumo: Array<number>,
    r1prod: Array<number>,
    r2prod: Array<number>,
    r3prod: Array<number>,
    r4prod: Array<number>,
    r5prod: Array<number>,
    r6prod: Array<number>) {
      console.log("r1");
      console.log(r1consumo);
      
      
    this.chartProduccion = new Chart('canvasProduccion', {
      type: 'line',
      data: {
        labels: historicoConsumo.map(item => formatDate(item.date, "d/M/Y hh:mm" , 'en-US', 'UTC/GMT')),
        datasets: [{
          label: 'R1',
          data: r1consumo.map(item => item.toString()),
          backgroundColor: 'rgba(255, 159, 64)',
        },
        {
          label: 'R2',
          data: r2consumo.map(item => (item).toString()),
          backgroundColor: 'rgba(255, 99, 132)'
        },
        {
          label: 'R3',
          data: r3consumo.map(item => item.toString()),
          backgroundColor: 'rgba(255, 99, 132)'
        },
        {
          label: 'R4',
          data: r4consumo.map(item => item.toString()),
          backgroundColor: 'rgba(255, 99, 132)'
        },
        {
          label: 'R5',
          data: r5consumo.map(item => item.toString()),
          backgroundColor: 'rgba(255, 99, 132)'
        },
        {
          label: 'R6',
          data: r6consumo.map(item => item.toString()),
          backgroundColor: 'rgba(255, 99, 132)'
        }
    ]}
    });
  
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
      
        this.r1consumo.push(0);
        this.r2consumo.push(0);
        this.r3consumo.push(0);
        this.r4consumo.push(0);
        this.r5consumo.push(0);
        this.r6consumo.push(0);
        this.r1prod.push(0);
        this.r2prod.push(0);
        this.r3prod.push(0);
        this.r4prod.push(0);
        this.r5prod.push(0);
        this.r6prod.push(0);
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
        if(listOfData[i].historicoLocacion[j].diferencia != null){
          if(i == 0){
            console.log(listOfData[i].historicoLocacion[j].diferencia);
            
            this.r2consumo[j] = (listOfData[i].historicoLocacion[j].diferencia);
            this.historicoConsumo[j].date = listOfData[i].historicoLocacion[j].date;
            this.historicoConsumo[j].r2 = listOfData[i].historicoLocacion[j].diferencia;
            consumor1 += listOfData[i].historicoLocacion[j].diferencia;
          }
          if(i == 1){
            this.r1consumo[j] = (listOfData[i].historicoLocacion[j].diferencia);
            this.historicoConsumo[j].r1 = listOfData[i].historicoLocacion[j].diferencia;
            consumor2 += listOfData[i].historicoLocacion[j].diferencia;
          }
          if(i == 2){
            this.r3consumo[j] = (listOfData[i].historicoLocacion[j].diferencia);
            this.historicoConsumo[j].r3 = listOfData[i].historicoLocacion[j].diferencia;
            consumor3 += listOfData[i].historicoLocacion[j].diferencia;
          }
          if(i == 3){
            this.r4consumo[j] = (listOfData[i].historicoLocacion[j].diferencia);
            this.historicoConsumo[j].r4 = listOfData[i].historicoLocacion[j].diferencia;
            consumor4 += listOfData[i].historicoLocacion[j].diferencia;
          }
          if(i == 4){
            this.r5consumo[j] = (listOfData[i].historicoLocacion[j].diferencia);
            this.historicoConsumo[j].r5 = listOfData[i].historicoLocacion[j].diferencia;
            consumor5 += listOfData[i].historicoLocacion[j].diferencia;
          }
          if(i == 5){
            this.r6consumo[j] = (listOfData[i].historicoLocacion[j].diferencia);
            this.historicoConsumo[j].r6 = listOfData[i].historicoLocacion[j].diferencia;
            consumor6 += listOfData[i].historicoLocacion[j].diferencia;
          }
        }
      }
        for (let j = 0; j < listOfData[i].historicoProduccionLocacion.length; j++) {
          if(listOfData[i].historicoProduccionLocacion[j].diferencia != null){
            if(i == 0){
              console.log(listOfData[i].historicoProduccionLocacion[j].diferencia);
              
              this.r2prod[j] = (listOfData[i].historicoLocacion[j].diferencia);
              this.historicoConsumo[j].date = listOfData[i].historicoProduccionLocacion[j].date;
              this.historicoConsumo[j].r2Prod = listOfData[i].historicoProduccionLocacion[j].diferencia;
              prod1 += listOfData[i].historicoProduccionLocacion[j].diferencia;
            }
            if(i == 1){
              this.r1prod[j] = (listOfData[i].historicoLocacion[j].diferencia);
              this.historicoConsumo[j].r1Prod = listOfData[i].historicoProduccionLocacion[j].diferencia;
              prod2 += listOfData[i].historicoProduccionLocacion[j].diferencia;
            }
            if(i == 2){
              this.r3prod[j] = (listOfData[i].historicoLocacion[j].diferencia);
              this.historicoConsumo[j].r3Prod = listOfData[i].historicoProduccionLocacion[j].diferencia;
              prod3 += listOfData[i].historicoProduccionLocacion[j].diferencia;
            }
            if(i == 3){
              this.r4prod[j] = (listOfData[i].historicoLocacion[j].diferencia);
              this.historicoConsumo[j].r4Prod = listOfData[i].historicoProduccionLocacion[j].diferencia;
              prod4 += listOfData[i].historicoProduccionLocacion[j].diferencia;
            }
            if(i == 4){
              this.r4prod[j] = (listOfData[i].historicoLocacion[j].diferencia);
              this.historicoConsumo[j].r5Prod = listOfData[i].historicoProduccionLocacion[j].diferencia;
              prod5 += listOfData[i].historicoProduccionLocacion[j].diferencia;
            }
            if(i == 5){
              this.r6prod[j] = (listOfData[i].historicoLocacion[j].diferencia);
              this.historicoConsumo[j].r6Prod = listOfData[i].historicoProduccionLocacion[j].diferencia;
              prod6 += listOfData[i].historicoProduccionLocacion[j].diferencia;
            }

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
      if (this.chartProduccion) {
        this.chartProduccion.destroy();
      }
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
          this.validateForm.value.fecha[0] =  "2022-08-31 7:30:00";
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
