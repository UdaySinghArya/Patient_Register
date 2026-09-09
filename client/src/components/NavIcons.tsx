export function IconRegister({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 4h9.5A1.5 1.5 0 0 1 19 5.5v14a1.5 1.5 0 0 1-1.5 1.5H8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8 4a2 2 0 0 0-2 2v13.5A1.5 1.5 0 0 0 7.5 21H8"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M11 8h5M11 12h5M11 16h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function IconNewEntry({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3.75h7.2L18.5 8.1V20.25A1.25 1.25 0 0 1 17.25 21.5H7A1.25 1.25 0 0 1 5.75 20.25V5A1.25 1.25 0 0 1 7 3.75Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M14 3.75V8.25h4.4" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 12v5M9.5 14.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function IconReport({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="5" width="15" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3.5v3M16 3.5v3M4.5 9.5h15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.5 13h7M8.5 16.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
