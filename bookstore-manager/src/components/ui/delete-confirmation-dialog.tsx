import { Button } from "@/components/ui/button";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
   isOpen: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void;
   isDeleting: boolean;
   itemName: string;
   itemType: string;
}

export function DeleteConfirmationDialog({
   isOpen,
   onOpenChange,
   onConfirm,
   isDeleting,
   itemName,
   itemType,
}: DeleteConfirmationDialogProps) {
   return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>
                  Are you sure? There can be data here!
               </AlertDialogTitle>
               <AlertDialogDescription>
                  This will permanently delete {itemType}{" "}
                  <span className="font-medium">{itemName}</span>. This action
                  cannot be undone.
               </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="gap-2">
               <AlertDialogCancel asChild>
                  <Button variant="outline">Cancel</Button>
               </AlertDialogCancel>
               <AlertDialogAction asChild>
                  <Button
                     variant="destructive"
                     onClick={onConfirm}
                     disabled={isDeleting}
                  >
                     {isDeleting ? "Deleting..." : "Confirm Delete"}
                  </Button>
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
