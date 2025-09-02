import { NextResponse } from "next/server"

const CYSTACK_API_KEY = "Bearer cs.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZGVtb0BjeXN0YWNrLm5ldCIsImNyZWF0ZWRfdGltZSI6MTc1NDI5NzYwMywiZXhwaXJlZF90aW1lIjo0OTA3ODk3NjAzLCJ0b2tlbl90eXBlIjoiYXBpX2tleSIsInNvdXJjZSI6bnVsbCwiZGVzdGluYXRpb24iOlsid2hpdGVodWIiXX0.8Wkx9AdKeOLAXvM6O5GSFTt3Ym-S6-PedSyKi14v3Jg"
const CYSTACK_BASE_URL = "https://api.cystack.net"

export async function POST(req: Request) {
  try {
    const { domain } = await req.json()
    
    if (!domain) {
      return NextResponse.json({ 
        error: "Domain is required" 
      }, { status: 400 })
    }

    // Call CyStack BaseCheck API
    const response = await fetch(`${CYSTACK_BASE_URL}/v4/basecheck`, {
      method: 'POST',
      headers: {
        'Api-Key': CYSTACK_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('CyStack API error:', errorData)
      return NextResponse.json({ 
        error: 'No security data available',
        details: errorData
      }, { status: 200 }) // Return 200 with error message instead of error status
    }

    const data = await response.json()
    
    // Check if the job is completed
    if (data.job_status !== 'completed') {
      return NextResponse.json({ 
        error: 'No security data available',
        job_status: data.job_status
      }, { status: 200 }) // Return 200 with error message instead of error status
    }

    return NextResponse.json({
      success: true,
      data: data.result
    })

  } catch (error) {
    console.error('Security API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch security data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
