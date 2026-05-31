# Team Chat — Vite + React + Tailwind + Lucide

Pixel-perfect implementation of the chat screenshot with exact dimensions.

## Quick start

```bash
npm install
npm run dev        # → http://localhost:5173/chat
```

---

## Exact dimensions implemented

| Section                        | Width    | Height  | Component         |
|-------------------------------|----------|---------|-------------------|
| Icon rail                      | 68px     | 100vh   | `IconRail.jsx`    |
| Top bar                        | 100%     | 76px    | `TopBar.jsx`      |
| Sidebar (left of chat)         | 324px    | 824px   | `Sidebar.jsx`     |
| Chat panel (full)              | 981px    | 817px   | `ChatPanel.jsx`   |
| Chat name bar                  | 981px    | 80px    | `ChatHeader.jsx`  |
| Chat messages area             | 981px    | 729px   | `MessageList.jsx` |

---

## Connecting to your existing project

### Option A — Drop into existing Vite+React project

1. Copy `src/components/chat/` into your project's component folder
2. Copy `src/pages/ChatPage.jsx` into your pages folder
3. Add the route:

```jsx
// In your router (App.jsx or routes.jsx)
import ChatPage from './pages/ChatPage'

<Route path="/chat" element={<ChatPage />} />
```

4. Link from any other page:
```jsx
import { Link } from 'react-router-dom'
<Link to="/chat">Go to Chat</Link>
// or programmatically:
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/chat')
```

### Option B — Use as a shared layout shell

If your other pages share the IconRail + TopBar, extract them into a shared layout:

```jsx
// src/layouts/AppLayout.jsx
import IconRail from '../components/chat/IconRail'
import TopBar   from '../components/chat/TopBar'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#1e2433]">
      <IconRail />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex flex-1 overflow-hidden">
          <Outlet />   {/* your pages render here */}
        </main>
      </div>
    </div>
  )
}

// In App.jsx:
<Route element={<AppLayout />}>
  <Route path="/chat"      element={<ChatPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>
```

---

## File structure

```
src/
├── components/chat/
│   ├── IconRail.jsx        68px nav rail
│   ├── TopBar.jsx          76px top bar
│   ├── Sidebar.jsx         324px channels + DMs
│   ├── ChatHeader.jsx      80px name bar
│   ├── MessageList.jsx     729px scrollable messages
│   ├── MessageComposer.jsx composer bar
│   └── ChatPanel.jsx       817px assembled chat panel
├── pages/
│   └── ChatPage.jsx        full page layout
├── lib/utils.js            cn() helper
├── App.jsx                 router
├── main.jsx                entry point
└── index.css               Tailwind + scrollbar styles
```

---

## Tailwind config colors

All colors are defined in `tailwind.config.js` under semantic token groups:
`rail`, `sidebar`, `topbar`, `chatheader`, `msg`, `composer`

Override any token to retheme the entire UI instantly.
