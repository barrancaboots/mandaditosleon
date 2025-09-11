// types/database.ts
// ARCHIVO CORREGIDO: Los tipos han sido actualizados para coincidir con tu script de migración SQL.
// Esto soluciona la causa raíz de los errores de TypeScript.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: []
      }
      logs: {
        Row: {
          created_at: string | null
          id: number
          level: Database["public"]["Enums"]["log_level"]
          message: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          level?: Database["public"]["Enums"]["log_level"]
          message: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          level?: Database["public"]["Enums"]["log_level"]
          message?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
        }
        Relationships: []
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
          status: Database["public"]["Enums"]["order_status"]
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
          status?: Database["public"]["Enums"]["order_status"]
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
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
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
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          vehicle: Database["public"]["Enums"]["vehicle_type"] | null
        }
        Insert: {
          avatar_url?: string | null
          current_lat?: number | null
          current_lng?: number | null
          full_name?: string | null
          id: string
          is_available?: boolean | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          vehicle?: Database["public"]["Enums"]["vehicle_type"] | null
        }
        Update: {
          avatar_url?: string | null
          current_lat?: number | null
          current_lng?: number | null
          full_name?: string | null
          id?: string
          is_available?: boolean | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          vehicle?: Database["public"]["Enums"]["vehicle_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ratings: {
        Row: {
          client_id: string
          comment: string | null
          created_at: string | null
          driver_id: string
          id: number
          order_id: number
          rating: number
        }
        Insert: {
          client_id: string
          comment?: string | null
          created_at?: string | null
          driver_id: string
          id?: number
          order_id: number
          rating: number
        }
        Update: {
          client_id?: string
          comment?: string | null
          created_at?: string | null
          driver_id?: string
          id?: number
          order_id?: number
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      system_config: {
        Row: {
          app_name: string | null
          app_version: string | null
          id: number
          is_demo_mode: boolean
        }
        Insert: {
          app_name?: string | null
          app_version?: string | null
          id?: number
          is_demo_mode?: boolean
        }
        Update: {
          app_name?: string | null
          app_version?: string | null
          id?: number
          is_demo_mode?: boolean
        }
        Relationships: []
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
      log_level: "info" | "warn" | "error" | "debug"
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
