'use client'

import Link from 'next/link'
import React from 'react'

const DataEntryLink: React.FC = () => (
  <Link className="nav__link" href="/admin/data-entry">
    Data Entry
  </Link>
)

export default DataEntryLink
