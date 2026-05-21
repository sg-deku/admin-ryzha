"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Plan {
  id: string
  name: string
}

interface ApprovalActionsProps {
  organizationId: string
  plans: Plan[]
}

export function ApprovalActions({ organizationId, plans }: ApprovalActionsProps) {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState(plans[0]?.id ?? "")
  const [loading, setLoading] = useState(false)

  async function handleAction(action: "approve" | "reject") {
    setLoading(true)
    await fetch("/api/pending-approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId,
        action,
        defaultPlanId: action === "approve" ? selectedPlan : undefined,
      }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-3 shrink-0">
      {plans.length > 0 && (
        <Select value={selectedPlan} onValueChange={setSelectedPlan}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Default plan" />
          </SelectTrigger>
          <SelectContent>
            {plans.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Button
        size="sm"
        variant="default"
        onClick={() => handleAction("approve")}
        disabled={loading}
      >
        Approve
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleAction("reject")}
        disabled={loading}
      >
        Reject
      </Button>
    </div>
  )
}
