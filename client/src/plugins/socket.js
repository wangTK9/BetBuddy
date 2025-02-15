export function createSocket(socket) {
  return {
    install(app) {
      app.config.globalProperties.$socket = socket;
    },
  };
}
