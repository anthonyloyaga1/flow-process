const fs = require('fs');
const path = require('path');

// Función para crear carpetas y archivos
function createFile(filePath, content = '') {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
}

// Función principal para generar el scaffolding
function generateDDDModule(appName, moduleName, contextName) {
  const basePath = path.join(__dirname, 'apps', appName, 'src', 'contexts', contextName, moduleName);

  // Crear carpetas base
  const folders = [
    'application',
    'application/services',
    'application/use-cases',
    'application/dtos',
    'domain/entities',
    'domain/repositories',
    'domain/value-objects',
    'domain/events',
    'domain/exceptions',
    'domain/types',
    'domain/constants',
    'infraestructure/controllers',
    'infraestructure/repositories',
    'infraestructure/events',
    'infraestructure/events/consumers',
    'infraestructure/events/producers',
    'infraestructure/persistence',
    'infraestructure/persistence/migrations',
    'infraestructure/persistence/seeds',
    'infraestructure/persistence/repositories',
    'infraestructure/persistence/entities',
    'infraestructure/http-clients',
  ];

  folders.forEach((folder) => {
    const folderPath = path.join(basePath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });
    
    createFile(
      path.join(basePath, 'application', 'dtos', `${moduleName}.dto.ts`),
      `export class ${capitalize(moduleName)}CreateDto {
    // Definición del DTO para creación
    }

    export class ${capitalize(moduleName)}UpdateDto {
    // Definición del DTO para actualización
    }
    `
    );

  createFile(
    path.join(basePath, 'domain', 'entities', `${moduleName}.entity.ts`),
    `export class ${capitalize(moduleName)} {
  // Definición de la entidad
}
`
  );

  createFile(
    path.join(basePath, 'domain', 'repositories', `${moduleName}.repository.ts`),
    `export interface ${capitalize(moduleName)}Repository {
  // Definición del repositorio
}
`
  );

  createFile(
    path.join(basePath, 'infraestructure', 'controllers', `${moduleName}.controller.ts`),
    `import { Controller } from '@nestjs/common';
import { ${capitalize(moduleName)}Service } from '../../application/${moduleName}.service';

@Controller('${moduleName}')
export class ${capitalize(moduleName)}Controller {}
`
  );


  createFile(
    path.join(basePath, `${moduleName}.module.ts`),
    `import { Module } from '@nestjs/common';

import { ${capitalize(moduleName)}Controller } from './infraestructure/controllers/${moduleName}.controller';

@Module({
  controllers: [${capitalize(moduleName)}Controller],
  providers: [],
})
export class ${capitalize(moduleName)}Module {}
`
  );

  console.log(`Módulo ${moduleName} generado exitosamente en ${basePath}`);
}

// Función para capitalizar el nombre del módulo
function capitalize(str) {
  return str
    .split('-') // Divide el string en partes usando el guion como separador
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza cada palabra
    .join(''); // Une las palabras sin espacios
}

function toCamelCase(str) {
  return str
    .split('-') // Divide el string en partes usando el guion como separador
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)
    ) // La primera palabra queda en minúscula, las demás se capitalizan
    .join(''); // Une las palabras sin espacios
}

// Ejecutar el script con el nombre de la aplicación y el módulo como argumentos
const appName = process.argv[2];
const contextName = process.argv[3];
const moduleName = process.argv[4];

if (!appName || !moduleName) {
  console.error('Por favor, proporciona el nombre de la aplicación y del módulo.');
  console.error('Uso: node generate-ddd-module.js <appName> <moduleName>');
  process.exit(1);
}

generateDDDModule(appName, moduleName, contextName);