export function debounce<F extends (...args: unknown[]) => void>(
  func: F,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
//we can also use this debounce function further in this project to delay the api calls and make the search more efficient.
//for example, if we want to delay the api call by 500ms, we can use it like this:
// const debouncedApiCall = debounce(() => {
//   fetch('https://api.example.com/data');
// }, 500);
// debouncedApiCall();