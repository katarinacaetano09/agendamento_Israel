import { ref } from 'vue'
import type { Cliente, ClienteInsert } from '../../shared/types/Cliente'

export function useClientes() {
  const clientes = ref<Cliente[] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchClientes() {
    loading.value = true
    error.value = null
    try {
      const supabase = useSupabaseClient()
      const { data, error: err } = await supabase
        .from('ag_clientes')
        .select('*')
      if (err) throw err
      clientes.value = data
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar clientes'
      clientes.value = null
    } finally {
      loading.value = false
    }
  }

  async function addCliente(cliente: ClienteInsert) {
    if (!cliente.cpf || !cliente.nome || cliente.cpf.trim() === '' || cliente.nome.trim() === '') {
      return { success: false, message: 'Os campos CPF e Nome são obrigatórios.' }
    }
    const supabase = useSupabaseClient()
    const { error: insertError } = await supabase
      .from('ag_clientes')
      .insert([cliente] as any)
    if (insertError) {
      return { success: false, message: insertError.message || 'Erro ao adicionar cliente.' }
    }
    return { success: true, message: 'Cliente adicionado com sucesso.' }
  }

  async function editCliente(id: number, cliente: ClienteInsert) {
    const supabase = useSupabaseClient()
    const { error: updateError } = await supabase
      .from('ag_clientes')
      // @ts-ignore
      .update({
        cpf: cliente.cpf,
        nome: cliente.nome,
        endereco: cliente.endereco,
        email: cliente.email,
        telefone: cliente.telefone
      } as any)
      .eq('id', id)
    if (updateError) {
      return { success: false, message: updateError.message || 'Erro ao editar cliente.' }
    }
    return { success: true, message: 'Cliente atualizado com sucesso.' }
  }

  async function deleteCliente(id: number) {
    const supabase = useSupabaseClient()
    const { error: delError } = await supabase
      .from('ag_clientes')
      .delete()
      .eq('id', id)
    if (delError) {
      return { success: false, message: delError.message || 'Erro ao deletar cliente.' }
    }
    return { success: true, message: 'Cliente deletado com sucesso.' }
  }

  return {
    clientes,
    loading,
    error,
    fetchClientes,
    addCliente,
    editCliente,
    deleteCliente
  }
}