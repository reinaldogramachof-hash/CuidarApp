---
name: component-scaffold
description: Cria novos componentes React seguindo os padrões do projeto. Use quando o usuário pedir para "criar componente", "novo componente", "criar tela", "criar página" ou similar.
---

# Scaffold de Componente React

**Objetivo:** Criar componentes padronizados, tipados e integrados ao design system
do CuidarApp, evitando inconsistências visuais ou de padrões de código.

## Passos

### 1. Identificar Contexto do Componente
Determine o perfil de acesso do componente:
- **Admin/Clínica** → `src/components/admin/`
- **Familiar** → `src/components/family/`
- **Cuidador** → `src/components/caregiver/`
- **Compartilhado** → `src/components/shared/`

### 2. Verificar Design System
Antes de criar, verifique em `@src/components/shared/` se já existe um componente
semelhante que possa ser reutilizado ou extendido.

Consulte `@.agent/rules/01-tech-stack.md` para a paleta de cores:
- Primária: `teal-600`
- Secundária: `slate-800`
- Mobile: bottom bar navigation, full-screen immersive
- Desktop: sidebar navigation, tabular layout

### 3. Gerar o Componente

**Template de Componente Padrão:**
```tsx
import { type FC } from 'react'

interface [ComponentName]Props {
  // props aqui
}

const [ComponentName]: FC<[ComponentName]Props> = ({ /* props */ }) => {
  return (
    <div className="">
      {/* implementação */}
    </div>
  )
}

export default [ComponentName]
```

**Template com Dados (TanStack Query):**
```tsx
import { type FC } from 'react'
import { use[DataHook] } from '@/hooks/use[DataHook]'

interface [ComponentName]Props {
  id: string
}

const [ComponentName]: FC<[ComponentName]Props> = ({ id }) => {
  const { data, isLoading, error } = use[DataHook](id)

  if (isLoading) return <LoadingSkeleton />
  if (error) return <ErrorBanner message="Erro ao carregar dados." />
  if (!data) return null

  return (
    <div className="">
      {/* implementação */}
    </div>
  )
}

export default [ComponentName]
```

### 4. Criar o Custom Hook (se necessário)
Se o componente precisa de dados do Supabase, criar `src/hooks/use[Nome].ts`:
```tsx
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function use[Nome](param: string) {
  return useQuery({
    queryKey: ['[nome]', param],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('[tabela]')
        .select('*')
        .eq('id', param)
        .single()
      if (error) throw error
      return data
    },
    staleTime: 30_000,
  })
}
```

### 5. Validação Visual
Após criar o componente:
- Acionar subagente de navegador
- Navegar até a rota onde o componente aparece
- Confirmar responsividade: testar em viewport mobile (375px) e desktop (1280px)
- Screenshot e anexar ao Walkthrough

## Restrições
- NUNCA usar `any` nas props
- SEMPRE tratar loading e error states
- NUNCA criar arquivo `.css` separado
- Mobile first: escrever os estilos mobile primeiro, depois `md:` e `lg:`
