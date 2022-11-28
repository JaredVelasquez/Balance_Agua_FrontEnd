export interface Lecturas {
  tag_name: string,
  date: Date,
  value: number
}

export interface ConsultaConsumo {
  fechaInicial: string,
  fechaFinal: string,
}

export interface Locacion {
  id: number,
  descripcion: string,
  observacion: string,
  tipoLocacionId: number,
  estado: boolean
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

export interface esquemaDatos {
locacion: Locacion,
equipos: {
  datos: DatosEquipo[],
}
consumototal: number,
producciontotal: number,
reposiciontotal: number,
consumocalientetotal: number,
}
