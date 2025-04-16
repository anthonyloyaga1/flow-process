export interface PersonaRegistroCivil {
  Calle: string;
  CondicionCedulado: string;
  Conyuge: string;
  Domicilio: string;
  EstadoCivil: string;
  FechaCedulacion: string;
  FechaFallecimiento: string;
  FechaInscripcionDefuncion: string;
  FechaInscripcionGenero: string;
  FechaNacimiento: string;
  Genero: string;
  Instruccion: string;
  LugarInscripcionGenero: string;
  LugarNacimiento: string;
  NUI: string;
  Nacionalidad: string;
  Nombre: string;
  NombreMadre: string;
  NombrePadre: string;
  NumeroCasa: string;
  Profesion: string;
  Sexo: string;
}

export interface Data {
  CodigoMensaje: string;
  Mensaje: string;
  Ciudadano: PersonaRegistroCivil;
}

export interface RegistroCivilInfo {
  return: Data;
}
