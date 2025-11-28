const API_BASE_URL = 'http://localhost:5034/api/products'

// Traer todos los productos
export async function getProducts() {
  const res = await fetch(API_BASE_URL)

  if (!res.ok) {
    throw new Error('Error al obtener productos')
  }

  return await res.json()
}

// Crear producto nuevo
export async function createProduct(product) {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(errorBody?.title || 'Error al crear producto')
  }

  return await res.json()
}

// Actualizar producto
export async function updateProduct(id, product) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(errorBody?.title || 'Error al actualizar producto')
  }
}

// Eliminar producto
export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(errorBody?.title || 'Error al eliminar producto')
  }
}
