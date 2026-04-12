import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
  activateUser,
} from "@/apiServices/securityService/adminUserService"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import UserTable from "./UserTable"
import UserFormDialog from "./UserFormDialog"
import DeactivateConfirmDialog from "./DeactivateConfirmDialog"

export default function UserManagement() {
  const { apiClient } = useAuth()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllUsers(apiClient)
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleCreate = async (data) => {
    setSubmitting(true)
    try {
      await createUser(apiClient, data)
      toast.success("Usuario creado exitosamente")
      setDialogOpen(false)
      setSelectedUser(null)
      await fetchUsers()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (data) => {
    setSubmitting(true)
    try {
      await updateUser(apiClient, selectedUser.userId, data)
      toast.success("Usuario actualizado exitosamente")
      setDialogOpen(false)
      setSelectedUser(null)
      await fetchUsers()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = async () => {
    setSubmitting(true)
    try {
      if (selectedUser.active) {
        await deactivateUser(apiClient, selectedUser.userId)
      } else {
        await activateUser(apiClient, selectedUser.userId)
      }
      toast.success("Estado del usuario actualizado exitosamente")
      setConfirmDialogOpen(false)
      setSelectedUser(null)
      await fetchUsers()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const openCreateDialog = () => {
    setSelectedUser(null)
    setDialogOpen(true)
  }

  const openEditDialog = (user) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const openDeactivateDialog = (user) => {
    setSelectedUser(user)
    setConfirmDialogOpen(true)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-destructive text-sm">{error}</p>
        <Button variant="outline" onClick={fetchUsers}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Administración de Usuarios</h1>
        <Button onClick={openCreateDialog}>Crear usuario</Button>
      </div>

      <UserTable
        users={users}
        loading={loading}
        onEdit={openEditDialog}
        onDeactivate={openDeactivateDialog}
      />

      <UserFormDialog
        key={selectedUser ? `edit-${selectedUser.userId}` : "create"}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setSelectedUser(null)
        }}
        user={selectedUser}
        onSubmit={selectedUser ? handleEdit : handleCreate}
        loading={submitting}
      />

      <DeactivateConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={(open) => {
          setConfirmDialogOpen(open)
          if (!open) setSelectedUser(null)
        }}
        user={selectedUser}
        onConfirm={handleDeactivate}
        loading={submitting}
      />
    </div>
  )
}
