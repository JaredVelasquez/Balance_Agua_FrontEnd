export interface Lecturas {
  tag_name: string,
  date: Date,
  value: number
}

export interface ConsultaConsumo {
  fechaInicial: string,
  fechaFinal: string,
}


export interface EquiposLocacion {
  locacionId: number,
  tipoEquipoId: number,
  tipoLocacionId: number,
  tipoFuncionId: number,
  tagName: string,
  descLoca: string,
  descEquipo: string,
}

export interface DatosEquipo {
  tag_name: string,
  descripcion: string,
  tipoFuncionId: number,
  fechaInicial: string,
  fechaFinal: string,
  lecturaInicial: number,
  lecturaFinal: number,
  consumo: number,
}

export interface GraficoPie {
  tag_name: string;
  descripcion: string;
  value: number;
}
export interface RelacionSecundaria {
  id: number,
  equipoId: number,
  locacionId: number,
  estado: boolean,
}
export interface LocacionRelacionada {
  id: number,
  locacionPrincipalId: number,
  locacionSecundId: number,
  estado: boolean,
}
export interface Locacion {
  id: number,
  descripcion: string,
  observacion: string,
  tipoLocacionId: number,
  estado: boolean
}

export interface CalidadAgua {
  conductividadPromedio: number,
  potencialreduccionPromedio: number,
  potencialhidrogenoPromedio: number,
  presionPromedio: number,
  contConductividad: number,
  contPH: number,
  contPR: number,
  contPresion: number;
}

export interface esquemaDatos {
  locacion: Locacion,
  equipos: {
    datos: DatosEquipo[],
    expands: boolean,
    expands2: boolean,
    expands3: boolean
  },
  relaciones: RelacionSecundaria[],
  locacionesRelacionadas: esquemaDatos[],
  calidadagua: CalidadAgua,
  consumototal: number,
  producciontotal: number,
  reposiciontotal: number,
  consumocalientetotal: number

}

export interface ConsumoPlantaRangoFecha {
  date: Date,
  diferencia: number,
}
export interface DatosEquipoDetalle {
  tag_name: string,
  descripcion: string,
  tipoFuncionId: number,
  datos: DatosEquipo[]
}
export interface EquipoRelacionado {
  id: number,
  equipoId: number,
  locacionId: number,
  estado: boolean,
}
export interface LocacionRelacionada {
  id: number,
  locacionPrincipalId: number,
  locacionSecundId: number,
  estado: boolean,
}


export interface ConsumoDetallePlanta {
  locacion: Locacion,
  equipos: DatosEquipoDetalle[],
  historicoLocacion: ConsumoPlantaRangoFecha[],
  historicoProduccionLocacion: ConsumoPlantaRangoFecha[],
  expands: boolean,
  expands2: boolean,
  expands3: boolean
  consumototal: number,
  producciontotal: number,
}

export interface HistoricoConsumo{
  date: Date,
  r1: number,
  r2: number,
  r3: number,
  r4: number,
  r5: number,
  r6:number,
  r1Prod: number,
  r2Prod: number,
  r3Prod: number,
  r4Prod: number,
  r5Prod: number,
  r6Prod:number,
}

export interface TotalesHistorico{
  r1Consumo: number,
  r2Consumo: number,
  r3Consumo: number,
  r4Consumo: number,
  r5Consumo: number,
  r6Consumo:number,
  r1Prod: number,
  r2Prod: number,
  r3Prod: number,
  r4Prod: number,
  r5Prod: number,
  r6Prod:number,
}