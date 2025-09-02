import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";

interface MainNavProps {
    header?: string;
}

export default function MainNav({ header = "" }: MainNavProps) {
    return (
        <nav className="w-full border-b border-b-foreground/10">
            <div className="flex justify-between items-center py-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                    <h1>{header}</h1>
                </div>
                {!hasEnvVars && <EnvVarWarning />}
            </div>
        </nav>
    )
}
