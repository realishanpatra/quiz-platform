import AuthForm from '@/components/auth/auth-form';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images.json'
import { Logo } from '@/components/ui/logo';

export default function Home() {
  const loginImage = placeholderImages.find(p => p.id === 'login-hero');
  
  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4 md:p-8 lg:p-12 order-2 lg:order-1">
        <div className="max-w-md w-full text-center">
            <div className="inline-block mb-4">
              <Logo />
            </div>
            <h1 className="text-4xl font-headline font-bold">Welcome to QuizVerse</h1>
            <p className="text-muted-foreground mt-2">
              Sign in or create an account to start your learning journey.
            </p>
        </div>
        <AuthForm />
      </div>
      <div className="relative h-64 lg:h-auto lg:flex-1 order-1 lg:order-2">
        {loginImage && (
          <Image
            src={loginImage.imageUrl}
            alt={loginImage.description}
            fill
            className="object-cover"
            data-ai-hint={loginImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent lg:bg-gradient-to-r" />
      </div>
    </main>
  );
}
