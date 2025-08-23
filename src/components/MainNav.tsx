import { hasEnvVars } from "@/lib/utils";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";

export default function MainNav() {
    return (
        <nav className="w-full border-b border-b-foreground/10">
            <div className="flex justify-between items-center py-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                    <h1>Test</h1>
                </div>
                {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            </div>
        </nav>
    )
}
