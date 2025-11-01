// Função server-side para criar usuário no Supabase (admin) e inserir no perfil
import { defineEventHandler, readBody, createError, type H3Event } from 'h3'
import { createClient } from '@supabase/supabase-js'

interface CreateUserBody {
  email: string
  password: string
  nome: string
  role: string // 'admin' | 'user'
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<CreateUserBody>(event)
    
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

    // 1. Cria o usuário no auth
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true
    })
    
    if (userError || !userData?.user?.id) {
      console.error('Erro criando usuário auth:', userError)
      return createError({ 
        statusCode: 400, 
        statusMessage: userError?.message || 'Erro ao criar usuário' 
      })
    }

    // 2. Insere o perfil na tabela ag_profiles
    const { error: profileError } = await supabase.from('ag_profiles').insert({
      user_id: userData.user.id,
      nome: body.nome,
      email: body.email,
      role: body.role || 'user'
    })
    
    if (profileError) {
      console.error('Erro criando perfil:', profileError)
      return createError({ 
        statusCode: 400, 
        statusMessage: profileError.message 
      })
    }

    return { success: true, user_id: userData.user.id }

  } catch (err: any) {
    console.error('Unhandled error in created_user endpoint:', err)
    return createError({ 
      statusCode: 500, 
      statusMessage: err?.message || 'Erro interno' 
    })
  }
})