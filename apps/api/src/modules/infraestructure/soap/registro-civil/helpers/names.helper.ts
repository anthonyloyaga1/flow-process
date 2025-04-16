import { DETERMINATIVOS } from '../constants/determinatives.enum';

function dividirNombreCompleto(fullName: string) {
  try {
    const fullNameArray = fullName.split(' ');
    // Convertimos los valores del enum a un arreglo
    const determinativos = Object.values(DETERMINATIVOS) as string[];
    const result: string[] = [];
    let nameAux = '';

    fullNameArray.forEach((simpleName) => {
      if (determinativos.includes(simpleName.toUpperCase())) {
        // Asumiendo que los determinativos están en mayúsculas en el enum
        nameAux += ` ${simpleName}`;
      } else if (nameAux !== '') {
        result.push(nameAux.trim() + ' ' + simpleName);
        nameAux = '';
      } else {
        result.push(simpleName);
      }
    });

    // Asegurarse de agregar el último nombre auxiliar si no está vacío
    if (nameAux !== '') {
      result.push(nameAux.trim());
    }

    return result;
  } catch {
    return null;
  }
}

export interface NombresPersona {
  primerNombre?: string;
  segundoNombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nombreCompleto?: string;
}

export function generarNombreApellidoDesdeNombreCompleto(nombreCompleto: string) {
  const nombreParsed = dividirNombreCompleto(nombreCompleto);
  const nombres: NombresPersona = {};

  if (nombreParsed != null && (nombreParsed.length >= 5 || nombreParsed.length <= 3)) {
    nombres.nombreCompleto = nombreCompleto;
    nombres.primerNombre = '';
    nombres.segundoNombre = '';
    nombres.apellidoPaterno = '';
    nombres.apellidoMaterno = '';
    return nombres;
  }

  if (nombreParsed != null && nombreParsed.length == 4) {
    const [apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre] = nombreParsed;
    nombres.nombreCompleto = nombreCompleto;
    nombres.apellidoPaterno = apellidoPaterno || '';
    nombres.apellidoMaterno = apellidoMaterno || '';
    nombres.primerNombre = primerNombre || '';
    nombres.segundoNombre = segundoNombre || '';
    return nombres;
  }
  return nombres;
}
