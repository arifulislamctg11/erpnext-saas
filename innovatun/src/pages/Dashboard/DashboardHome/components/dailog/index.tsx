"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog"
import { Button } from "../../../../../components/ui/button"
import TableFrom from "./form"




export function UserFormDialog() {
  const [open, setOpen] = useState(false)

 

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Information</DialogTitle>
        </DialogHeader>
        <TableFrom setOpen={setOpen}/>
      </DialogContent>
    </Dialog>
  )
}
