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

interface ResetConfirmationDialogProps {
   isOpen: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void;
   isResetting: boolean;
}

export function ResetConfirmationDialog({
   isOpen,
   onOpenChange,
   onConfirm,
   isResetting,
}: ResetConfirmationDialogProps) {
   return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Reset Database?</AlertDialogTitle>
               <AlertDialogDescription>
                  This will completely reset the database and delete all current
                  data. The database will be recreated with fresh sample data.
                  This action cannot be undone.
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
                     disabled={isResetting}
                  >
                     {isResetting ? "Resetting..." : "Reset Database"}
                  </Button>
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
