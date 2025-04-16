import { NombresPersona } from '../helpers/names.helper';
import { PersonaSoap } from '../interfaces/persona.soap.interface';
import { PersonaRegistroCivil } from '../interfaces/registro-civil-info.interface';

export const PersonaSoapAdapter = (persona: PersonaRegistroCivil, nombresSeparados: NombresPersona): PersonaSoap => ({
  apellidoMaterno: nombresSeparados.apellidoMaterno,
  apellidoPaterno: nombresSeparados.apellidoPaterno,

  calle: persona.Calle,
  cedula: persona.NUI,
  condicionCedulado: persona.CondicionCedulado,
  conyuge: persona.Conyuge,
  domicilio: persona.Domicilio,
  estadoCivil: persona.EstadoCivil,
  fechaCedulacion: persona.FechaCedulacion,
  fechaFallecimiento: persona.FechaFallecimiento,
  fechaInscripcionDefuncion: persona.FechaInscripcionDefuncion,
  fechaInscripcionGenero: persona.FechaInscripcionGenero,
  fechaNacimiento: persona.FechaNacimiento,
  genero: persona.Genero,
  instruccion: persona.Instruccion,
  lugarInscripcionGenero: persona.LugarInscripcionGenero,
  lugarNacimiento: persona.LugarNacimiento,
  nacionalidad: persona.Nacionalidad,

  primerNombre: nombresSeparados.primerNombre,
  segundoNombre: nombresSeparados.segundoNombre,

  nombreCompleto: nombresSeparados.nombreCompleto,
  nombreMadre: persona.NombreMadre,
  nombrePadre: persona.NombrePadre,
  numeroCasa: persona.NumeroCasa,
  profesion: persona.Profesion,
  nui: persona.NUI,
  sexo: persona.Sexo,
});
