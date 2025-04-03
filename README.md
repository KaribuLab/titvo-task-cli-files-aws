# Proyecto Base IVR

## Uso del Template

Para utilizar este template en un nuevo proyecto, ejecuta el siguiente comando:

```shell
kli project git@github.com:KaribuLab/titvo-base-lambda-apigateway.git
```

## Requisitos

- [NVM](https://github.com/nvm-sh/nvm)
- [Task](https://taskfile.dev/installation/)
- [Terraform](https://developer.hashicorp.com/terraform/install?product_intent=terraform)
- [Terragrunt](https://terragrunt.gruntwork.io/docs/getting-started/install/)

> [!IMPORTANT]
> En windows se **DEBE** usar [Windows Subsystem for Linux 2 (WSL2)](https://learn.microsoft.com/es-es/windows/wsl/install)

## Estructura del Proyecto

```shell
.
├── aws                  # Recursos de AWS
│   ├── cloudwatch       # Configuración de CloudWatch
│   ├── lambda           # Configuración de Lambda
│   └── parameter        # Parámetros de AWS
├── localstack           # Configuración para desarrollo local
├── template             # Plantillas para el proyecto
├── .vscode              # Configuración de VS Code
├── package.json         # Dependencias del proyecto
├── serverless.hcl       # Configuración de Serverless
├── terragrunt.hcl       # Configuración de Terragrunt
├── tsconfig.json        # Configuración de TypeScript
└── localstack.hcl       # Configuración adicional de LocalStack
```

## Desarrollo Local

Para el desarrollo local, se utiliza LocalStack. La configuración se encuentra en el archivo `localstack.hcl`.