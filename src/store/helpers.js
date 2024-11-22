// ローカルストレージにデータを保存するヘルパー関数
export function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ローカルストレージからデータを取得するヘルパー関数
export function getFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}