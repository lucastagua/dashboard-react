const API_BASE_URL = 'http://localhost:5034/api/products'

// Si estamos en build de producción (Vercel), usamos MOCK
const USE_MOCK = import.meta.env.PROD

// Datos mock para demo online
let mockProducts = [
  {
    id: 1,
    name: 'Notebook 15,6" Ryzen 5',
    category: 'Notebooks',
    price: 650000,
    stock: 8,
    description: 'Equipo para uso general y trabajo.',
    isActive: true,
  },
  {
    id: 2,
    name: 'Monitor 24" 144hz',
    category: 'Monitores',
    price: 210000,
    stock: 4,
    description: 'Monitor gamer 144hz.',
    isActive: true,
  },
  {
    id: 3,
    name: 'Teclado mecánico',
    category: 'Periféricos',
    price: 85000,
    stock: 0,
    description: 'Teclado mecánico con switches rojos.',
    isActive: false,
  },
]

// ------- MOCK para Vercel -------
async function mockGetProducts() {
  // simulamos delay
  await new Promise((r) => setTimeout(r, 250))
  return [...mockProducts]
}

async function mockCreateProduct(product) {
  await new Promise((r) => setTimeout(r, 200))
  const nextId = mockProducts.length
    ? Math.max(...mockProducts.map((p) => p.id)) + 1
    : 1

  const created = { ...product, id: nextId }
  mockProducts.push(created)
  return created
}

async function mockUpdateProduct(id, product) {
  await new Promise((r) => setTimeout(r, 200))
  mockProducts = mockProducts.map((p) => (p.id === id ? { ...product } : p))
}

async function mockDeleteProduct(id) {
  await new Promise((r) => setTimeout(r, 200))
  mockProducts = mockProducts.filter((p) => p.id !== id)
}

// ------- para desarrollo local -------
async function realGetProducts() {
  const res = await fetch(API_BASE_URL)
  if (!res.ok) throw new Error('Error al obtener productos')
  return await res.json()
}

async function realCreateProduct(product) {
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

async function realUpdateProduct(id, product) {
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

async function realDeleteProduct(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(errorBody?.title || 'Error al eliminar producto')
  }
}

// ------- EXPORT SEGÚN ENTORNO -------
export const getProducts = USE_MOCK ? mockGetProducts : realGetProducts
export const createProduct = USE_MOCK ? mockCreateProduct : realCreateProduct
export const updateProduct = USE_MOCK ? mockUpdateProduct : realUpdateProduct
export const deleteProduct = USE_MOCK ? mockDeleteProduct : realDeleteProduct
