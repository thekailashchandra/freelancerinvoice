"use client";

import { useState, type FormEvent } from "react";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { submitSupportRequestClient } from "@/lib/api/support-client";
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

type SupportRequestFormProps = {
  source?: string;
};

export function SupportRequestForm({
  source = "support-page",
}: SupportRequestFormProps) {
  const { settings } = useProfile();
  const [requestType, setRequestType] = useState("Feature request");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setPending(true);
    try {
      const result = await submitSupportRequestClient({
        type: requestType,
        subject: String(formData.get("subject") ?? ""),
        message: String(formData.get("message") ?? ""),
        contactName: String(formData.get("contactName") ?? ""),
        contactEmail: String(formData.get("contactEmail") ?? ""),
        source,
      });

      if (result.ok) {
        toast.success("Request sent", { description: result.message });
        form.reset();
        setRequestType("Feature request");
        return;
      }

      toast.error("Could not send request", { description: result.message });
    } finally {
      setPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquarePlus className="h-4 w-4 text-primary" />
          Raise support or feature request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button type="submit" className="gap-2" disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Send request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
