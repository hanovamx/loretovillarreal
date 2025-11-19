import { useState, useEffect } from 'react'
import { LuPlus, LuPencil, LuTrash2, LuPackage } from 'react-icons/lu'
import { toast } from 'sonner'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { usePaqueteStore } from '../../stores/paqueteStore'
import type { PaqueteServicio } from '../../types'

export const AdminPaquetesPage = () => {
  const { paquetes, crearPaquete, actualizarPaquete, eliminarPaquete, fetchPaquetes } = usePaqueteStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState<Partial<PaqueteServicio>>({
    nombre: '',
    descripcion: '',
    fotos_incluidas: 10,
    precio_base: 0,
    precio_foto_extra: 0,
    activo: true,
  })

  useEffect(() => {
    fetchPaquetes()
  }, [fetchPaquetes])

  const handleCreate = () => {
    if (!formData.nombre || formData.fotos_incluidas === undefined) {
      toast.error('Nombre y fotos incluidas son requeridos')
      return
    }
    crearPaquete({
      nombre: formData.nombre,
      descripcion: formData.descripcion || '',
      fotos_incluidas: formData.fotos_incluidas,
      precio_base: formData.precio_base || 0,
      precio_foto_extra: formData.precio_foto_extra || 0,
      activo: formData.activo ?? true,
    })
    toast.success('Paquete creado')
    setShowCreateModal(false)
    setFormData({
      nombre: '',
      descripcion: '',
      fotos_incluidas: 10,
      precio_base: 0,
      precio_foto_extra: 0,
      activo: true,
    })
  }

  const handleUpdate = (id: string) => {
    const paquete = paquetes.find((p) => p.id === id)
    if (!paquete) return
    actualizarPaquete({
      ...paquete,
      ...formData,
    })
    toast.success('Paquete actualizado')
    setEditingId(null)
    setFormData({
      nombre: '',
      descripcion: '',
      fotos_incluidas: 10,
      precio_base: 0,
      precio_foto_extra: 0,
      activo: true,
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este paquete?')) {
      eliminarPaquete(id)
      toast.success('Paquete eliminado')
    }
  }

  const startEdit = (paquete: PaqueteServicio) => {
    setEditingId(paquete.id)
    setFormData(paquete)
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.10em] text-slate-400">Configuración</p>
          <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.18em] text-slate-900">
            Paquetes de Servicio
          </h1>
        </div>
        <Button
          tone="primary"
          size="sm"
          iconLeft={<LuPlus />}
          onClick={() => setShowCreateModal(true)}
        >
          Crear paquete
        </Button>
      </div>

      <Card>
        <div className="space-y-4">
          {paquetes.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <LuPackage className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm uppercase tracking-[0.07em]">No hay paquetes creados</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paquetes.map((paquete) => (
                <div
                  key={paquete.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-slate-900"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold uppercase tracking-[0.07em] text-slate-900">
                          {paquete.nombre}
                        </h3>
                        {!paquete.activo && (
                          <span className="rounded-full bg-slate-200 px-2 py-1 text-[9px] uppercase tracking-[0.07em] text-slate-500">
                            Inactivo
                          </span>
                        )}
                      </div>
                      {paquete.descripcion && (
                        <p className="mt-2 text-xs text-slate-600">{paquete.descripcion}</p>
                      )}
                      <div className="mt-4 space-y-2 text-[10px] uppercase tracking-[0.07em] text-slate-500">
                        <p>
                          <span className="font-semibold text-slate-700">{paquete.fotos_incluidas}</span> fotos
                          incluidas
                        </p>
                        {paquete.precio_base > 0 && (
                          <p>
                            Precio base: <span className="font-semibold text-slate-700">${paquete.precio_base.toLocaleString('es-MX')}</span>
                          </p>
                        )}
                        <p>
                          Foto extra: <span className="font-semibold text-slate-700">${paquete.precio_foto_extra.toLocaleString('es-MX')}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(paquete)}
                        className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
                      >
                        <LuPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(paquete.id)}
                        className="rounded-full border border-rose-200 p-2 text-rose-500 transition hover:border-rose-500 hover:bg-rose-50"
                      >
                        <LuTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {editingId === paquete.id && (
                    <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <input
                        type="text"
                        value={formData.nombre || ''}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Nombre del paquete"
                        className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.07em] text-slate-600 outline-none transition focus:border-slate-900"
                      />
                      <textarea
                        value={formData.descripcion || ''}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        placeholder="Descripción"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 outline-none transition focus:border-slate-900"
                        rows={2}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={formData.fotos_incluidas || 0}
                          onChange={(e) =>
                            setFormData({ ...formData, fotos_incluidas: parseInt(e.target.value) || 0 })
                          }
                          placeholder="Fotos incluidas"
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.07em] text-slate-600 outline-none transition focus:border-slate-900"
                        />
                        <input
                          type="number"
                          value={formData.precio_foto_extra || 0}
                          onChange={(e) =>
                            setFormData({ ...formData, precio_foto_extra: parseInt(e.target.value) || 0 })
                          }
                          placeholder="Precio foto extra"
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.07em] text-slate-600 outline-none transition focus:border-slate-900"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          tone="primary"
                          size="sm"
                          onClick={() => handleUpdate(paquete.id)}
                          className="flex-1"
                        >
                          Guardar
                        </Button>
                        <Button
                          tone="secondary"
                          size="sm"
                          onClick={() => {
                            setEditingId(null)
                            setFormData({
                              nombre: '',
                              descripcion: '',
                              fotos_incluidas: 10,
                              precio_base: 0,
                              precio_foto_extra: 0,
                              activo: true,
                            })
                          }}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Modal de creación */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold uppercase tracking-[0.07em] text-slate-900">
              Crear nuevo paquete
            </h2>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={formData.nombre || ''}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre del paquete *"
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.07em] text-slate-600 outline-none transition focus:border-slate-900"
              />
              <textarea
                value={formData.descripcion || ''}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 outline-none transition focus:border-slate-900"
                rows={3}
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.07em] text-slate-400">
                    Fotos incluidas *
                  </label>
                  <input
                    type="number"
                    value={formData.fotos_incluidas || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, fotos_incluidas: parseInt(e.target.value) || 0 })
                    }
                    className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.07em] text-slate-600 outline-none transition focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.07em] text-slate-400">
                    Precio base
                  </label>
                  <input
                    type="number"
                    value={formData.precio_base || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, precio_base: parseInt(e.target.value) || 0 })
                    }
                    className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.07em] text-slate-600 outline-none transition focus:border-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.07em] text-slate-400">
                  Precio por foto extra
                </label>
                <input
                  type="number"
                  value={formData.precio_foto_extra || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, precio_foto_extra: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.07em] text-slate-600 outline-none transition focus:border-slate-900"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.activo ?? true}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="rounded border-slate-200"
                />
                <span className="text-xs uppercase tracking-[0.07em] text-slate-600">Paquete activo</span>
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                tone="primary"
                size="sm"
                onClick={handleCreate}
                className="flex-1"
              >
                Crear
              </Button>
              <Button
                tone="secondary"
                size="sm"
                onClick={() => {
                  setShowCreateModal(false)
                  setFormData({
                    nombre: '',
                    descripcion: '',
                    fotos_incluidas: 10,
                    precio_base: 0,
                    precio_foto_extra: 0,
                    activo: true,
                  })
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPaquetesPage

