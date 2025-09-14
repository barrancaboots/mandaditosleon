# Documentación de la Base de Datos - Mandaditos León

Este documento describe la estructura y las relaciones de la base de datos del proyecto, implementada en Supabase.

## Diagrama de Entidad-Relación (UML)

El siguiente diagrama muestra las tablas principales de la base de datos y cómo se conectan entre sí. Fue generado utilizando el formato Mermaid.

```mermaid
erDiagram
    profiles {
        UUID id PK
        TEXT full_name
        user_role role
        TEXT phone_number
        DOUBLE current_lat
        DOUBLE current_lng
    }

    orders {
        BIGINT id PK
        order_status status
        TEXT delivery_address
        NUMERIC price
        TEXT description
    }

    ratings {
        BIGINT id PK
        SMALLINT rating
        TEXT comment
    }

    categories {
        BIGINT id PK
        TEXT name
    }

    products {
        BIGINT id PK
        TEXT name
        NUMERIC price
        TEXT description
    }

    order_items {
        INT quantity
        NUMERIC price
    }

    profiles ||--o{ orders : "realiza"
    profiles ||--o{ orders : "atiende"
    orders ||--|{ ratings : "recibe"
    profiles ||--o{ ratings : "otorga"
    categories ||--|{ products : "contiene"
    orders ||--|{ order_items : "se compone de"
    products ||--o{ order_items : "es parte de"