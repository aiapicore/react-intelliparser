import { useState } from 'react'
import { DEMO_CONTENT } from './consts'
import { IntelliParser } from './index'
import './styles/intelliparser.css'

const OPTIONS = {
  sanitizeHtml: true,
  enableMarkdown: true,
  enableHtml: true,
  enableXml: true,
  enableJson: true,
  enableYaml: true,
  enableCsv: true,
  enableCodeHighlight: true,
  enableMermaid: true,
  enableMath: true,
  enableCopyButton: true,
  prettifyCode: true,
}

function App() {
  const [content, setContent] = useState(DEMO_CONTENT)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.6rem 1.25rem', borderBottom: '1px solid #e2e8f0',
        background: '#fff', flexShrink: 0,
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>⚡ react-intelliparser</span>
        <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>live playground</span>
      </header>

      {/* Two-panel body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left — editor */}
        <div style={{
          width: '50%', display: 'flex', flexDirection: 'column',
          borderRight: '1px solid #e2e8f0', background: '#f8fafc',
        }}>
          <div style={{
            padding: '0.4rem 1rem', fontSize: '0.72rem', fontWeight: 600,
            color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em',
            borderBottom: '1px solid #e2e8f0', background: '#f1f5f9',
          }}>
            Input
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1, resize: 'none', border: 'none', outline: 'none',
              padding: '1rem', fontFamily: '"Fira Code", "Cascadia Code", monospace',
              fontSize: '0.8rem', lineHeight: 1.6, background: '#f8fafc',
              color: '#1e293b',
            }}
          />
        </div>

        {/* Right — parsed output */}
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            padding: '0.4rem 1rem', fontSize: '0.72rem', fontWeight: 600,
            color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em',
            borderBottom: '1px solid #e2e8f0', background: '#f1f5f9', flexShrink: 0,
          }}>
            Parsed output
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
            <IntelliParser content={content} options={OPTIONS} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
