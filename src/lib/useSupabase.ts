import { useQuery, useMutation, useQueryClient } from 'react-query'
import { supabase } from './supabase'
import type { Database } from './supabase'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

// Products queries
export const useProducts = () => {
  return useQuery('products', async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  })
}

export const useProduct = (id: number) => {
  return useQuery(['product', id], async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  })
}

// Products mutations
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async (product: ProductInsert) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products')
      }
    }
  )
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async ({ id, ...updates }: ProductUpdate & { id: number }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('products')
        queryClient.invalidateQueries(['product', data.id])
      }
    }
  )
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async (id: number) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return id
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products')
      }
    }
  )
}

// Auth hooks
export const useAuth = () => {
  return useQuery('auth', async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  })
}

export const useSignIn = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('auth')
      }
    }
  )
}

export const useSignUp = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('auth')
      }
    }
  )
}

export const useSignOut = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('auth')
      }
    }
  )
}