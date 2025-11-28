import { useEffect, useState } from 'react'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from './api/productsApi'

function App() {
const [products, setProducts] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [search, setSearch] = useState('')
const [onlyActive, setOnlyActive] = useState(false)
const [form, setForm] = useState({

    id: 0,
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    isActive: true,
  })
  const [isEditing, setIsEditing] = useState(false)
  
  

  // Cargar productos al inicio
  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      setLoading(true)
      setError('')
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar los productos.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleEdit(product) {
    setForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      isActive: product.isActive,
    })
    setIsEditing(true)
  }

  function handleCancelEdit() {
    setForm({
      id: 0,
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      isActive: true,
    })
    setIsEditing(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const productToSend = {
      id: form.id,
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim() || null,
      isActive: form.isActive,
    }

    try {
      setError('')

      if (isEditing) {
        await updateProduct(form.id, productToSend)
      } else {
        const created = await createProduct(productToSend)
        setProducts((prev) => [...prev, created])
      }

      await loadProducts()
      handleCancelEdit()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Ocurrió un error al guardar el producto.')
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este producto?')) return

    try {
      setError('')
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error al eliminar el producto.')
    }
  }

  const filteredProducts = products.filter((p) => {
  const term = search.trim().toLowerCase()

  const matchesSearch =
    !term ||
    p.name.toLowerCase().includes(term) ||
    p.category.toLowerCase().includes(term)

  const matchesActive = !onlyActive || p.isActive

  return matchesSearch && matchesActive})

  const isDemo = import.meta.env.PROD


  return (
    <div className="app">
      <header className="top-bar">
        <div>
          <h1>Dashboard · Productos</h1>
          <p className="subtitle">
            Administra productos usando .NET API + React.
          </p>
        </div>
      </header>

      <main className="layout">
        {/* PANEL IZQUIERDO – FORM */}
        <section className="panel panel-form">
          <h2>{isEditing ? 'Editar producto' : 'Nuevo producto'}</h2>

          {error && <div className="alert">{error}</div>}

          {isDemo && (
            <div className="alert">
              Demo online sin conexión a la API real. Los datos se guardan solo en esta sesión.
            </div>
          )}


          <form onSubmit={handleSubmit} className="form">
            <div className="field">
              <label>Nombre</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Categoría</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label>Precio</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label>Stock</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Descripción</label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="field field-inline">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />{' '}
                Activo
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn primary">
                {isEditing ? 'Guardar cambios' : 'Crear producto'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn secondary"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* PANEL DERECHO – TABLA */}
        <section className="panel panel-table">
          <div className="panel-header">
            <h2>Listado de productos</h2>
            <button className="btn ghost" onClick={loadProducts}>
              Recargar
            </button>
          </div>

          <div className="filters-row">
            <div className="field small">
              <label>Buscar</label>
              <input
                type="text"
                placeholder="Nombre o categoría..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="field field-inline">
              <label>
                <input
                  type="checkbox"
                  checked={onlyActive}
                  onChange={(e) => setOnlyActive(e.target.checked)}
                />{" "}
                Solo activos
              </label>
            </div>

            <div className="summary">
              <span>Total: {products.length}</span>
              <span>
                · Activos: {products.filter((p) => p.isActive).length}
              </span>
            </div>
          </div>


            {loading ? (
              <p>Cargando productos...</p>
            ) : products.length === 0 ? (
              <p>No hay productos cargados.</p>
            ) : filteredProducts.length === 0 ? (
              <p>No hay productos que coincidan con los filtros.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Activo</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>${p.price}</td>
                      <td>{p.stock}</td>
                      <td>{p.isActive ? 'Sí' : 'No'}</td>
                      <td className="actions">
                        <button
                          type="button"
                          className="btn tiny"
                          onClick={() => handleEdit(p)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn tiny danger"
                          onClick={() => handleDelete(p.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
