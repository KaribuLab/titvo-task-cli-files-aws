/**
 * Busca un header en el objeto de headers sin importar mayúsculas/minúsculas
 * @param headers Objeto de headers
 * @param headerName Nombre del header a buscar
 * @returns El valor del header o undefined si no existe
 */
export function findHeaderCaseInsensitive (headers: Record<string, string | undefined>, headerName: string): string | undefined {
  const headerNameLower = headerName.toLowerCase()

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === headerNameLower) {
      return value
    }
  }

  return undefined
}
