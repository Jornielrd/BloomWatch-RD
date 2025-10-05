Project
BloomWatch-RD - Satellite imagery and NDVI monitoring with React + Vite frontend, Node.js/Express backend, optional Firebase integration for Auth, Firestore, Functions and Hosting.
Requirements
- Operating systems: Windows 10+, macOS, Linux.
- Programs: Node.js 18 LTS or newer; npm; Git; VS Code (recommended); Firebase CLI (optional).
- Optional services: Firebase account for Hosting/Firestore/Functions; API keys for NASA, Unsplash, or other external services.
- Windows PowerShell: may need Set-ExecutionPolicy RemoteSigned -Scope CurrentUser if npm scripts are blocked.
Backend installation step by step
- Open terminal and change to backend folder: cd C:\Users\Jhail Baez\OneDrive\Escritorio\BloomWatch-RD\backend.
- Verify Node and npm: node -v && npm -v.
- Install dependencies: npm install.
- Copy env example and edit: copy .env.example .env then open .env and paste real keys.
- If modules are missing, install them: npm install express cors dotenv axios.
- Start dev server: npm run dev or npm start (depending on package.json).
- Test a basic endpoint: curl http://localhost:3000/ping or open the server URL in a browser.
Frontend installation step by step
- Open terminal and change to frontend folder: cd C:\Users\Jhail Baez\OneDrive\Escritorio\BloomWatch-RD\frontend.
- Verify Node and npm: node -v && npm -v.
- Install core dependencies: npm install react react-dom.
- Install dev tools: npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer.
- Initialize Tailwind: npx tailwindcss init -p or npx --package tailwindcss tailwindcss init -p if the first fails.
- Ensure src/ structure exists and imports match file names (case-sensitive on some systems).
- Ensure vite.config.cjs exists and package.json has "dev": "vite".
- Start dev server: npm run dev and open http://localhost:5173/.
- If import resolution errors appear, fix imports or move/rename files so paths match (example change ../components/ImageryViewer to ./components/ImageryViewer if the file is in src/layout/components).
Firebase emulators step by step (optional)
- Install Firebase CLI: npm install -g firebase-tools.
- Login and select project: firebase login then firebase use <PROJECT_ID>.
- Initialize Firebase in the repo if missing: firebase init (select Firestore, Auth, Functions, Hosting, Emulators as needed).
- Install functions deps: cd functions && npm install.
- (Optional) Add startCommand in firebase.json for Hosting emulator to start Vite: set "startCommand": "cd frontend && npm run dev".
- Start emulators: firebase emulators:start.
- Connect the frontend to emulators in code using connectFirestoreEmulator(db,'localhost',8080) and connectAuthEmulator(auth,'http://localhost:9099').
- Export/import emulator data: firebase emulators:export ./local-emulator-data and firebase emulators:start --import=./local-emulator-data.
Build and deploy step by step
- Build frontend: cd frontend && npm run build.
- Confirm firebase.json hosting.public points to the build output (dist or build).
- Deploy hosting and functions: firebase deploy --only hosting,functions or firebase deploy.
- Inspect Functions logs: firebase functions:log or view logs in Cloud Console.
Troubleshooting and checks
- Confirm Node/npm versions: node -v and npm -v.
- Reinstall dependencies when errors occur: run npm install or npm ci in each package folder.
- Verify file structure: Get-ChildItem .\src -Recurse | Select-Object FullName (PowerShell) or ls -R frontend/src (UNIX).
- Avoid OneDrive issues: move project outside OneDrive if you see sync conflicts.
- Fix PowerShell script execution issues by running PowerShell as admin and executing: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser.
- Use Emulator Suite to test Firebase resources before deploying.
Languages and versions
- Languages: JavaScript (ESM) for frontend and backend; JSX for React.
- Recommended runtimes: Node.js 18 LTS or newer; npm 9+.
- Vite + React + Tailwind for frontend tooling; Express for backend; Firebase SDK/Functions if used.
Quick all-in-one PowerShell copy-paste (adjust paths if needed)
cd "C:\Users\Jhail Baez\OneDrive\Escritorio\BloomWatch-RD" ; \
# Backend
cd backend ; node -v ; npm -v ; npm install ; copy .env.example .env || echo ".env.example not found" ; \
# Start backend dev server in a new window (optional)
Start-Process powershell -ArgumentList '-NoExit','-Command',"cd `\"$PWD`\"; npm run dev" ; \
Start-Sleep -Seconds 2 ; \
# Frontend
cd ..\frontend ; node -v ; npm -v ; npm install react react-dom ; npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer ; npx tailwindcss init -p || npx --package tailwindcss tailwindcss init -p ; \
# Ensure minimal src structure and stubs
New-Item -ItemType Directory -Path .\src\layout\components -Force | Out-Null ; \
Set-Content .\src\main.jsx "import React from 'react'; import { createRoot } from 'react-dom/client'; import App from './App'; import './styles.css'; createRoot(document.getElementById('root')).render(<App />);" ; \
Set-Content .\src\App.jsx "import React from 'react'; import MapView from './layout/MapView'; import LeftPanel from './layout/LeftPanel'; import RightPanel from './layout/RightPanel'; import TimeBar from './layout/TimeBar'; export default function App(){ return (<div className='app'><LeftPanel/><MapView/><RightPanel/><TimeBar/></div>); }" ; \
Set-Content .\src\api.js "export const ping = async () => 'pong';" ; \
Set-Content .\src\styles.css "@tailwind base; @tailwind components; @tailwind utilities; body{margin:0;font-family:Inter,system-ui,Arial;} .app{display:grid;grid-template-columns:250px 1fr 300px;gap:8px;height:100vh;}" ; \
Set-Content .\src\layout\MapView.jsx "import React from 'react'; export default function MapView(){return <div>MapView</div>}" ; \
Set-Content .\src\layout\LeftPanel.jsx "import React from 'react'; import LayerToggle from './components/LayerToggle'; export default function LeftPanel(){return <aside><LayerToggle/></aside>}" ; \
Set-Content .\src\layout\RightPanel.jsx "import React from 'react'; import ImageryViewer from './components/ImageryViewer'; export default function RightPanel(){return <aside><ImageryViewer/></aside>}" ; \
Set-Content .\src\layout\TimeBar.jsx "import React from 'react'; export default function TimeBar(){return <div>TimeBar</div>}" ; \
Set-Content .\src\layout\components\LayerToggle.jsx "import React from 'react'; export default function LayerToggle(){return <div>LayerToggle</div>}" ; \
Set-Content .\src\layout\components\ImageryViewer.jsx "import React from 'react'; export default function ImageryViewer(){return <div>ImageryViewer</div>}" ; \
# index.html and vite config
Set-Content .\index.html "<!doctype html><html><head><meta charset='utf-8'/><meta name='viewport' content='width=device-width,initial-scale=1.0'/><title>BloomWatch</title></head><body><div id='root'></div><script type='module' src='/src/main.jsx'></script></body></html>" ; \
Set-Content .\vite.config.cjs "const path = require('path'); module.exports = async () => { const { defineConfig } = await import('vite'); const reactPlugin = (await import('@vitejs/plugin-react')).default; return defineConfig({ plugins: [reactPlugin()], resolve: { alias: { '@': path.resolve(__dirname, 'src') } }, server: { host: true, port: 5173 } }); };" ; \
# Start frontend dev server
npm run dev


End of README


