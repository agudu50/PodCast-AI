
export default {
  server: {
    port: 5173,
    proxy: {
      '/upload-and-process': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload-and-process/, '/upload-and-process')
      }
    }
  }
};