---
title: "Vue.js 3 Composition API 入門"
description: "Vue.js 3で導入されたComposition APIの基本的な使い方から実践的な活用法まで詳しく解説します。"
pubDate: 2024-01-16
heroImage: "/images/vue3-composition-api.jpg"
tags: ["Vue.js", "JavaScript", "フロントエンド", "Composition API"]
category: "Web開発"
draft: false
---

# Vue.js 3 Composition API 入門

Vue.js 3で導入されたComposition APIは、より柔軟で再利用可能なコンポーネントロジックを記述できる新しい方法です。

## setupファンクション

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">増加</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    const increment = () => {
      count.value++
    }
    
    return {
      count,
      increment
    }
  }
}
</script>
```

## リアクティビティAPI

### ref vs reactive

```javascript
import { ref, reactive } from 'vue'

export default {
  setup() {
    // プリミティブ値にはref
    const count = ref(0)
    const message = ref('Hello')
    
    // オブジェクトにはreactive
    const state = reactive({
      user: {
        name: 'John',
        age: 30
      },
      items: []
    })
    
    return {
      count,
      message,
      state
    }
  }
}
```

## computedとwatch

```javascript
import { ref, computed, watch } from 'vue'

export default {
  setup() {
    const firstName = ref('John')
    const lastName = ref('Doe')
    
    // computed property
    const fullName = computed(() => {
      return `${firstName.value} ${lastName.value}`
    })
    
    // watcher
    watch(() => fullName.value, (newValue, oldValue) => {
      console.log(`Name changed from ${oldValue} to ${newValue}`)
    })
    
    return {
      firstName,
      lastName,
      fullName
    }
  }
}
```

## ライフサイクルフック

```javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('Component is mounted')
    })
    
    onUpdated(() => {
      console.log('Component is updated')
    })
    
    onUnmounted(() => {
      console.log('Component is unmounted')
    })
  }
}
```

## カスタムComposable

```javascript
// useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}

// コンポーネントでの使用
import { useCounter } from './composables/useCounter'

export default {
  setup() {
    const { count, increment, decrement, reset } = useCounter(10)
    
    return {
      count,
      increment,
      decrement,
      reset
    }
  }
}
```

## 非同期データフェッチ

```javascript
import { ref, onMounted } from 'vue'

export function useApi(url) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const fetchData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      data.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  onMounted(fetchData)
  
  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}
```

## script setup構文

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">増加</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}
</script>
```

Composition APIを使用することで、ロジックの分離と再利用性が向上し、より保守性の高いVue.jsアプリケーションを構築できます。 