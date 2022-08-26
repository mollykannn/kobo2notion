export const useMode = () => {
  const mode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)
  return computed({
    get: () => mode.value,
    set: val => {
      mode.value = val
      document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light')
    },
  })
}

export const GetData = async url => {
  let response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) return [`${response.status}:${response.statusText} (-1)`]
  return response
    .json()
    .then(jsonData => [undefined, jsonData])
    .catch(err => [err])
}

export const PostData = async (url, data) => {
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response
    .json()
    .then(jsonData => [undefined, jsonData])
    .catch(err => [err])
}

export const toNumber = val => {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}