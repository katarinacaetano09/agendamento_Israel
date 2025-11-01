// Função server-side para deletar usuário do Supabase (admin) e perfil
import { defineEventHandler, readBody, createError, type H3Event } from 'h3'
import { createClient } from '@supabase/supabase-js'

interface DeleteUserBody {
  user_id: string
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<DeleteUserBody>(event)
    
    // Cria cliente Supabase com service role key para operações administrativas
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVER_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return createError({ 
        statusCode: 500, 
        statusMessage: 'Configuração do Supabase não encontrada' 
      })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // 1. Deleta o perfil da tabela ag_profiles (CASCADE vai deletar automaticamente quando deletar o user)
    const { error: profileError } = await supabase
      .from('ag_profiles')
      .delete()
      .eq('user_id', body.user_id)
    
    if (profileError) {
      console.error('Erro deletando perfil:', profileError)
      return createError({ 
        statusCode: 400, 
        statusMessage: profileError.message 
      })
    }

    // 2. Deleta o usuário do auth
    const { error: userError } = await supabase.auth.admin.deleteUser(body.user_id)
    
    if (userError) {
      console.error('Erro deletando usuário auth:', userError)
      return createError({ 
        statusCode: 400, 
        statusMessage: userError?.message || 'Erro ao deletar usuário' 
      })
    }

    return { success: true, message: 'Usuário deletado com sucesso' }

  } catch (err: any) {
    console.error('Unhandled error in delete_user endpoint:', err)
    return createError({ 
      statusCode: 500, 
      statusMessage: err?.message || 'Erro interno' 
    })
  }
})