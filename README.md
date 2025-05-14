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

Modifica los valores del archivo `serverless.hcl` con los valores de tu proyecto.

```hcl
locals {
  region = get_env("AWS_REGION")
  stage  = get_env("AWS_STAGE")
  stages = {
    test = {
      name = "Testing"
    },
    localstack = {
      name = "Localstack"
    },
    prod = {
      name = "Production"
    }
  }
  service_name   = "my-service"
  service_bucket = "${local.service_name}-${local.region}"
  log_retention  = 7
  parameter_path = "/my-service"
  common_tags = {
    my_tag = "my-tag-value"
  }
}
```

1. Clone el repositorio en la máquina local.

  ```shell
  git clone https://github.com/KaribuLab/titvo-task-cli-files.git
  cd titvo-task-cli-files
  git submodule init
  git submodule update
  ```

2. Primero necesitará cargar las variables ambiente con las credenciales de AWS.

  ```shell
  export AWS_ACCESS_KEY_ID="..."
  export AWS_SECRET_ACCESS_KEY="..."
  export AWS_SESSION_TOKEN="..."
  export AWS_REGION="..."
  export AWS_STAGE="..."
  ```

  O creando un archivo `.env` en la raíz del proyecto con las variables de entorno.

  ```shell
  export AWS_ACCESS_KEY_ID="..."
  export AWS_SECRET_ACCESS_KEY="..."
  export AWS_SESSION_TOKEN="..."
  export AWS_REGION="..."
  export AWS_STAGE="..."
  ```

  > [!NOTE]
  > Para cargar las variables de entorno, se puede usar el siguiente comando: `source .env`.

3. Luego, se puede proceder a instalar las dependencias y ejecutar el despliegue.

  ```shell
  npm install
  npm run build
  cd aws
  terragrunt run-all apply
  ```

## Licencia

Este proyecto está licenciado bajo [Apache License 2.0](LICENSE).