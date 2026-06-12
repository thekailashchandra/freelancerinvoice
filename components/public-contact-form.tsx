"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { submitSupportRequestClient } from "@/lib/api/support-client";
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

export function PublicContactForm() {
  const [requestType, setRequestType] = useState("General inquiry");
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
        source: "contact-page",
      });

      if (result.ok) {
        toast.success("Message sent", { description: result.message });
        form.reset();
        setRequestType("General inquiry");
        return;
      }

      toast.error("Could not send message", { description: result.message });
    } finally {
      setPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Mail className="h-4 w-4 text-primary" />
          Send us a message
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
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Topic</Label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General inquiry">General inquiry</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="Feature request">Feature request</SelectItem>
                <SelectItem value="Bug report">Bug report</SelectItem>
                <SelectItem value="Partnership">Partnership</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="How can we help?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Tell us what you need and we will get back to you."
              required
            />
          </div>

          <Button type="submit" className="gap-2" disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Send message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
