# Titvo Task CLI Files

Servicio AWS Lambda para la gestión y generación de URLs prefirmadas para archivos CLI.

## Descripción

Este servicio se encarga de generar URLs prefirmadas para la subida de archivos desde la interfaz de línea de comandos (CLI) a un bucket S3. El servicio valida las API keys y genera URLs seguras temporales para permitir la subida de archivos.

## Características

- Validación de API Keys para autenticación
- Generación de URLs prefirmadas para S3
- Manejo de lotes de archivos
- Control de errores robusto
- Registro de actividad

## Tecnologías

- NestJS como framework
- TypeScript para el desarrollo
- AWS Lambda para el despliegue
- AWS S3 para el almacenamiento
- AWS DynamoDB para la persistencia de datos
- Vitest para las pruebas unitarias

## Estructura del proyecto

```
src/
├── app.module.ts            # Módulo principal de la aplicación
├── entrypoint.ts            # Punto de entrada para AWS Lambda
├── infrastructure/          # Implementaciones de infraestructura
│   ├── api-key/             # Módulo de gestión de API keys
│   ├── cli-files/           # Módulo de gestión de archivos CLI
│   └── storage/             # Servicios de almacenamiento (S3)
└── utils/                   # Utilidades generales
```

## Instalación

```bash
# Instalar dependencias
npm install

# Compilar el proyecto
npm run build
```

## Pruebas

```bash
# Ejecutar pruebas unitarias
npm test
```

## Uso

El servicio está diseñado para ser desplegado como una función AWS Lambda y ser invocado mediante un API Gateway. Acepta solicitudes POST con la siguiente estructura:

```json
{
  "source": "source-name",
  "args": {
    "batch_id": "batch-identifier",
    "files": [
      {
        "name": "filename.ext",
        "content_type": "application/type"
      }
    ]
  }
}
```

Todas las solicitudes deben incluir un header `x-api-key` con una API key válida.

## Respuesta

El servicio responde con un objeto JSON que contiene:

```json
{
  "message": "URLs generadas con éxito",
  "presigned_urls": [
    {
      "name": "filename.ext",
      "url": "https://presigned-url.com"
    }
  ]
}
```

## Despliegue

Opcionalmente se puede crear un archivo common_tags.json con las etiquetas necesarias:

```json
{
  "Project": "Titvo Security Scan",
  "Customer": "Titvo",
  "Team": "Area Creacion"
}
```

1. Crear archivo .env con las variables necesarias descritas arriba
  ```bash
  export AWS_ACCESS_KEY_ID="tu_access_key"
  export AWS_SECRET_ACCESS_KEY="tu_secret_key"
  export AWS_DEFAULT_REGION="us-east-1"
  export AWS_STAGE="prod"
  export PROJECT_NAME="titvo-task-cli-files" # Opcional si quiere mantener los valores por defecto. Esto se usará como prefijo para los recursos
  export PARAMETER_PATH="/titvo/security-scan" # Opcional si quiere mantener los valores por defecto. Esto se usará como prefijo para los parámetros
  export BUCKET_STATE_NAME="titvo-task-cli-files-terraform-state" # Opcional, si no se especifica se usará el nombre del proyecto. Por ejemplo: titvo-security-scan-terraform-state
  ```
  > [!IMPORTANT]
  > `PARAMETER_PATH`deben tener los mismos valores que se usarion en el proyecto [titvo-security-scan-infra-aws](https://github.com/KaribuLab/titvo-security-scan-infra-aws)
1. Desplegar el proyecto
  ```bash
  npm install
  npm run build
  cd aws
  terragrunt run-all apply --terragrunt-non-interactive --auto-approve
  ```

## Licencia

Este proyecto está licenciado bajo [Apache License 2.0](LICENSE).