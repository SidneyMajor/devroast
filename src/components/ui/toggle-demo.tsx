"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

export function ToggleDemo() {
    const [roastMode, setRoastMode] = useState(true);
    const [strictMode, setStrictMode] = useState(false);

    return (
        <div className="flex gap-8">
            <Toggle checked={roastMode} onCheckedChange={setRoastMode} label="roast mode" />
            <Toggle checked={strictMode} onCheckedChange={setStrictMode} label="strict mode" />
        </div>
    );
}
