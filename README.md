# ServidorVozB


Backend para transmisión de voz (Sprint 3) del proyecto IGLU. Implementa un servidor de señalización con Socket.io y estructura para integrar STUN/ICE.


## Ejecutar local


1. Copiar `.env.example` a `.env` y ajustar puertos.
2. `npm install`
3. `npm run start:dev`


## Endpoints / responsabilidades


- Señalización WebSocket para intercambio de SDP y ICE candidates.
- Gestión de salas (crear, listar, unirse, salir).
- Mute/unmute notifications.