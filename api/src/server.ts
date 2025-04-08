import server from "./wss"

const PORT = 8000

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { server, PORT };