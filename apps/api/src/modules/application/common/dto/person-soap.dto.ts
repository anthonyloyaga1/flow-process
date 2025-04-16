import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class PersonSoapDto {
  @Expose()
  @ApiProperty({ example: '1234567890', description: 'Cédula de identidad' })
  cedula?: string;

  @Expose()
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
  nombreCompleto?: string;

  @Expose()
  @ApiProperty({ example: 'Juan', description: 'Primer nombre' })
  primerNombre?: string;

  @Expose()
  @ApiProperty({ example: 'Pérez', description: 'Primer apellido' })
  segundoNombre?: string;

  @Expose()
  @ApiProperty({ example: 'Pérez', description: 'Segundo apellido' })
  apellidoPaterno?: string;

  @Expose()
  @ApiProperty({ example: 'Pérez', description: 'Apellido materno' })
  apellidoMaterno?: string;

  @Expose()
  @ApiProperty({ example: new Date(), description: 'Fecha de fallecimiento' })
  fechaFallecimiento?: string;

  @Expose()
  @ApiProperty({ example: new Date(), description: 'Fecha de inscripción de defunción' })
  fechaInscripcionDefuncion?: string;

  @Expose()
  @ApiProperty({ example: new Date(), description: 'Fecha de nacimiento' })
  fechaNacimiento?: string;

  @Exclude()
  @ApiProperty({ example: 'Calle', description: 'Calle' })
  calle?: string;

  @Exclude()
  @ApiProperty({ example: 'Cedulado', description: 'Condición de cedulado' })
  condicionCedulado?: string;

  @Exclude()
  @ApiProperty({ example: 'María Pérez', description: 'Nombre del cónyuge' })
  conyuge?: string;

  @Exclude()
  @ApiProperty({ example: 'Domicilio', description: 'Domicilio' })
  domicilio?: string;

  @Exclude()
  @ApiProperty({ example: 'Soltero', description: 'Estado civil' })
  estadoCivil?: string;

  @Exclude()
  @ApiProperty({ example: new Date(), description: 'Fecha de cedulación' })
  fechaCedulacion?: string;

  @Exclude()
  @ApiProperty({ example: new Date(), description: 'Fecha de inscripción de género' })
  fechaInscripcionGenero?: string;

  @Exclude()
  @ApiProperty({ example: 'Masculino', description: 'Género' })
  genero?: string;

  @Exclude()
  instruccion?: string;

  @Exclude()
  lugarInscripcionGenero?: string;

  @Exclude()
  lugarNacimiento?: string;

  @Expose()
  nui?: string;

  @Exclude()
  nacionalidad?: string;

  @Exclude()
  nombreMadre?: string;

  @Exclude()
  nombrePadre?: string;

  @Exclude()
  numeroCasa?: string;

  @Exclude()
  profesion?: string;

  @Expose()
  sexo?: string;
}
