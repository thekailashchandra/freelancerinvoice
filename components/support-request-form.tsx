"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import {
  submitSupportRequestAction,
  type SupportFormState,
} from "@/lib/actions/support";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="gap-2" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Send request
    </Button>
  );
}

type SupportRequestFormProps = {
  source?: string;
};

export function SupportRequestForm({
  source = "support-page",
}: SupportRequestFormProps) {
  const { settings } = useProfile();
  const [requestType, setRequestType] = useState("Feature request");
  const [state, formAction] = useActionState<SupportFormState, FormData>(
    submitSupportRequestAction,
    null
  );

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Request sent", { description: state.message });
      return;
    }
    toast.error("Could not send request", { description: state.message });
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquarePlus className="h-4 w-4 text-primary" />
          Raise support or feature request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="source" value={source} />
          <input type="hidden" name="type" value={requestType} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactName">Your name</Label>
              <Input
                id="contactName"
                name="contactName"
                defaultValue={settings.companyName}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                defaultValue={settings.companyEmail}
                placeholder="you@company.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Request type</Label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Feature request">Feature request</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="Bug report">Bug report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Need custom invoice template support"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Details</Label>
            <Textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Describe what you need, expected behavior, and any extra context."
              required
            />
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
