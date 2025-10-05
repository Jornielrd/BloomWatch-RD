**Structuring README Steps**

I’ll stick with the sections: Proyecto, Requisitos, Instalación Backend, Instalación Frontend, Emuladores y Firebase, and Despliegue y Comprobaciones. Each section will have one-line steps, and I’ll make sure the labels and key text are bold to highlight them. All the headings will be H3 to follow the structure rules, and I'll avoid parentheses in headings. I’ll keep the steps concise and straightforward. No extra commentary, just the steps. Ready to go!
### Proyecto
BloomWatch-RD - Monitoreo de imágenes satelitales y NDVI con frontend React + Vite, backend Node.js/Express y opcional integración Firebase para Auth, Firestore, Functions y Hosting.

 Requisitos
- **Sistemas operativos compatibles** Windows 10+ macOS Linux;  
- **Programas** Node.js 18 LTS o superior; **npm**; **Git**; **VS Code** recomendado; **Firebase CLI** (opcional para emuladores/despliegue);  
- **Servicios opcionales** Cuenta Firebase para Hosting/Firestore/Functions; claves de APIs externas (NASA, Unsplash, etc.);  
- **Permisos PowerShell** en Windows: ejecutar `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` si npm falla.

 Instalación Backend paso a paso
- Abrir terminal y moverse a la carpeta del backend `cd C:\Users\Jhail Baez\OneDrive\Escritorio\BloomWatch-RD\backend`.  
- Verificar Node y npm `node -v && npm -v`.  
- Instalar dependencias `npm install`.  
- Copiar variables de entorno `copy .env.example .env` y editar `.env` con tus claves.  
- Instalar paquetes faltantes manuales `npm install express cors dotenv axios` si aparecen errores.  
- Ejecutar servidor en desarrollo `npm run dev` o `npm start` según package.json.  
- Probar endpoint básico `curl http://localhost:3000/ping` o abrir URL que muestre el servidor.

 Instalación Frontend paso a paso
- Abrir terminal y moverse a la carpeta frontend `cd C:\Users\Jhail Baez\OneDrive\Escritorio\BloomWatch-RD\frontend`.  
- Verificar Node y npm `node -v && npm -v`.  
- Instalar dependencias principales `npm install react react-dom`.  
- Instalar herramientas de desarrollo `npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer`.  
- Inicializar Tailwind `npx tailwindcss init -p` o `npx --package tailwindcss tailwindcss init -p` si falla.  
- Crear estructura mínima si no existe (src, layout, components) o clonar repo correctamente; asegurar que imports coincidan con nombres de archivos.  
- Instalar alias Vite si usas `vite.config.cjs` y verificar `package.json` scripts contiene `"dev": "vite"`.  
- Ejecutar servidor de desarrollo `npm run dev` y abrir `http://localhost:5173/`.  
- Si aparece error de imports resolver moviendo/renombrando archivos o corrigiendo imports relativos (ejemplo cambiar `../components/ImageryViewer` por `./components/ImageryViewer` según ubicación).

 Emuladores Firebase paso a paso
- Instalar Firebase CLI global `npm install -g firebase-tools`.  
- Loguear `firebase login` y seleccionar proyecto `firebase use <PROJECT_ID>`.  
- Inicializar Firebase en el repo si falta `firebase init` seleccionando Firestore Auth Functions Hosting Emulators según uso.  
- Instalar dependencias en functions `cd functions && npm install`.  
- Configurar startCommand en `firebase.json` para arrancar Vite desde el emulator si lo deseas: `"startCommand": "cd frontend && npm run dev"`.  
- Ejecutar emuladores `firebase emulators:start` y abrir Emulator UI en `http://localhost:4000/`.  
- Conectar frontend a emuladores en el init de Firebase en el código con `connectFirestoreEmulator(db,'localhost',8080)` y `connectAuthEmulator(auth,'http://localhost:9099')`.  
- Exportar e importar datos del emulador `firebase emulators:export ./local-emulator-data` y `firebase emulators:start --import=./local-emulator-data`.

Despliegue y comprobaciones paso a paso
- Construir frontend para producción `cd frontend && npm run build` y confirmar carpeta de salida (`dist` o `build`).  
- Verificar `firebase.json` que `hosting.public` apunta a la carpeta build; configurar rewrites a funciones si es necesario.  
- Desplegar solo hosting y functions `firebase deploy --only hosting,functions` o todo `firebase deploy`.  
- Revisar logs de Functions `firebase functions:log` o en Cloud Console si ocurre error.  
- Diagnóstico rápido ante fallos: revisar `node -v`, `npm -v`, salida completa de `npm run build`, contenido de `firebase.json`, y la estructura de `frontend/src` con `Get-ChildItem .\src -Recurse` o `ls -R frontend/src`.  
- Si hay problemas de permisos en Windows con npm, usar CMD en vez de PowerShell o ajustar ejecución con `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`.

 Notas finales sobre lenguajes y versiones
- **Lenguajes** JavaScript moderno (ESM) para frontend y backend; JSX para React; config en CommonJS para vite.config.cjs si tu package.json usa "type": "module".  
- **Versiones recomendadas** Node 18 LTS o superior; npm 9+; Firebase CLI última versión estable.  
- **Buenas prácticas** Mantener el repo fuera de OneDrive si hay conflictos de sincronización; normalizar nombres de archivos sensibles a mayúsculas/minúsculas; usar `.env` locales y Secret Manager para producción; usar emuladores antes de desplegar.


cd "C:\Users\Jhail Baez\OneDrive\Escritorio\BloomWatch-RD" ; cd backend ; node -v ; npm -v ; npm install ; copy .env.example .env ; npm run dev ; Start-Sleep -s 2 ; cd ..\frontend ; node -v ; npm -v ; npm install react react-dom ; npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer ; npx tailwindcss init -p ; New-Item -ItemType Directory -Path .\src\layout\components -Force | Out-Null ; Set-Content .\src\main.jsx "import React from 'react'; import { createRoot } from 'react-dom/client'; import App from './App'; import './styles.css'; createRoot(document.getElementById('root')).render(<App />);" ; Set-Content .\index.html "<!doctype html><html><head><meta charset='utf-8'/><meta name='viewport' content='width=device-width,initial-scale=1.0'/><title>BloomWatch</title></head><body><div id='root'></div><script type='module' src='/src/main.jsx'></script></body></html>" ; Set-Content .\vite.config.cjs "const path = require('path'); module.exports = async () => { const { defineConfig } = await import('vite'); const reactPlugin = (await import('@vitejs/plugin-react')).default; return defineConfig({ plugins: [reactPlugin()], resolve: { alias: { '@': path.resolve(__dirname, 'src') } }, server: { host: true, port: 5173 } }); };" ; npm run dev
```
