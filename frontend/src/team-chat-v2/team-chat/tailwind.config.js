/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Icon Rail ── */
        rail: {
          bg: '#1e2433',       /* very dark navy bg */
          icon: '#7c8db0',     /* inactive icon color */
          iconActive: '#ffffff',
          iconActiveBg: '#2d3f6b',
          avatar: '#c9873a',   /* orange-amber user avatar */
        },
        /* ── Sidebar ── */
        sidebar: {
          bg: '#1e2d4a',
          itemText: '#a0b0cc',
          itemHover: '#253657',
          itemActive: '#1f3d6e',
          itemActiveText: '#4a90d9',
          sectionLabel: '#5a7090',
          border: '#253250',
          inputBg: '#253250',
          inputBorder: '#2e3f5c',
          inputText: '#c0d0e8',
          inputPlaceholder: '#5a7090',
          hashInactive: '#5a7090',
          viewAll: '#5a7090',
          dmName: '#c0d0e8',
          dmTime: '#5a7090',
          dmPreview: '#5a7090',
          badgeBg: '#3a7bd5',
        },
        /* ── Top Bar ── */
        topbar: {
          bg: '#1e2433',
          upgradeBg: '#1a3060',
          upgradeText: '#ffffff',
          upgradeBorder: '#2a4580',
          upgradeAccent: '#4a8fe8',
          iconBg: '#253250',
          iconColor: '#7c8db0',
        },
        /* ── Chat Header ── */
        chatheader: {
          bg: '#ffffff',
          border: '#e8ecf0',
          title: '#111827',
          metaText: '#6b7280',
          online: '#22c55e',
          iconColor: '#3a7bd5',
        },
        /* ── Messages ── */
        msg: {
          inboundBg: '#f0f2f5',
          inboundText: '#111827',
          outboundBg: '#1a3060',
          outboundText: '#dbeafe',
          metaText: '#9ca3af',
          tick: '#3a7bd5',
          dateDivider: '#9ca3af',
          dateDividerLine: '#e5e7eb',
          fileCardBg: '#f0f2f5',
          fileCardBorder: '#e2e8f0',
          fileIconBg: '#1a3060',
          fileIconColor: '#5a9fe8',
          fileViewBg: '#1a3060',
          fileViewText: '#5a9fe8',
          fileViewHover: '#1f3d7a',
        },
        /* ── Composer ── */
        composer: {
          bg: '#ffffff',
          border: '#e8ecf0',
          inputBorder: '#e2e8f0',
          inputBg: '#ffffff',
          inputText: '#374151',
          inputPlaceholder: '#9ca3af',
          toolbarIcon: '#9ca3af',
          actionIcon: '#9ca3af',
          sendBg: '#1a3060',
          sendIcon: '#5a9fe8',
          sendHover: '#1f3d7a',
        },
      },
      width: {
        /* exact pixel dimensions given */
        'rail': '68px',
        'sidebar': '324px',
        'chat': '981px',
        'topbar': '1440px',
      },
      height: {
        'topbar': '76px',      /* 75.59 → 76 */
        'chat-header': '80px',
        'chat-body': '729px',
        'chat-panel': '817px',
        'main': '824px',
        'app': '941px',
      },
    },
  },
  plugins: [],
}
