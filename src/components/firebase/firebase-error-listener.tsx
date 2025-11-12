'use client';

import React, { useEffect, useState } from 'react';
import { errorEmitter, FirestorePermissionError } from '@/lib/errors';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '../ui/badge';
import { useAuth } from '@/context/auth-context';

export function FirebaseErrorListener() {
  const [error, setError] = useState<FirestorePermissionError | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleError = (e: FirestorePermissionError) => {
      setError(e);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.on('permission-error', () => {}); // Clear listener
    };
  }, []);

  const handleClose = () => {
    setError(null);
  };
  
  const getRulePath = (path: string) => {
      const parts = path.split('/');
      if (parts.length > 1) {
        return `/${parts[0]}/{${parts[0].slice(0, -1)}Id}`;
      }
      return path;
  }

  if (!error) {
    return null;
  }

  return (
    <AlertDialog open={!!error} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive font-headline flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-alert"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            Firestore Security Rule Error
          </AlertDialogTitle>
          <AlertDialogDescription>
            A security rule is preventing your request. Here is the context of the failed operation, which you can use to debug your `firestore.rules`.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="text-sm bg-muted/50 rounded-lg p-4 space-y-4">
            <div>
                <h3 className="font-semibold mb-1">Operation Details</h3>
                <div className="flex items-center gap-2">
                    <Badge variant="destructive">{error.operation.toUpperCase()}</Badge>
                    <code className="text-muted-foreground">{getRulePath(error.path)}</code>
                </div>
            </div>
            <div>
                 <h3 className="font-semibold mb-1">Authentication State</h3>
                {user ? (
                    <pre className="text-xs bg-background p-2 rounded overflow-auto">
                        {JSON.stringify({ auth: { uid: user.uid, token: { email: user.email, name: user.name, role: user.role } } }, null, 2)}
                    </pre>
                ): (
                    <pre className="text-xs bg-background p-2 rounded overflow-auto">
                        {JSON.stringify({ auth: null }, null, 2)}
                    </pre>
                )}
            </div>
            {error.resource && (
                <div>
                    <h3 className="font-semibold mb-1">Request Data</h3>
                    <pre className="text-xs bg-background p-2 rounded overflow-auto">
                        {JSON.stringify({ resource: { data: error.resource } }, null, 2)}
                    </pre>
                </div>
            )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose}>Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
