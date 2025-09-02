import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldIcon, BuildingIcon } from "lucide-react";
import { useCurrentSupplier } from "@/hooks/useCurrentSupplier";
import { useSecurityData } from "@/hooks/useSecurityData";

export default function SupplierSecurityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Security Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your security posture and vulnerabilities
        </p>
      </div>

      <SecurityOverview />
    </div>
  );
}

function SecurityOverview() {
  const { supplier } = useCurrentSupplier();
  const { securityData, loading, error, refreshData } = useSecurityData(supplier?.domain || null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading security data...</p>
      </div>
    );
  }

  if (error || !securityData) {
    return (
      <div className="text-center p-6">
        <div className="max-w-md mx-auto">
          <ShieldIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Security Data Available</h3>
          <p className="text-muted-foreground mb-4">
            {supplier?.domain 
              ? "We couldn't retrieve security data for your domain. This could be due to network issues or the domain not being configured."
              : "No domain configured. Please add a domain to your profile to enable security monitoring."
            }
          </p>
          {supplier?.domain && (
            <Button variant="outline" onClick={refreshData}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Scorecard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5" />
                Security Scorecard
              </CardTitle>
              <CardDescription>Overall security posture and risk assessment</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={refreshData}>
              Refresh Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Overall Security Grade */}
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${
                securityData.grade === 'A' ? 'text-green-600' :
                securityData.grade === 'B' ? 'text-blue-600' :
                securityData.grade === 'C' ? 'text-yellow-600' :
                securityData.grade === 'D' ? 'text-orange-600' :
                securityData.grade === 'F' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {securityData.grade}
              </div>
              <p className="text-sm text-muted-foreground">Security Grade</p>
              <Badge variant="default" className={`mt-2 ${
                securityData.grade === 'A' ? 'bg-green-100 text-green-800' :
                securityData.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                securityData.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                securityData.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                securityData.grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {securityData.grade === 'A' ? 'Excellent' :
                 securityData.grade === 'B' ? 'Good' :
                 securityData.grade === 'C' ? 'Fair' :
                 securityData.grade === 'D' ? 'Poor' :
                 securityData.grade === 'F' ? 'Critical' : 'Unknown'}
              </Badge>
            </div>
            
            {/* Security Score */}
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {Math.round(securityData.grade === 'A' ? 90 : 
                            securityData.grade === 'B' ? 75 : 
                            securityData.grade === 'C' ? 60 : 
                            securityData.grade === 'D' ? 40 : 
                            securityData.grade === 'F' ? 20 : 50)}
              </div>
              <p className="text-sm text-muted-foreground">Security Score</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ 
                  width: `${securityData.grade === 'A' ? 90 : 
                            securityData.grade === 'B' ? 75 : 
                            securityData.grade === 'C' ? 60 : 
                            securityData.grade === 'D' ? 40 : 
                            securityData.grade === 'F' ? 20 : 50}%` 
                }}></div>
              </div>
            </div>
            
            {/* Risk Level */}
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                {securityData.vulnerabilities.length > 0 ? 
                  (securityData.vulnerabilities.some(v => v.severity === 'critical') ? 'Critical' :
                   securityData.vulnerabilities.some(v => v.severity === 'high') ? 'High' :
                   securityData.vulnerabilities.some(v => v.severity === 'medium') ? 'Medium' : 'Low') : 'Low'}
              </div>
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <Badge variant="secondary" className={`mt-2 ${
                securityData.vulnerabilities.some(v => v.severity === 'critical') ? 'bg-red-100 text-red-800' :
                securityData.vulnerabilities.some(v => v.severity === 'high') ? 'bg-orange-100 text-orange-800' :
                securityData.vulnerabilities.some(v => v.severity === 'medium') ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {securityData.vulnerabilities.some(v => v.severity === 'critical') ? 'Critical Risk' :
                 securityData.vulnerabilities.some(v => v.severity === 'high') ? 'High Risk' :
                 securityData.vulnerabilities.some(v => v.severity === 'medium') ? 'Medium Risk' : 'Low Risk'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* TLS Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5" />
              TLS Configuration
            </CardTitle>
            <CardDescription>Transport Layer Security details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">TLS Version:</span>
                <p className="font-medium">{securityData.tls.tls_version}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Cipher:</span>
                <p className="font-medium">{securityData.tls.cipher}</p>
              </div>
              <div>
                <span className="text-muted-foreground">HTTPS:</span>
                <Badge variant="default" className={securityData.tls.https ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {securityData.tls.https ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Certificate:</span>
                <p className="font-medium">{securityData.tls.days_left > 0 ? "Valid" : "Expired"}</p>
              </div>
            </div>
            <div className="pt-2">
              <span className="text-muted-foreground text-sm">Days until expiry:</span>
              <p className={`font-medium ${securityData.tls.days_left < 30 ? 'text-red-600' : securityData.tls.days_left < 90 ? 'text-yellow-600' : 'text-green-600'}`}>
                {securityData.tls.days_left} days
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BuildingIcon className="h-5 w-5" />
              Infrastructure Security
            </CardTitle>
            <CardDescription>Network and server security details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Open Ports:</span>
                <p className="font-medium">{securityData.ports.length} ports</p>
              </div>
              <div>
                <span className="text-muted-foreground">WAF Detected:</span>
                <Badge variant="outline" className={securityData.firewall.length > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {securityData.firewall.length > 0 ? "Yes" : "No"}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Subdomains:</span>
                <p className="font-medium">{securityData.subdomains.length} secured</p>
              </div>
              <div>
                <span className="text-muted-foreground">Blacklist Status:</span>
                <Badge variant="default" className={securityData.blacklist.failed.length === 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {securityData.blacklist.failed.length === 0 ? "Clean" : "Blacklisted"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vulnerabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5" />
              Vulnerabilities
            </CardTitle>
            <CardDescription>Identified security issues</CardDescription>
          </CardHeader>
          <CardContent>
            {securityData.vulnerabilities.length > 0 ? (
              <div className="space-y-3">
                {securityData.vulnerabilities.map((vuln, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                    vuln.severity === 'critical' ? 'bg-red-50 border-red-200' :
                    vuln.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                    vuln.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        vuln.severity === 'critical' ? 'bg-red-500' :
                        vuln.severity === 'high' ? 'bg-orange-500' :
                        vuln.severity === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-sm">{vuln.name.en}</p>
                        <p className="text-xs text-muted-foreground">{vuln.description.en}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`${
                      vuln.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      vuln.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      vuln.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {vuln.severity.charAt(0).toUpperCase() + vuln.severity.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-green-600 font-medium">No vulnerabilities detected</p>
                <p className="text-sm text-muted-foreground">This domain appears to be secure</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5" />
              Security Recommendations
            </CardTitle>
            <CardDescription>Actionable security improvements</CardDescription>
          </CardHeader>
          <CardContent>
            {securityData.recommendations.en.length > 0 ? (
              <div className="space-y-3">
                {securityData.recommendations.en.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-green-600 font-medium">No recommendations</p>
                <p className="text-sm text-muted-foreground">Security posture is optimal</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
