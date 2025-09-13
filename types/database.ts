export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          id: number
          image_base64: string | null
          is_demo_item: boolean
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_base64?: string | null
          is_demo_item?: boolean
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          image_base64?: string | null
          is_demo_item?: boolean
          name?: string
        }
      }
      orders: {
        Row: {
          accepted_at: string | null
          client_id: string
          completed_at: string | null
          created_at: string | null
          delivery_address: string
          delivery_lat: number
          delivery_lng: number
          description: string
          driver_id: string | null
          id: number
          pickup_address: string
          pickup_lat: number
          pickup_lng: number
          price: number
          status: "pendiente" | "buscando_repartidor" | "aceptado" | "en_camino" | "entregado" | "cancelado"
        }
        Insert: {
          accepted_at?: string | null
          client_id: string
          completed_at?: string | null
          created_at?: string | null
          delivery_address: string
          delivery_lat: number
          delivery_lng: number
          description: string
          driver_id?: string | null
          id?: number
          pickup_address: string
          pickup_lat: number
          pickup_lng: number
          price: number
          status?: "pendiente" | "buscando_repartidor" | "aceptado" | "en_camino" | "entregado" | "cancelado"
        }
        Update: {
          accepted_at?: string | null
          client_id?: string
          completed_at?: string | null
          created_at?: string | null
          delivery_address?: string
          delivery_lat?: number
          delivery_lng?: number
          description?: string
          driver_id?: string | null
          id?: number
          pickup_address?: string
          pickup_lat?: number
          pickup_lng?: number
          price?: number
          status?: "pendiente" | "buscando_repartidor" | "aceptado" | "en_camino" | "entregado" | "cancelado"
        }
      }
      order_items: {
        Row: {
            id: number
            order_id: number
            product_id: number
            quantity: number
            price: number
            created_at: string | null
        }
        Insert: {
            id?: number
            order_id: number
            product_id: number
            quantity: number
            price: number
            created_at?: string | null
        }
        Update: {
            id?: number
            order_id?: number
            product_id?: number
            quantity?: number
            price?: number
            created_at?: string | null
        }
      }
      products: {
        Row: {
          category_id: number
          created_at: string | null
          description: string | null
          id: number
          image_base64: string | null
          is_demo_item: boolean
          name: string
          price: number
          unit_of_measure: string | null
        }
        Insert: {
          category_id: number
          created_at?: string | null
          description?: string | null
          id?: number
          image_base64?: string | null
          is_demo_item?: boolean
          name: string
          price: number
          unit_of_measure?: string | null
        }
        Update: {
          category_id?: number
          created_at?: string | null
          description?: string | null
          id?: number
          image_base64?: string | null
          is_demo_item?: boolean
          name?: string
          price?: number
          unit_of_measure?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          current_lat: number | null
          current_lng: number | null
          full_name: string | null
          id: string
          is_available: boolean | null
          phone_number: string | null
          role: "cliente" | "repartidor" | "admin"
          updated_at: string | null
          vehicle: "motocicleta" | "coche" | "bicicleta" | null
        }
        Insert: {
          avatar_url?: string | null
          current_lat?: number | null
          current_lng?: number | null
          full_name?: string | null
          id: string
          is_available?: boolean | null
          phone_number?: string | null
          role?: "cliente" | "repartidor" | "admin"
          updated_at?: string | null
          vehicle?: "motocicleta" | "coche" | "bicicleta" | null
        }
        Update: {
          avatar_url?: string | null
          current_lat?: number | null
          current_lng?: number | null
          full_name?: string | null
          id?: string
          is_available?: boolean | null
          phone_number?: string | null
          role?: "cliente" | "repartidor" | "admin"
          updated_at?: string | null
          vehicle?: "motocicleta" | "coche" | "bicicleta" | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      order_status:
        | "pendiente"
        | "buscando_repartidor"
        | "aceptado"
        | "en_camino"
        | "entregado"
        | "cancelado"
      user_role: "cliente" | "repartidor" | "admin"
      vehicle_type: "motocicleta" | "coche" | "bicicleta"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}