export function fetchWithRetries(
  url: string,
  init?: RequestInit,
  retries = 10
) {
  let count = 0;
  return new Promise<Response>((resolve, reject) => {
    const fetchData = () => {
      count += 1;
      fetch(url, init)
        .then((resp) => {
          resolve(resp);
        })
        .catch((err) => {
          if (count > retries) {
            reject(err);
            return;
          }
          console.log(err);
          console.log(`url: "${url}". left retries: ${retries - count}`);
          setTimeout(() => {
            fetchData();
          }, count * 0.5);
        });
    };
    fetchData();
  });
}
