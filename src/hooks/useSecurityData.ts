"use client";

import { useState, useEffect, useCallback } from "react"

export interface SecurityData {
  address: string
  ip: string
  ips: Array<{
    ip: string
    as: string
    as_domain: string
    as_name: string
    city: string
    country_code: string
    country: string
    type: string
  }>
  ports: number[]
  port_details: Array<{
    port: number
    service: string
    version?: string
    product?: string
    extra_info?: string
    banner?: string
  }>
  os: {
    name: string
    vendor: string
    version: string
    cpe: string
    host: string
    port: number | null
    family: string
  } | null
  tls: {
    domain: string
    https: boolean
    error: string | null
    tls_version: string
    cipher: string
    valid_from: number
    valid_to: number
    days_left: number
    issuer: {
      countryName: string
      organizationName: string
      commonName: string
    }
    subject: {
      commonName: string
    }
  }
  urls: string[]
  hostname: string | null
  subdomains: Array<{
    subdomain: string
    ip: string
  }>
  applications: Array<{
    name: string
    vendor: string | null
    version: string | null
    cpe: string | null
    host: string
    port: number
    family: string | null
  }>
  firewall: Array<{
    name: string
    type: string
    version?: string
    vendor?: string
  }>
  grade: string
  recommendations: {
    en: string[]
    vi: string[]
  }
  score_reason: {
    en: string[]
    vi: string[]
  }
  summary: {
    en: string
    vi: string
  }
  info: {
    logo: string
    category: string
    title: string
    description: string
    keywords: string[]
    global_rank: number
    country_rank: {
      country_code: string
      rank: number
    }
  }
  vulnerabilities: Array<{
    name: {
      en: string
      vi: string
    }
    severity: string
    description: {
      en: string
      vi: string
    }
    solution: {
      en: string
      vi: string
    }
  }>
  account_leaks: Array<{
    username: string
    url: string | null
    hash: string
    found_at: number
  }>
  email_leaks: Array<{
    email: string
    source: string[]
    found_at: number
    first_name: string | null
    last_name: string | null
    department: string | null
    linkedin: string | null
    phone_number: string | null
    position: string | null
    seniority: string | null
    twitter: string | null
    email_type: string
  }>
  blacklist: {
    passed: string[]
    failed: string[]
  }
}

export function useSecurityData(domain: string | null) {
  const [securityData, setSecurityData] = useState<SecurityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSecurityData = useCallback(async () => {
    if (!domain) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/supplier/security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError('No security data available')
        return
      }

      if (result.success) {
        setSecurityData(result.data)
      } else {
        setError(result.error || 'No security data available')
      }
    } catch (err) {
      console.error('Error fetching security data:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [domain])

  useEffect(() => {
    if (domain) {
      fetchSecurityData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain])

  const refreshData = () => {
    fetchSecurityData()
  }

  return {
    securityData,
    loading,
    error,
    refreshData
  }
}
