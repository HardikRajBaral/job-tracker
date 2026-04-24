"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

interface CreateJobApplicationDialogProps {
  columnId: string;
  boardId: string;
}
const INITIAL_FORM_DATA = {
  company: "",
  position: "",
  location: "",
  notes: "",
  salary: "",
  jobUrl: "",
  tags: "",
  description: "",
};

export default function CreateJobApplicationDialog({
  columnId,
  boardId,
}: CreateJobApplicationDialogProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="w-full mb-4 justify-start text-muted-foreground border-dashed border-2 hover:border-solid hover:bg-muted/50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
          <DialogDescription>Track new job application.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input id="company" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position"> Position *</Label>
                <Input id="position " required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location </Label>
                <Input id="location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary"> Salary </Label>
                <Input id="salary" placeholder="e.g., $100k - $150k" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobUrl "> Job URL </Label>
              <Input id="jobUrl " placeholder="https://example.com/job" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tag (comma-separated)</Label>
              <Input id="tags" placeholder="e.g., Software Engineer, Remote" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Brief description of role"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes "> Notes </Label>
              <Textarea id="notes" rows={4} placeholder="Additional notes" />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
