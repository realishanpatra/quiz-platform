'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, PlusCircle, Check, Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const questionSchema = z.object({
  text: z.string().min(1, 'Question text is required.'),
  options: z.array(z.object({ value: z.string().min(1, 'Option text is required.') })).min(2, 'At least two options are required.'),
  correctAnswer: z.string().min(1, 'You must select a correct answer.'),
});

const quizSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  questions: z.array(questionSchema).min(1, 'At least one question is required.'),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export function QuizForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      questions: [{ text: '', options: [{ value: '' }, { value: '' }], correctAnswer: '0' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const onSubmit = async (data: QuizFormValues) => {
    setIsSubmitting(true);
    console.log(data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: 'Quiz Created!',
      description: `The quiz "${data.title}" has been successfully created.`,
      action: <div className="p-2 rounded-full bg-green-500"><Check className="h-4 w-4 text-white"/></div>
    });
    router.push('/teacher/quizzes');
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Quiz Details</CardTitle>
            <CardDescription>Provide a title and description for your new quiz.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Quiz Title</FormLabel>
                <FormControl><Input placeholder="e.g., Introduction to Photosynthesis" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Quiz Description</FormLabel>
                <FormControl><Textarea placeholder="A brief summary of what this quiz covers." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline">Question {index + 1}</CardTitle>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name={`questions.${index}.text`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl><Input placeholder="What is the capital of France?" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <Separator />
              
              <FormLabel>Options</FormLabel>
               <FormField control={form.control} name={`questions.${index}.correctAnswer`} render={({ field }) => (
                 <FormItem>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                            <QuestionOptions control={form.control} questionIndex={index} />
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                 </FormItem>
               )} />
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-between items-center">
            <Button type="button" variant="outline" onClick={() => append({ text: '', options: [{ value: '' }, { value: '' }], correctAnswer: '0' })}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
            </Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Quiz
            </Button>
        </div>
      </form>
    </Form>
  );
}

function QuestionOptions({ control, questionIndex }: { control: any, questionIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  return (
      <div className="space-y-2">
        {fields.map((field, optionIndex) => (
             <FormField key={field.id} control={control} name={`questions.${questionIndex}.options.${optionIndex}.value`} render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value={optionIndex.toString()} id={`q${questionIndex}-o${optionIndex}`} />
                            <Input placeholder={`Option ${optionIndex + 1}`} {...field} />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(optionIndex)} disabled={fields.length <= 2}>
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </FormControl>
                     <FormMessage />
                </FormItem>
             )} />
        ))}
         <Button type="button" size="sm" variant="ghost" onClick={() => append({ value: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Option
        </Button>
      </div>
  );
}
